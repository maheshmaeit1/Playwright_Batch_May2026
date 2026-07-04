pipeline {
    agent any

    parameters {
        string(name: 'JIRA_ISSUE', defaultValue: 'SCRUM-2', description: 'Jira issue key to test (e.g., SCRUM-2)')
        string(name: 'APP_URL', defaultValue: 'http://localhost:3000', description: 'Application URL to test')
        booleanParam(name: 'SKIP_TEST_GENERATION', defaultValue: false, description: 'Skip test generation (use existing test cases)')
    }

    environment {
        // Local paths
        PROJECT_DIR = "${WORKSPACE}"
        TEST_CASES_DIR = "${WORKSPACE}/manual-testing/test-cases"
        TEST_RESULTS_DIR = "${WORKSPACE}/results"
        EVIDENCE_DIR = "${WORKSPACE}/results/evidence"
        LOGS_DIR = "${WORKSPACE}/results/logs"

        // Issue specific paths
        TEST_CASE_FILE = "${TEST_CASES_DIR}/${JIRA_ISSUE}-test-cases.md"
        TEST_RESULT_FILE = "${TEST_RESULTS_DIR}/${JIRA_ISSUE}-test-results.md"

        // Build info
        BUILD_INFO = """
Build: ${BUILD_NUMBER}
Job: ${JOB_NAME}
Time: ${BUILD_TIMESTAMP}
Issue: ${JIRA_ISSUE}
App URL: ${APP_URL}
"""
    }

    options {
        timestamps()
        timeout(time: 2, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {
        stage('Initialize') {
            steps {
                script {
                    echo "=========================================="
                    echo "QA Test Automation Pipeline (Local)"
                    echo "=========================================="
                    echo "Build Number: ${BUILD_NUMBER}"
                    echo "Job Name: ${JOB_NAME}"
                    echo "Jira Issue: ${JIRA_ISSUE}"
                    echo "App URL: ${APP_URL}"
                    echo "Workspace: ${WORKSPACE}"
                    echo "=========================================="

                    // Create result directories
                    sh '''
                        mkdir -p ${TEST_RESULTS_DIR}
                        mkdir -p ${EVIDENCE_DIR}
                        mkdir -p ${LOGS_DIR}

                        echo "✓ Created result directories"
                        echo "  - ${TEST_RESULTS_DIR}"
                        echo "  - ${EVIDENCE_DIR}"
                        echo "  - ${LOGS_DIR}"
                    '''
                }
            }
        }

        stage('Generate Test Cases') {
            when {
                expression { !params.SKIP_TEST_GENERATION }
            }
            steps {
                script {
                    echo "🟣 Stage: Generate Test Cases"
                    echo "-------------------------------------------"
                    echo "Using jira-test-generator agent..."
                    echo "Issue: ${JIRA_ISSUE}"
                    echo "Output: ${TEST_CASE_FILE}"

                    try {
                        sh '''
                            echo "Generating test cases for ${JIRA_ISSUE}..." > ${LOGS_DIR}/generation.log

                            # Call Claude via CLI to generate test cases
                            echo "📝 Requesting Claude to generate test cases..."

                            # Create a prompt file for test generation
                            cat > /tmp/generate_tests.txt << 'PROMPT'
You are the jira-test-generator agent running locally.

Task: Generate comprehensive test cases for Jira issue: ${JIRA_ISSUE}

Instructions:
1. Fetch the Jira issue details
2. Analyze the requirements and acceptance criteria
3. Generate 5-10 detailed test cases that cover:
   - Happy path scenarios (normal user workflow)
   - Edge cases and boundary conditions
   - Error handling and validation
   - User interface elements
   - Data persistence

For each test case include:
- Clear title describing what is being tested
- Objective statement
- Preconditions (what needs to be set up)
- Numbered test steps (specific actions)
- Expected results (what should happen)
- Test data (if applicable)

Format the output as a markdown file suitable for manual testing.
Save the file to: ${TEST_CASE_FILE}

Start generating test cases now.
PROMPT

                            echo "Prompt created. Invoking Claude CLI..."
                            echo "$(cat /tmp/generate_tests.txt)" >> ${LOGS_DIR}/generation.log

                            # Call Claude Code with jira-test-generator agent
                            # Note: This uses Claude CLI which should be available locally
                            claude-code --agent jira-test-generator "Generate test cases for ${JIRA_ISSUE}" >> ${LOGS_DIR}/generation.log 2>&1 || true

                            # If file was created
                            if [ -f "${TEST_CASE_FILE}" ]; then
                                echo "✅ Test cases generated successfully"
                                echo "File: ${TEST_CASE_FILE}"
                                wc -l ${TEST_CASE_FILE}
                            else
                                echo "⚠️  Test case file not found. Checking for existing file..."
                                if [ -f "${TEST_CASES_DIR}/${JIRA_ISSUE}-test-cases.md" ]; then
                                    echo "Using existing test case file"
                                else
                                    echo "No test cases found. Proceeding with manual test cases..."
                                fi
                            fi
                        '''
                    } catch (Exception e) {
                        echo "⚠️  Test generation had issues, but continuing..."
                        sh 'cat ${LOGS_DIR}/generation.log || true'
                    }
                }
            }
        }

        stage('Verify Test Cases') {
            steps {
                script {
                    echo "🔍 Stage: Verify Test Cases"
                    echo "-------------------------------------------"

                    sh '''
                        # Check if test case file exists
                        if [ -f "${TEST_CASE_FILE}" ]; then
                            echo "✅ Test case file found: ${TEST_CASE_FILE}"
                            echo ""
                            echo "File size: $(stat -c%s ${TEST_CASE_FILE}) bytes"
                            echo "Number of lines: $(wc -l < ${TEST_CASE_FILE})"
                            echo ""
                            echo "Preview (first 30 lines):"
                            echo "---"
                            head -n 30 "${TEST_CASE_FILE}"
                            echo "---"
                        else
                            echo "❌ Test case file not found!"
                            echo "Expected: ${TEST_CASE_FILE}"
                            echo "Available files:"
                            ls -la ${TEST_CASES_DIR}/ || echo "Test cases directory not found"
                            exit 1
                        fi
                    '''
                }
            }
        }

        stage('Execute Tests') {
            steps {
                script {
                    echo "🔵 Stage: Execute Tests"
                    echo "-------------------------------------------"
                    echo "Using manual-test-runner agent..."
                    echo "Test Cases: ${TEST_CASE_FILE}"
                    echo "Results: ${TEST_RESULT_FILE}"

                    sh '''
                        echo "Starting test execution..." > ${LOGS_DIR}/execution.log
                        echo "Timestamp: $(date)" >> ${LOGS_DIR}/execution.log
                        echo "App URL: ${APP_URL}" >> ${LOGS_DIR}/execution.log
                        echo "" >> ${LOGS_DIR}/execution.log

                        # Create execution prompt
                        cat > /tmp/execute_tests.txt << 'PROMPT'
You are the manual-test-runner agent running locally.

Task: Execute test cases and document results

Instructions:
1. Read the test cases from: ${TEST_CASE_FILE}
2. Navigate to the application at: ${APP_URL}
3. Execute each test case step-by-step:
   - For each test, follow the steps exactly
   - Verify expected results match actual results
   - Note any failures or unexpected behavior
4. For failed tests:
   - Take screenshots
   - Document what went wrong
   - Note the error messages
5. Create a detailed results file

Output format - Create a markdown file with:
- Overall statistics (passed/failed/total)
- For each test case:
  - Test ID and title
  - Status (✅ PASS or ❌ FAIL)
  - If FAIL: screenshot path and error description
- Summary and recommendations

Save results to: ${TEST_RESULT_FILE}
Save evidence to: ${EVIDENCE_DIR}/

Start executing test cases now.
PROMPT

                        echo "$(cat /tmp/execute_tests.txt)" >> ${LOGS_DIR}/execution.log

                        # Call Claude Code with manual-test-runner agent
                        echo "📝 Invoking Claude CLI with manual-test-runner agent..."
                        claude-code --agent manual-test-runner "Execute all test cases from ${TEST_CASE_FILE} and save results to ${TEST_RESULT_FILE}" >> ${LOGS_DIR}/execution.log 2>&1 || true

                        echo ""
                        echo "Test execution completed"
                        echo "Execution log: ${LOGS_DIR}/execution.log"
                    '''
                }
            }
        }

        stage('Collect Results') {
            steps {
                script {
                    echo "📊 Stage: Collect Results"
                    echo "-------------------------------------------"

                    sh '''
                        # Check if results file was created
                        if [ -f "${TEST_RESULT_FILE}" ]; then
                            echo "✅ Test results file found"
                            echo "File: ${TEST_RESULT_FILE}"
                            echo "Size: $(stat -c%s ${TEST_RESULT_FILE}) bytes"
                            echo ""
                            echo "Results Preview:"
                            echo "---"
                            head -n 50 "${TEST_RESULT_FILE}"
                            echo "---"
                        else
                            echo "⚠️  Test results file not found at: ${TEST_RESULT_FILE}"
                            echo "Creating placeholder results file..."

                            cat > "${TEST_RESULT_FILE}" << 'EOF'
# Test Results for ${JIRA_ISSUE}

**Execution Time**: $(date)
**Status**: Test execution in progress or pending

## Summary
- Waiting for test execution to complete
- Check logs for details: ${LOGS_DIR}/execution.log

EOF
                        fi

                        # List all files in results directory
                        echo ""
                        echo "Files in results directory (${TEST_RESULTS_DIR}):"
                        ls -lah ${TEST_RESULTS_DIR}/ || echo "Directory empty"

                        echo ""
                        echo "Evidence files (${EVIDENCE_DIR}):"
                        ls -lah ${EVIDENCE_DIR}/ || echo "No evidence files yet"
                    '''
                }
            }
        }

        stage('Parse Metrics') {
            steps {
                script {
                    echo "📈 Stage: Parse Metrics"
                    echo "-------------------------------------------"

                    sh '''
                        # Create a metrics summary
                        cat > ${TEST_RESULTS_DIR}/METRICS.txt << 'EOF'
=====================================
TEST EXECUTION METRICS
=====================================
Build Number: ${BUILD_NUMBER}
Job Name: ${JOB_NAME}
Jira Issue: ${JIRA_ISSUE}
Execution Date: $(date)

Test Execution Summary:
EOF

                        # Parse results if file exists
                        if [ -f "${TEST_RESULT_FILE}" ]; then
                            echo "Parsing test results..." >> ${TEST_RESULTS_DIR}/METRICS.txt

                            # Count pass/fail (simple pattern matching)
                            PASSED=$(grep -c "✅\|PASS" "${TEST_RESULT_FILE}" || echo "0")
                            FAILED=$(grep -c "❌\|FAIL" "${TEST_RESULT_FILE}" || echo "0")
                            TOTAL=$((PASSED + FAILED))

                            if [ $TOTAL -gt 0 ]; then
                                PASS_RATE=$((PASSED * 100 / TOTAL))
                            else
                                PASS_RATE=0
                            fi

                            cat >> ${TEST_RESULTS_DIR}/METRICS.txt << EOF

Total Tests: ${TOTAL}
Passed: ${PASSED}
Failed: ${FAILED}
Pass Rate: ${PASS_RATE}%

EOF
                        fi

                        # Append logs info
                        cat >> ${TEST_RESULTS_DIR}/METRICS.txt << 'EOF'

Log Files:
EOF
                        ls -1 ${LOGS_DIR}/ >> ${TEST_RESULTS_DIR}/METRICS.txt 2>&1 || echo "No logs" >> ${TEST_RESULTS_DIR}/METRICS.txt

                        echo "✅ Metrics summary created"
                        echo ""
                        echo "📊 Test Metrics:"
                        cat ${TEST_RESULTS_DIR}/METRICS.txt
                    '''
                }
            }
        }

        stage('Generate Report') {
            steps {
                script {
                    echo "📄 Stage: Generate Report"
                    echo "-------------------------------------------"

                    sh '''
                        # Create comprehensive report
                        cat > ${TEST_RESULTS_DIR}/REPORT.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Test Report - ${JIRA_ISSUE}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 5px; }
        .section { background: white; margin: 20px 0; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .metric-card { background: #ecf0f1; padding: 15px; border-radius: 5px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #2c3e50; }
        .metric-label { font-size: 12px; color: #7f8c8d; }
        .pass { color: #27ae60; }
        .fail { color: #e74c3c; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #34495e; color: white; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ecf0f1; }
        tr:hover { background: #f9f9f9; }
        .footer { text-align: center; color: #7f8c8d; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Test Execution Report</h1>
        <p>Jira Issue: ${JIRA_ISSUE} | Build: ${BUILD_NUMBER} | Date: $(date)</p>
    </div>

    <div class="section">
        <h2>Execution Summary</h2>
        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value">-</div>
                <div class="metric-label">Total Tests</div>
            </div>
            <div class="metric-card">
                <div class="metric-value pass">-</div>
                <div class="metric-label">Passed</div>
            </div>
            <div class="metric-card">
                <div class="metric-value fail">-</div>
                <div class="metric-label">Failed</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">-%</div>
                <div class="metric-label">Pass Rate</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Test Results</h2>
        <p><a href="${TEST_RESULT_FILE}">View Detailed Results</a></p>
    </div>

    <div class="section">
        <h2>Evidence & Logs</h2>
        <ul>
            <li>Evidence: ${EVIDENCE_DIR}/</li>
            <li>Logs: ${LOGS_DIR}/</li>
        </ul>
    </div>

    <div class="footer">
        <p>Generated by Jenkins | Local QA Pipeline</p>
    </div>
</body>
</html>
EOF

                        echo "✅ Report generated: ${TEST_RESULTS_DIR}/REPORT.html"
                    '''
                }
            }
        }

        stage('Archive Results') {
            steps {
                script {
                    echo "📦 Stage: Archive Results"
                    echo "-------------------------------------------"

                    sh '''
                        # Create summary
                        echo "🎯 Test Execution Summary"
                        echo "========================================"
                        echo "Jira Issue: ${JIRA_ISSUE}"
                        echo "Build: ${BUILD_NUMBER}"
                        echo "Results Location: ${TEST_RESULTS_DIR}"
                        echo ""
                        echo "📁 Generated Files:"
                        ls -lh ${TEST_RESULTS_DIR}/ | grep -v "^total" || true
                        echo ""
                        echo "📊 Artifacts:"
                        echo "  • Test Cases: ${TEST_CASE_FILE}"
                        echo "  • Test Results: ${TEST_RESULT_FILE}"
                        echo "  • Metrics: ${TEST_RESULTS_DIR}/METRICS.txt"
                        echo "  • Report: ${TEST_RESULTS_DIR}/REPORT.html"
                        echo "  • Evidence: ${EVIDENCE_DIR}/"
                        echo "  • Logs: ${LOGS_DIR}/"
                        echo ""
                        echo "✅ All results stored in: ${TEST_RESULTS_DIR}"
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                echo ""
                echo "=========================================="
                echo "PIPELINE SUMMARY"
                echo "=========================================="
                echo "Build Number: ${BUILD_NUMBER}"
                echo "Status: ${currentBuild.result}"
                echo "Duration: ${currentBuild.durationString}"
                echo "Results: ${TEST_RESULTS_DIR}"
                echo "=========================================="

                // Archive all results
                archiveArtifacts artifacts: 'results/**', allowEmptyArchive: true

                // Clean up temp files
                sh 'rm -f /tmp/generate_tests.txt /tmp/execute_tests.txt'
            }
        }

        success {
            script {
                echo "✅ Pipeline completed successfully"
                sh '''
                    echo "Build completed successfully" >> ${TEST_RESULTS_DIR}/BUILD_STATUS.txt
                    echo "Time: $(date)" >> ${TEST_RESULTS_DIR}/BUILD_STATUS.txt
                '''
            }
        }

        failure {
            script {
                echo "❌ Pipeline failed"
                sh '''
                    echo "Build failed" >> ${TEST_RESULTS_DIR}/BUILD_STATUS.txt
                    echo "Time: $(date)" >> ${TEST_RESULTS_DIR}/BUILD_STATUS.txt
                    echo "Check logs: ${LOGS_DIR}/" >> ${TEST_RESULTS_DIR}/BUILD_STATUS.txt
                '''
            }
        }

        cleanup {
            // Keep results, only clean temporary files
            sh 'echo "Cleanup complete"'
        }
    }
}
