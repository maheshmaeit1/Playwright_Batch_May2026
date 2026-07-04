pipeline {
    agent any

    parameters {
        string(name: 'JIRA_ISSUE', defaultValue: 'SCRUM-2', description: 'Jira issue key to test (e.g., SCRUM-2)')
        string(name: 'APP_URL', defaultValue: 'https://demowebshop.tricentis.com/', description: 'Application URL to test')
        booleanParam(name: 'SKIP_TEST_GENERATION', defaultValue: false, description: 'Skip test generation (use existing test cases)')
    }

    environment {
        JIRA_ISSUE = "${params.JIRA_ISSUE}"
        APP_URL    = "${params.APP_URL}"

        PROJECT_DIR = "${WORKSPACE}"
        TEST_CASES_DIR = "${WORKSPACE}/manual-testing/test-cases"
        TEST_RESULTS_DIR = "${WORKSPACE}/results"
        EVIDENCE_DIR = "${WORKSPACE}/results/evidence"
        LOGS_DIR = "${WORKSPACE}/results/logs"

        TEST_CASE_FILE = "${TEST_CASES_DIR}/${JIRA_ISSUE}-test-cases.md"
        TEST_RESULT_FILE = "${TEST_RESULTS_DIR}/${JIRA_ISSUE}-test-results.md"
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
                    env.BUILD_TIMESTAMP = powershell(script: 'Get-Date -Format "yyyy-MM-dd HH:mm:ss"', returnStdout: true).trim()

                    echo "=========================================="
                    echo "QA Test Automation Pipeline (Windows)"
                    echo "=========================================="
                    echo "Build Number: ${BUILD_NUMBER}"
                    echo "Job Name: ${JOB_NAME}"
                    echo "Jira Issue: ${JIRA_ISSUE}"
                    echo "App URL: ${APP_URL}"
                    echo "Timestamp: ${env.BUILD_TIMESTAMP}"
                    echo "Workspace: ${WORKSPACE}"
                    echo "=========================================="

                    powershell '''
                        New-Item -ItemType Directory -Force -Path $env:TEST_RESULTS_DIR | Out-Null
                        New-Item -ItemType Directory -Force -Path $env:EVIDENCE_DIR | Out-Null
                        New-Item -ItemType Directory -Force -Path $env:LOGS_DIR | Out-Null

                        Write-Host "Created result directories"
                        Write-Host "  - $env:TEST_RESULTS_DIR"
                        Write-Host "  - $env:EVIDENCE_DIR"
                        Write-Host "  - $env:LOGS_DIR"
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
                    echo "Issue: ${JIRA_ISSUE}"
                    echo "Output: ${TEST_CASE_FILE}"

                    try {
                        powershell '''
                            Write-Host "Invoking jira-test-generator agent via Claude Code..."

                            # Create output directory
                            New-Item -ItemType Directory -Force -Path (Split-Path $env:TEST_CASE_FILE) | Out-Null

                            # Invoke Claude Code with jira-test-generator agent
                            $prompt = @"
Generate comprehensive manual test cases for SCRUM-2: Product Search Functionality

Application: $env:APP_URL
Test User: neuralqaacademy@gmail.com / Tester@123

Requirements:
- Search for "Computer" keyword
- Verify search results load
- Verify "Simple Computer" product present in list

Create detailed test case(s) in markdown format:
- Test case title (TC-XXX)
- Objective
- Preconditions
- Numbered test steps (plain language, no code)
- Expected results
- Test data

Save to: $env:TEST_CASE_FILE
"@

                            Write-Host "Sending request to Claude..."
                            & claude-code --agent jira-test-generator $prompt

                            # Check if file was created
                            Start-Sleep -Seconds 2

                            if (Test-Path $env:TEST_CASE_FILE) {
                                Write-Host "✅ Test cases generated successfully"
                                Write-Host "File: $env:TEST_CASE_FILE"
                                $fileSize = (Get-Item $env:TEST_CASE_FILE).Length
                                Write-Host "Size: $fileSize bytes"

                                # Show preview
                                Write-Host ""
                                Write-Host "Preview (first 20 lines):"
                                Get-Content $env:TEST_CASE_FILE -TotalCount 20
                            } else {
                                Write-Host "⚠️  Test case file not created by agent"
                                Write-Host "Expected: $env:TEST_CASE_FILE"
                            }
                        '''
                    } catch (Exception e) {
                        echo "⚠️  Test generation warning: ${e.message}"
                        echo "Continuing with existing test cases if available..."
                    }
                }
            }
        }

        stage('Verify Test Cases') {
            steps {
                script {
                    echo "Stage: Verify Test Cases"
                    echo "-------------------------------------------"

                    powershell '''
                        if (Test-Path $env:TEST_CASE_FILE) {
                            Write-Host "Test case file found: $env:TEST_CASE_FILE"
                            Write-Host ""
                            Write-Host "File size: $((Get-Item $env:TEST_CASE_FILE).Length) bytes"
                            Write-Host "Number of lines: $((Get-Content $env:TEST_CASE_FILE).Count)"
                            Write-Host ""
                            Write-Host "Preview (first 30 lines):"
                            Write-Host "---"
                            Get-Content $env:TEST_CASE_FILE -TotalCount 30
                            Write-Host "---"
                        } else {
                            Write-Host "Test case file not found!"
                            Write-Host "Expected: $env:TEST_CASE_FILE"
                            Write-Host "Available files:"
                            if (Test-Path $env:TEST_CASES_DIR) {
                                Get-ChildItem $env:TEST_CASES_DIR
                            } else {
                                Write-Host "Test cases directory not found"
                            }
                            exit 1
                        }
                    '''
                }
            }
        }

        stage('Execute Tests') {
            steps {
                script {
                    echo "🔵 Stage: Execute Tests"
                    echo "-------------------------------------------"
                    echo "Test Cases: ${TEST_CASE_FILE}"
                    echo "Results: ${TEST_RESULT_FILE}"

                    try {
                        powershell '''
                        "Starting test execution..." | Out-File -FilePath "$env:LOGS_DIR\\execution.log"
                        "Timestamp: $(Get-Date)" | Add-Content -Path "$env:LOGS_DIR\\execution.log"
                        "App URL: $env:APP_URL" | Add-Content -Path "$env:LOGS_DIR\\execution.log"
                        "" | Add-Content -Path "$env:LOGS_DIR\\execution.log"

                        $promptPath = Join-Path $env:TEMP "execute_tests_$env:BUILD_NUMBER.txt"
@"
You are the manual-test-runner agent running locally.

Task: Execute test cases and document results

Instructions:
1. Read the test cases from: $env:TEST_CASE_FILE
2. Navigate to the application at: $env:APP_URL
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
  - Status (PASS or FAIL)
  - If FAIL: screenshot path and error description
- Summary and recommendations

Save results to: $env:TEST_RESULT_FILE
Save evidence to: $env:EVIDENCE_DIR\\

Start executing test cases now.
"@ | Out-File -FilePath $promptPath -Encoding utf8

                        Get-Content $promptPath | Add-Content -Path "$env:LOGS_DIR\\execution.log"

                        Write-Host "Invoking manual-test-runner agent via Claude Code..."

                        & claude-code --agent manual-test-runner @"
Execute all test cases from: $env:TEST_CASE_FILE

Application: $env:APP_URL
Test User: neuralqaacademy@gmail.com / Tester@123

Execute each test case step-by-step:
1. Follow the test steps exactly
2. Document PASS or FAIL for each step
3. Take screenshots only if test fails
4. Document actual vs expected results

Save results to: $env:TEST_RESULT_FILE

Output in markdown format with:
- Test case ID and title
- Status (PASS or FAIL)
- Observations and findings
"@

                        Start-Sleep -Seconds 2

                        if (Test-Path $env:TEST_RESULT_FILE) {
                            Write-Host "✅ Test results saved successfully"
                            Write-Host "File: $env:TEST_RESULT_FILE"
                        } else {
                            Write-Host "⚠️  Results file not created"
                        }

                        Remove-Item $promptPath -Force -ErrorAction SilentlyContinue
                    '''
                    } catch (Exception e) {
                        echo "⚠️  Test execution warning: ${e.message}"
                        echo "Check logs for details..."
                    }
                }
            }
        }

        stage('Collect Results') {
            steps {
                script {
                    echo "Stage: Collect Results"
                    echo "-------------------------------------------"

                    powershell '''
                        if (Test-Path $env:TEST_RESULT_FILE) {
                            Write-Host "Test results file found"
                            Write-Host "File: $env:TEST_RESULT_FILE"
                            Write-Host "Size: $((Get-Item $env:TEST_RESULT_FILE).Length) bytes"
                            Write-Host ""
                            Write-Host "Results Preview:"
                            Write-Host "---"
                            Get-Content $env:TEST_RESULT_FILE -TotalCount 50
                            Write-Host "---"
                        } else {
                            Write-Host "Test results file not found at: $env:TEST_RESULT_FILE"
                            Write-Host "Creating placeholder results file..."
                            $now = Get-Date
@"
# Test Results for $env:JIRA_ISSUE

**Execution Time**: $now
**Status**: Test execution in progress or pending

## Summary
- Waiting for test execution to complete
- Check logs for details: $env:LOGS_DIR\\execution.log
"@ | Out-File -FilePath $env:TEST_RESULT_FILE -Encoding utf8
                        }

                        Write-Host ""
                        Write-Host "Files in results directory ($env:TEST_RESULTS_DIR):"
                        if (Test-Path $env:TEST_RESULTS_DIR) { Get-ChildItem $env:TEST_RESULTS_DIR } else { Write-Host "Directory empty" }

                        Write-Host ""
                        Write-Host "Evidence files ($env:EVIDENCE_DIR):"
                        if (Test-Path $env:EVIDENCE_DIR) { Get-ChildItem $env:EVIDENCE_DIR } else { Write-Host "No evidence files yet" }
                    '''
                }
            }
        }

        stage('Parse Metrics') {
            steps {
                script {
                    echo "Stage: Parse Metrics"
                    echo "-------------------------------------------"

                    powershell '''
                        $metricsPath = Join-Path $env:TEST_RESULTS_DIR "METRICS.txt"
                        $now = Get-Date
@"
=====================================
TEST EXECUTION METRICS
=====================================
Build Number: $env:BUILD_NUMBER
Job Name: $env:JOB_NAME
Jira Issue: $env:JIRA_ISSUE
Execution Date: $now

Test Execution Summary:
"@ | Out-File -FilePath $metricsPath -Encoding utf8

                        if (Test-Path $env:TEST_RESULT_FILE) {
                            Add-Content -Path $metricsPath -Value "Parsing test results..."

                            $content = Get-Content $env:TEST_RESULT_FILE
                            $passed = ($content | Select-String "PASS").Count
                            $failed = ($content | Select-String "FAIL").Count
                            $total = $passed + $failed
                            if ($total -gt 0) { $passRate = [math]::Round(($passed * 100) / $total) } else { $passRate = 0 }

                            Add-Content -Path $metricsPath -Value ""
                            Add-Content -Path $metricsPath -Value "Total Tests: $total"
                            Add-Content -Path $metricsPath -Value "Passed: $passed"
                            Add-Content -Path $metricsPath -Value "Failed: $failed"
                            Add-Content -Path $metricsPath -Value "Pass Rate: $passRate%"
                        }

                        Add-Content -Path $metricsPath -Value ""
                        Add-Content -Path $metricsPath -Value "Log Files:"
                        if (Test-Path $env:LOGS_DIR) {
                            Get-ChildItem $env:LOGS_DIR | Select-Object -ExpandProperty Name | Add-Content -Path $metricsPath
                        } else {
                            Add-Content -Path $metricsPath -Value "No logs"
                        }

                        Write-Host "Metrics summary created"
                        Write-Host ""
                        Write-Host "Test Metrics:"
                        Get-Content $metricsPath
                    '''
                }
            }
        }

        stage('Generate Report') {
            steps {
                script {
                    echo "Stage: Generate Report"
                    echo "-------------------------------------------"

                    powershell '''
                        $now = Get-Date
                        $reportPath = Join-Path $env:TEST_RESULTS_DIR "REPORT.html"
@"
<!DOCTYPE html>
<html>
<head>
    <title>Test Report - $env:JIRA_ISSUE</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 5px; }
        .section { background: white; margin: 20px 0; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .footer { text-align: center; color: #7f8c8d; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Test Execution Report</h1>
        <p>Jira Issue: $env:JIRA_ISSUE | Build: $env:BUILD_NUMBER | Date: $now</p>
    </div>

    <div class="section">
        <h2>Test Results</h2>
        <p><a href="$env:TEST_RESULT_FILE">View Detailed Results</a></p>
        <p><a href="METRICS.txt">View Metrics</a></p>
    </div>

    <div class="section">
        <h2>Evidence and Logs</h2>
        <ul>
            <li>Evidence: $env:EVIDENCE_DIR\\</li>
            <li>Logs: $env:LOGS_DIR\\</li>
        </ul>
    </div>

    <div class="footer">
        <p>Generated by Jenkins | Local QA Pipeline</p>
    </div>
</body>
</html>
"@ | Out-File -FilePath $reportPath -Encoding utf8

                        Write-Host "Report generated: $reportPath"
                    '''
                }
            }
        }

        stage('Archive Results') {
            steps {
                script {
                    echo "Stage: Archive Results"
                    echo "-------------------------------------------"

                    powershell '''
                        Write-Host "Test Execution Summary"
                        Write-Host "========================================"
                        Write-Host "Jira Issue: $env:JIRA_ISSUE"
                        Write-Host "Build: $env:BUILD_NUMBER"
                        Write-Host "Results Location: $env:TEST_RESULTS_DIR"
                        Write-Host ""
                        Write-Host "Generated Files:"
                        Get-ChildItem $env:TEST_RESULTS_DIR | Format-Table Name, Length -AutoSize | Out-String | Write-Host
                        Write-Host "Artifacts:"
                        Write-Host "  - Test Cases: $env:TEST_CASE_FILE"
                        Write-Host "  - Test Results: $env:TEST_RESULT_FILE"
                        Write-Host "  - Metrics: $env:TEST_RESULTS_DIR\\METRICS.txt"
                        Write-Host "  - Report: $env:TEST_RESULTS_DIR\\REPORT.html"
                        Write-Host "  - Evidence: $env:EVIDENCE_DIR\\"
                        Write-Host "  - Logs: $env:LOGS_DIR\\"
                        Write-Host ""
                        Write-Host "All results stored in: $env:TEST_RESULTS_DIR"
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
                echo "Status: ${currentBuild.currentResult}"
                echo "Duration: ${currentBuild.durationString}"
                echo "Results: ${TEST_RESULTS_DIR}"
                echo "=========================================="

                archiveArtifacts artifacts: 'results/**', allowEmptyArchive: true
            }
        }

        success {
            powershell '''
                Add-Content -Path "$env:TEST_RESULTS_DIR\\BUILD_STATUS.txt" -Value "Build completed successfully"
                Add-Content -Path "$env:TEST_RESULTS_DIR\\BUILD_STATUS.txt" -Value "Time: $(Get-Date)"
            '''
        }

        failure {
            powershell '''
                Add-Content -Path "$env:TEST_RESULTS_DIR\\BUILD_STATUS.txt" -Value "Build failed"
                Add-Content -Path "$env:TEST_RESULTS_DIR\\BUILD_STATUS.txt" -Value "Time: $(Get-Date)"
                Add-Content -Path "$env:TEST_RESULTS_DIR\\BUILD_STATUS.txt" -Value "Check logs: $env:LOGS_DIR\\"
            '''
        }

        cleanup {
            echo "Cleanup complete"
        }
    }
}