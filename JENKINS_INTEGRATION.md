# Jenkins Integration Guide for Claude Agents

This guide shows how to integrate the `jira-test-generator` and `manual-test-runner` agents with Jenkins CI/CD pipeline.

---

## Overview

### What We'll Accomplish

```
Jira Issue Created
        ↓
[Jenkins Pipeline Triggered]
        ↓
jira-test-generator (Generate test cases)
        ↓
manual-test-runner (Execute tests)
        ↓
[Report Results → Jira]
        ↓
[Archive Artifacts]
```

### Integration Methods

| Method | Complexity | Best For |
|--------|-----------|----------|
| Claude CLI | Low | Simple scripts, prototyping |
| Claude API | Medium | Programmatic control, error handling |
| Python SDK | Medium | Complex workflows, integrations |
| Groovy Script | Medium | Jenkins native, full pipeline control |

---

## Method 1: Claude CLI Integration (Simplest)

### Prerequisites

1. **Install Claude CLI** on Jenkins agent
```bash
# On Jenkins agent machine
npm install -g @anthropic-ai/claude-code
```

2. **Configure Claude CLI** 
```bash
# Login and configure
claude-code login
```

### Jenkins Pipeline Script

```groovy
pipeline {
    agent any
    
    stages {
        stage('Generate Test Cases') {
            steps {
                script {
                    echo "Generating test cases from Jira..."
                    sh '''
                        # Call claude-code with the jira-test-generator agent
                        claude-code --agent jira-test-generator \
                            --message "Create test cases for SCRUM-${JIRA_ISSUE_ID}"
                    '''
                }
            }
        }
        
        stage('Execute Tests') {
            steps {
                script {
                    echo "Executing generated test cases..."
                    sh '''
                        claude-code --agent manual-test-runner \
                            --message "Execute test cases from manual-testing/test-cases/SCRUM-${JIRA_ISSUE_ID}-test-cases.md"
                    '''
                }
            }
        }
        
        stage('Archive Results') {
            steps {
                archiveArtifacts artifacts: 'manual-testing/test-results/**/*.md'
                archiveArtifacts artifacts: 'manual-testing/evidence/**/*.png'
            }
        }
    }
    
    post {
        always {
            // Generate test report
            publishHTML([
                reportDir: 'manual-testing/test-results',
                reportFiles: 'SCRUM-*.md',
                reportName: 'Test Results Report'
            ])
        }
        failure {
            echo "Test execution failed. Check logs above."
        }
    }
}
```

---

## Method 2: Claude API Integration (Recommended)

### Setup

1. **Get Claude API Key**
   - Get key from https://console.anthropic.com
   - Add as Jenkins credential: `CLAUDE_API_KEY`

2. **Create Agent Invocation Script**

Create file: `scripts/invoke_agent.py`

```python
#!/usr/bin/env python3
"""
Invoke Claude agents for test generation and execution
"""

import os
import json
import subprocess
import sys
from anthropic import Anthropic

client = Anthropic(api_key=os.environ.get("CLAUDE_API_KEY"))

def invoke_jira_test_generator(jira_issue_key):
    """
    Invoke jira-test-generator agent to create test cases
    """
    print(f"[Agent] Generating test cases for {jira_issue_key}...")
    
    message = client.messages.create(
        model="claude-opus-4-1",
        max_tokens=4096,
        system="""You are the jira-test-generator agent. 
        Your task is to fetch the Jira issue and generate comprehensive test cases.
        Save test cases to manual-testing/test-cases/{ISSUE_KEY}-test-cases.md""",
        messages=[
            {
                "role": "user",
                "content": f"Generate comprehensive test cases for Jira issue {jira_issue_key}. Include happy paths, edge cases, and error scenarios."
            }
        ]
    )
    
    print(f"[Agent] Test case generation complete")
    return message.content[0].text


def invoke_manual_test_runner(test_case_file):
    """
    Invoke manual-test-runner agent to execute tests
    """
    print(f"[Agent] Executing test cases from {test_case_file}...")
    
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system="""You are the manual-test-runner agent.
        Your task is to execute the provided test cases and document results.
        Take screenshots for any failures.
        Save results to manual-testing/test-results/""",
        messages=[
            {
                "role": "user",
                "content": f"Execute all test cases in {test_case_file} and save results with evidence of any failures."
            }
        ]
    )
    
    print(f"[Agent] Test execution complete")
    return message.content[0].text


def main():
    if len(sys.argv) < 3:
        print("Usage: invoke_agent.py <agent> <argument>")
        print("  agent: 'generate' or 'execute'")
        print("  argument: JIRA issue key or test case file")
        sys.exit(1)
    
    agent = sys.argv[1]
    argument = sys.argv[2]
    
    try:
        if agent == "generate":
            result = invoke_jira_test_generator(argument)
        elif agent == "execute":
            result = invoke_manual_test_runner(argument)
        else:
            print(f"Unknown agent: {agent}")
            sys.exit(1)
        
        print(result)
        return 0
    except Exception as e:
        print(f"[Error] Agent invocation failed: {str(e)}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
```

### Jenkins Pipeline with API

```groovy
pipeline {
    agent any
    
    environment {
        CLAUDE_API_KEY = credentials('claude-api-key')
        JIRA_ISSUE_ID = "${JIRA_ISSUE_ID ?: 'SCRUM-2'}"
    }
    
    stages {
        stage('Prepare') {
            steps {
                script {
                    echo "Preparing test environment..."
                    sh 'pip install anthropic'
                }
            }
        }
        
        stage('Generate Test Cases') {
            steps {
                script {
                    echo "🟣 Generating test cases for ${JIRA_ISSUE_ID}..."
                    sh '''
                        python3 scripts/invoke_agent.py generate ${JIRA_ISSUE_ID}
                    '''
                }
            }
        }
        
        stage('Execute Tests') {
            steps {
                script {
                    echo "🔵 Executing generated test cases..."
                    sh '''
                        python3 scripts/invoke_agent.py execute \
                            "manual-testing/test-cases/${JIRA_ISSUE_ID}-test-cases.md"
                    '''
                }
            }
        }
        
        stage('Publish Results') {
            steps {
                archiveArtifacts artifacts: 'manual-testing/test-results/**'
                archiveArtifacts artifacts: 'manual-testing/evidence/**'
            }
        }
    }
    
    post {
        always {
            script {
                // Parse results and comment on Jira
                sh '''
                    # Extract test results
                    if [ -f "manual-testing/test-results/${JIRA_ISSUE_ID}-test-results.md" ]; then
                        echo "Test execution results:"
                        cat "manual-testing/test-results/${JIRA_ISSUE_ID}-test-results.md"
                    fi
                '''
            }
        }
        failure {
            echo "Pipeline failed. Check artifacts for details."
        }
    }
}
```

---

## Method 3: Complete Jenkins Pipeline (Full Featured)

```groovy
@Library('shared-library') _

pipeline {
    agent {
        node {
            label 'playwright'
        }
    }
    
    parameters {
        string(name: 'JIRA_ISSUE_ID', defaultValue: 'SCRUM-2', description: 'Jira issue to test')
        choice(name: 'AGENT_ACTION', choices: ['generate', 'execute', 'both'], description: 'Action to perform')
        booleanParam(name: 'PUBLISH_RESULTS', defaultValue: true, description: 'Publish results to Jira')
    }
    
    environment {
        CLAUDE_API_KEY = credentials('claude-api-key')
        JIRA_API_TOKEN = credentials('jira-api-token')
        APP_URL = 'https://staging.app.com'
        REPORT_DIR = "${WORKSPACE}/manual-testing"
    }
    
    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '30'))
    }
    
    stages {
        stage('Initialize') {
            steps {
                script {
                    echo "=========================================="
                    echo "QA Test Automation Pipeline"
                    echo "=========================================="
                    echo "Jira Issue: ${JIRA_ISSUE_ID}"
                    echo "Action: ${AGENT_ACTION}"
                    echo "Environment: ${APP_URL}"
                    echo "=========================================="
                    
                    // Install dependencies
                    sh '''
                        pip install anthropic jira requests --quiet
                    '''
                }
            }
        }
        
        stage('Fetch Jira Issue') {
            steps {
                script {
                    echo "📋 Fetching Jira issue: ${JIRA_ISSUE_ID}"
                    sh '''
                        python3 << 'EOF'
import os
from jira import JIRA

jira = JIRA(
    server='https://neuralqaacademy.atlassian.net',
    basic_auth=('neuralqaacademy@gmail.com', os.environ.get('JIRA_API_TOKEN'))
)

issue = jira.issue('${JIRA_ISSUE_ID}')
print(f"Issue: {issue.key}")
print(f"Summary: {issue.fields.summary}")
print(f"Status: {issue.fields.status.name}")
print(f"Description: {issue.fields.description}")
EOF
                    '''
                }
            }
        }
        
        stage('Generate Test Cases') {
            when {
                expression { 
                    params.AGENT_ACTION == 'generate' || params.AGENT_ACTION == 'both'
                }
            }
            steps {
                script {
                    echo "🟣 Generating test cases using jira-test-generator..."
                    sh '''
                        python3 << 'EOF'
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ.get("CLAUDE_API_KEY"))

prompt = """
You are the jira-test-generator agent.

Generate comprehensive test cases for Jira issue: ${JIRA_ISSUE_ID}

Requirements:
1. Fetch the issue details from Jira
2. Analyze acceptance criteria
3. Create 5-10 detailed test cases covering:
   - Happy path scenarios
   - Edge cases and boundary conditions
   - Error handling
   - Data validation
4. Save to: manual-testing/test-cases/${JIRA_ISSUE_ID}-test-cases.md
5. Include traceability matrix

Output the test cases in markdown format.
"""

response = client.messages.create(
    model="claude-opus-4-1",
    max_tokens=4096,
    messages=[{"role": "user", "content": prompt}]
)

print(response.content[0].text)
EOF
                    '''
                }
            }
        }
        
        stage('Execute Tests') {
            when {
                expression { 
                    params.AGENT_ACTION == 'execute' || params.AGENT_ACTION == 'both'
                }
            }
            steps {
                script {
                    echo "🔵 Executing test cases using manual-test-runner..."
                    sh '''
                        python3 << 'EOF'
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ.get("CLAUDE_API_KEY"))

prompt = """
You are the manual-test-runner agent.

Execute all test cases from: manual-testing/test-cases/${JIRA_ISSUE_ID}-test-cases.md

Requirements:
1. Read the test cases from the markdown file
2. Navigate to the application at: ${APP_URL}
3. Execute each test case step-by-step
4. Document pass/fail status
5. Capture screenshots for any failures
6. Save results to: manual-testing/test-results/${JIRA_ISSUE_ID}-test-results.md
7. Include execution summary and metrics

Output the test results in markdown format.
"""

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=4096,
    messages=[{"role": "user", "content": prompt}]
)

print(response.content[0].text)
EOF
                    '''
                }
            }
        }
        
        stage('Parse Results') {
            steps {
                script {
                    echo "📊 Parsing test results..."
                    sh '''
                        python3 << 'EOF'
import os
import re
import json

results_file = f"manual-testing/test-results/${JIRA_ISSUE_ID}-test-results.md"

if os.path.exists(results_file):
    with open(results_file, 'r') as f:
        content = f.read()
    
    # Extract metrics
    passed = len(re.findall(r'✅|PASS', content))
    failed = len(re.findall(r'❌|FAIL', content))
    total = passed + failed
    
    print(f"Total Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Pass Rate: {(passed/total*100 if total > 0 else 0):.1f}%")
    
    # Save metrics
    metrics = {
        "total": total,
        "passed": passed,
        "failed": failed,
        "pass_rate": (passed/total*100 if total > 0 else 0)
    }
    
    with open('test-metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)
else:
    print("Results file not found")
EOF
                    '''
                }
            }
        }
        
        stage('Publish to Jira') {
            when {
                expression { params.PUBLISH_RESULTS == true }
            }
            steps {
                script {
                    echo "📤 Publishing results back to Jira..."
                    sh '''
                        python3 << 'EOF'
import os
import json
from jira import JIRA

# Read metrics
with open('test-metrics.json', 'r') as f:
    metrics = json.load(f)

# Connect to Jira
jira = JIRA(
    server='https://neuralqaacademy.atlassian.net',
    basic_auth=('neuralqaacademy@gmail.com', os.environ.get('JIRA_API_TOKEN'))
)

# Add comment to issue
issue = jira.issue('${JIRA_ISSUE_ID}')

comment = f"""
Test Execution Report
====================
Job: {os.environ.get('BUILD_URL', 'N/A')}
Total Tests: {metrics['total']}
Passed: {metrics['passed']}
Failed: {metrics['failed']}
Pass Rate: {metrics['pass_rate']:.1f}%

[View Full Report|{os.environ.get('BUILD_URL', '')}artifact/]
"""

issue.add_comment(comment)
print("✓ Comment added to Jira issue")
EOF
                    '''
                }
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'manual-testing/**/*.md,manual-testing/**/*.png'
                archiveArtifacts artifacts: 'test-metrics.json'
                publishHTML([
                    reportDir: 'manual-testing',
                    reportFiles: 'test-results/*.md',
                    reportName: 'Test Results'
                ])
            }
        }
    }
    
    post {
        always {
            script {
                // Cleanup
                sh '''
                    echo "Cleaning up temporary files..."
                '''
            }
            
            // Generate summary
            echo "=========================================="
            echo "Pipeline Summary"
            echo "=========================================="
            script {
                if (fileExists('test-metrics.json')) {
                    def metrics = readJSON file: 'test-metrics.json'
                    echo "✓ Total Tests: ${metrics.total}"
                    echo "✓ Passed: ${metrics.passed}"
                    echo "✗ Failed: ${metrics.failed}"
                    echo "✓ Pass Rate: ${metrics.pass_rate.toFloat().round(1)}%"
                }
            }
        }
        
        success {
            echo "✅ Pipeline completed successfully"
        }
        
        failure {
            echo "❌ Pipeline failed"
            emailext(
                subject: "Test Pipeline Failed: ${JIRA_ISSUE_ID}",
                body: "Check logs at: ${BUILD_URL}",
                to: "${CHANGE_AUTHOR_EMAIL}"
            )
        }
    }
}
```

---

## Jenkins Credentials Setup

Add these credentials to Jenkins:

### 1. Claude API Key
```
Type: Secret text
ID: claude-api-key
Secret: [Your Claude API Key]
```

### 2. Jira API Token
```
Type: Secret text
ID: jira-api-token
Secret: [Your Jira API Token]
```

### 3. (Optional) GitHub Token
```
Type: Secret text
ID: github-token
Secret: [GitHub token for publishing results]
```

---

## Webhook Integration (Trigger on Jira Events)

### 1. Create Jenkins Webhook URL

```
https://your-jenkins-instance.com/job/TestAutomation/buildWithParameters?
JIRA_ISSUE_ID=${issue.key}&
AGENT_ACTION=both&
PUBLISH_RESULTS=true
```

### 2. Add Jira Webhook

In Jira > Settings > Webhooks:
```
Event: Issue Transitioned (Status: Ready for Testing)
URL: [Jenkins webhook URL above]
```

---

## Scheduled Pipeline (Run Daily/On Schedule)

```groovy
pipeline {
    agent any
    
    triggers {
        // Run every day at 9 AM
        cron('0 9 * * *')
        
        // Or trigger on JIRA issue creation
        // githubPush() - if using GitHub webhook
    }
    
    parameters {
        string(name: 'JIRA_JQL', defaultValue: 'project=SCRUM AND status="Ready for Testing"', description: 'JQL query for issues to test')
    }
    
    stages {
        stage('Find Issues to Test') {
            steps {
                script {
                    sh '''
                        python3 << 'EOF'
import os
from jira import JIRA

jira = JIRA(
    server='https://neuralqaacademy.atlassian.net',
    basic_auth=('neuralqaacademy@gmail.com', os.environ.get('JIRA_API_TOKEN'))
)

issues = jira.search_issues('${JIRA_JQL}')
print(f"Found {len(issues)} issues to test:")
for issue in issues:
    print(f"  - {issue.key}: {issue.fields.summary}")
EOF
                    '''
                }
            }
        }
        
        stage('Generate and Execute Tests') {
            steps {
                script {
                    sh '''
                        # Run for each issue found
                        python3 << 'EOF'
import subprocess
import os
from jira import JIRA

jira = JIRA(
    server='https://neuralqaacademy.atlassian.net',
    basic_auth=('neuralqaacademy@gmail.com', os.environ.get('JIRA_API_TOKEN'))
)

issues = jira.search_issues('${JIRA_JQL}')

for issue in issues:
    print(f"\n{'='*50}")
    print(f"Testing: {issue.key} - {issue.fields.summary}")
    print('='*50)
    
    # Trigger test generation and execution
    # subprocess.run(['bash', 'scripts/test_issue.sh', issue.key])
EOF
                    '''
                }
            }
        }
    }
}
```

---

## Dockerized Jenkins Agent (Optional)

Create `Dockerfile` for Jenkins agent with Claude CLI:

```dockerfile
FROM jenkins/inbound-agent:latest

USER root

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    nodejs \
    npm

# Install Claude CLI
RUN npm install -g @anthropic-ai/claude-code

# Install Python packages
RUN pip3 install anthropic jira requests playwright

USER jenkins
```

Build and use:
```bash
docker build -t jenkins-claude-agent .
docker run -d jenkins-claude-agent
```

---

## Troubleshooting

### Issue: Agent not found in Jenkins
**Solution**: Ensure agents are properly registered in `.claude/agents/` directory

### Issue: Jenkins can't access Jira
**Solution**: Check Jira API token and network connectivity

### Issue: Tests timeout
**Solution**: Increase timeout in pipeline: `timeout(time: 2, unit: 'HOURS')`

### Issue: Results not publishing to Jira
**Solution**: Verify Jira credentials and API permissions

---

## Best Practices

✅ **DO**:
- Use parameters for flexibility
- Archive artifacts for audit trail
- Publish results to Jira for visibility
- Use proper error handling
- Schedule regular test runs
- Monitor agent logs

❌ **DON'T**:
- Hardcode credentials in pipeline
- Skip error handling
- Run in production without approval
- Assume tests always pass
- Forget to clean up artifacts

---

## Summary

You can integrate Claude agents with Jenkins through:

1. **Claude CLI** - Simplest approach for quick integration
2. **Claude API** - Most flexible and powerful
3. **Complete Pipeline** - Full-featured with Jira integration
4. **Webhooks** - Automatic triggering on Jira events
5. **Scheduled Jobs** - Regular automated testing

Choose the method that best fits your CI/CD workflow! 🚀
