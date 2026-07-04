# Local Jenkins Setup Guide

Quick guide to run the Jenkinsfile locally with Claude available by default.

---

## 📋 Prerequisites

✅ Jenkins installed locally  
✅ Claude CLI installed (`npm install -g @anthropic-ai/claude-code`)  
✅ Python 3 installed  
✅ Git installed  
✅ Your application running (or set APP_URL to target URL)  

---

## 🚀 Quick Start (5 minutes)

### Step 1: Verify Prerequisites

```bash
# Check Jenkins
java -version

# Check Claude CLI
claude-code --version

# Check Python
python3 --version

# Check Git
git --version
```

### Step 2: Create Jenkins Job

1. Open Jenkins: `http://localhost:8080`
2. Click **New Item**
3. Enter Job Name: `NeuralQA-Test-Automation`
4. Select **Pipeline**
5. Click **OK**

### Step 3: Configure Pipeline

In the Pipeline section:

**Definition**: Pipeline script from SCM  
**SCM**: Git  
**Repository URL**: `file:///path/to/your/repo` (or GitHub URL)  
**Branch**: `*/main` (or your branch)  
**Script Path**: `Jenkinsfile`

Click **Save**

### Step 4: Build Parameters (Optional)

Add these build parameters to the job:

```
String Parameter:
  Name: JIRA_ISSUE
  Default: SCRUM-2
  Description: Jira issue key to test

String Parameter:
  Name: APP_URL
  Default: http://localhost:3000
  Description: Application URL to test

Boolean Parameter:
  Name: SKIP_TEST_GENERATION
  Default: false
  Description: Skip test generation
```

### Step 5: Run the Job

1. Click **Build with Parameters**
2. Enter:
   - JIRA_ISSUE: `SCRUM-2`
   - APP_URL: `http://localhost:3000`
   - SKIP_TEST_GENERATION: `false`
3. Click **Build**

---

## 📊 Expected Output

### Console Output
```
==========================================
QA Test Automation Pipeline (Local)
==========================================
Build Number: 1
Job Name: NeuralQA-Test-Automation
Jira Issue: SCRUM-2
App URL: http://localhost:3000
Workspace: /var/lib/jenkins/workspace/NeuralQA-Test-Automation
==========================================

🟣 Stage: Generate Test Cases
-------------------------------------------
Using jira-test-generator agent...
...
✅ Test cases generated successfully

🔍 Stage: Verify Test Cases
-------------------------------------------
✅ Test case file found: .../manual-testing/test-cases/SCRUM-2-test-cases.md

🔵 Stage: Execute Tests
-------------------------------------------
Using manual-test-runner agent...
...
Test execution completed

📊 Stage: Collect Results
-------------------------------------------
✅ Test results file found

📈 Stage: Parse Metrics
-------------------------------------------
✅ Metrics summary created

📄 Stage: Generate Report
-------------------------------------------
✅ Report generated

📦 Stage: Archive Results
-------------------------------------------
🎯 Test Execution Summary
==========================================
```

### Result Files in `results/` folder

```
results/
├── SCRUM-2-test-cases.md          # Generated test cases
├── SCRUM-2-test-results.md        # Test execution results
├── METRICS.txt                     # Test metrics
├── REPORT.html                     # HTML report
├── BUILD_STATUS.txt                # Build status
├── evidence/                       # Screenshots of failures
│   ├── screenshot-TC-001.png
│   ├── screenshot-TC-004.png
│   └── ...
└── logs/                           # Execution logs
    ├── generation.log
    └── execution.log
```

---

## 🔧 Configuration Details

### Environment Variables (auto-set by Jenkinsfile)

```
PROJECT_DIR = ${WORKSPACE}
TEST_CASES_DIR = ${WORKSPACE}/manual-testing/test-cases
TEST_RESULTS_DIR = ${WORKSPACE}/results          ← Main results folder
EVIDENCE_DIR = ${WORKSPACE}/results/evidence
LOGS_DIR = ${WORKSPACE}/results/logs
```

### Customization

Edit the Jenkinsfile to customize:

```groovy
// Change timeout (currently 2 hours)
timeout(time: 2, unit: 'HOURS')

// Change build history kept (currently 20)
buildDiscarder(logRotator(numToKeepStr: '20'))

// Change parameter defaults
string(name: 'JIRA_ISSUE', defaultValue: 'SCRUM-2', ...)
```

---

## 📁 Folder Structure After First Build

```
workspace/NeuralQA-Test-Automation/
├── Jenkinsfile                             ← Pipeline definition
├── manual-testing/
│   ├── test-cases/
│   │   └── SCRUM-2-test-cases.md          # Generated
│   └── ...
├── results/                                ← Created by Jenkins
│   ├── SCRUM-2-test-cases.md
│   ├── SCRUM-2-test-results.md            # Key output
│   ├── METRICS.txt
│   ├── REPORT.html
│   ├── BUILD_STATUS.txt
│   ├── evidence/                          # Screenshots
│   │   ├── screenshot-*.png
│   │   └── ...
│   └── logs/
│       ├── generation.log
│       └── execution.log
└── other source files...
```

---

## 🎯 Running Tests for Different Issues

### Option 1: Build with Different Parameters

Click **Build with Parameters** and change:
```
JIRA_ISSUE: SCRUM-3
APP_URL: http://localhost:3000
```

### Option 2: Programmatically Trigger

```bash
# Via curl
curl -X POST http://localhost:8080/job/NeuralQA-Test-Automation/buildWithParameters \
  -F JIRA_ISSUE=SCRUM-3 \
  -F APP_URL=http://localhost:3000

# Via Jenkins CLI
java -jar jenkins-cli.jar -s http://localhost:8080 \
  build NeuralQA-Test-Automation \
  -p JIRA_ISSUE=SCRUM-3 \
  -p APP_URL=http://localhost:3000
```

---

## 🔄 Workflow

### Complete Workflow Example

```
1. Developer creates Jira issue: SCRUM-5
   ↓
2. QA clicks "Build with Parameters"
   - JIRA_ISSUE: SCRUM-5
   - APP_URL: http://localhost:3000
   ↓
3. Jenkins Pipeline Starts:
   - Stage 1: Generate Test Cases (jira-test-generator)
     Output: results/SCRUM-5-test-cases.md
   - Stage 2: Execute Tests (manual-test-runner)
     Output: results/SCRUM-5-test-results.md
   - Stage 3: Collect Results
     Output: results/METRICS.txt, evidence/*, logs/*
   - Stage 4: Archive
     Output: All results saved locally
   ↓
4. QA Reviews Results:
   - View results/SCRUM-5-test-results.md
   - Check evidence/ for failure screenshots
   - Review results/METRICS.txt for summary
   ↓
5. Report to Team:
   - Pass/fail status
   - Any defects found
   - Recommended actions
```

---

## 🐛 Troubleshooting

### Issue: "claude-code not found"

**Solution**: Claude CLI not in PATH

```bash
# Install globally
npm install -g @anthropic-ai/claude-code

# Or add to Jenkins PATH
# Jenkins > Manage Jenkins > Configure System > Global properties
# Add: PATH=/usr/local/bin:$PATH
```

### Issue: "Jira API authentication failed"

**Solution**: Claude needs Atlassian authentication

```bash
# Run on Jenkins agent machine
claude-code login
# Then authenticate with Atlassian
```

### Issue: "Test cases not generated"

**Solution**: Check logs

```bash
# View generation log
cat results/logs/generation.log

# Possible causes:
# - Jira issue doesn't exist
# - Claude CLI not authenticated
# - Network connectivity issues
```

### Issue: "App URL not reachable"

**Solution**: Verify application is running

```bash
# Test connectivity
curl http://localhost:3000

# If app is on different port, pass as parameter:
# APP_URL=http://localhost:5000
```

### Issue: "Permission denied" on results folder

**Solution**: Jenkins user needs write permissions

```bash
# On Linux/Mac
sudo chown jenkins:jenkins /path/to/workspace

# Or run Jenkins with sudo (not recommended)
```

---

## 📈 Monitoring & Analytics

### View Recent Builds

```
Jenkins Home → NeuralQA-Test-Automation → Build History
```

### Download Results

```
Jenkins Home → NeuralQA-Test-Automation → Build #X → Artifacts
```

Artifacts include:
- Test results markdown files
- Evidence screenshots
- Execution logs
- Metrics summary

### Trend Analysis

Jenkins automatically tracks:
- Build success/failure rate
- Build duration
- Number of test cases per issue
- Pass/fail trends over time

---

## 🔐 Security Notes

⚠️ **For Local Development**:
- No credentials needed for Jira/Claude (uses local CLI)
- Results stored locally on disk
- No external API calls needed

⚠️ **For Production Use**:
- Add Atlassian API token to Jenkins Credentials
- Use environment variables for sensitive data
- Implement proper access controls
- Encrypt stored results

---

## 📊 Generated Artifacts

### METRICS.txt
```
=====================================
TEST EXECUTION METRICS
=====================================
Build Number: 1
Job Name: NeuralQA-Test-Automation
Jira Issue: SCRUM-2
Execution Date: 2026-07-04

Test Execution Summary:
Total Tests: 8
Passed: 7
Failed: 1
Pass Rate: 87%
```

### REPORT.html
- Visual dashboard with metrics
- Pass/fail breakdown
- Evidence and logs links
- Quick summary view

### Test Results Markdown
```
# Test Results for SCRUM-2

## Execution Summary
- Total Tests: 8
- Passed: 7 ✅
- Failed: 1 ❌
- Pass Rate: 87%

## Test Case Results
- TC-001: ✅ PASS
- TC-002: ✅ PASS
- ...
- TC-004: ❌ FAIL
  - Error: Login button unresponsive
  - Screenshot: evidence/TC-004-failure.png
```

---

## 🚀 Next Steps

1. **Run First Build**: Execute with SCRUM-2 to test setup
2. **Review Results**: Check the `results/` folder
3. **Customize**: Modify Jenkinsfile for your needs
4. **Schedule**: Set up periodic builds if desired
5. **Integrate**: Connect to Jira webhooks for auto-triggering

---

## 📞 Quick Reference

| Task | Command/Steps |
|------|--------------|
| Start Jenkins | `jenkins` or `java -jar jenkins.war` |
| Access Jenkins | `http://localhost:8080` |
| Create Job | New Item → Pipeline → Configure |
| Run Build | Build with Parameters → Set JIRA_ISSUE |
| View Results | Jenkins Workspace → results/ folder |
| Check Logs | Build Console Output or results/logs/ |
| Update Jenkinsfile | Edit file in repo, commit, Jenkins auto-rebuilds |

---

## ✅ Success Criteria

Your setup is working when:

✅ Jenkins job appears in job list  
✅ Build starts and shows all stages  
✅ `results/` folder is created with files  
✅ `SCRUM-2-test-cases.md` is generated  
✅ `SCRUM-2-test-results.md` is created  
✅ Evidence screenshots are saved  
✅ `METRICS.txt` shows test results  
✅ All artifacts are archived  

**Congratulations! Your local Jenkins pipeline is ready! 🎉**
