# Automated Test Management Workflow

This guide shows how to use both agents together in a complete QA workflow.

## Your Two Plugin Agents

### 🟣 jira-test-generator
- Fetches requirements from Jira
- Analyzes acceptance criteria
- Generates comprehensive test cases
- Creates traceability to Jira issues

### 🔵 manual-test-runner
- Executes test cases step-by-step
- Validates application behavior
- Documents test results
- Identifies and reports defects

---

## Complete Workflow

### Phase 1: Requirements → Test Cases (Jira Test Generator)

```
Step 1: Prepare Jira Issue
├─ Create/update Jira issue with clear requirements
├─ Write detailed acceptance criteria
├─ Add story points and priority
└─ Add labels for organization

Step 2: Generate Test Cases
├─ Request: "Use jira-test-generator to create test cases for SCRUM-2"
├─ Agent fetches issue from Jira
├─ Analyzes requirements and creates test cases
└─ Saves to: manual-testing/test-cases/SCRUM-2-test-cases.md

Step 3: Review Generated Cases
├─ Check test case coverage
├─ Verify all acceptance criteria are covered
├─ Validate test steps are clear and specific
└─ Approve for execution
```

### Phase 2: Test Execution (Manual Test Runner)

```
Step 1: Prepare for Testing
├─ Set up test environment
├─ Ensure application is running
├─ Gather test data
└─ Verify network connectivity

Step 2: Execute Tests
├─ Request: "Use manual-test-runner to execute SCRUM-2-test-cases.md"
├─ Agent navigates through application
├─ Executes each test step
├─ Documents results and screenshots
└─ Identifies any issues

Step 3: Document Results
├─ Agent saves results to: manual-testing/test-results/SCRUM-2-test-results.md
├─ Pass/fail status for each test case
├─ Screenshots of failures
├─ Console errors and network issues noted
└─ Execution summary provided
```

### Phase 3: Defect Management

```
Step 1: Review Failed Tests
├─ Analyze test results
├─ Identify root causes
└─ Determine if it's a defect or test issue

Step 2: Report Defects
├─ Use defect-template.md to document issues
├─ Include steps to reproduce
├─ Attach evidence (screenshots)
├─ Save to: manual-testing/defects/
└─ Link back to test case and Jira issue

Step 3: Track Resolution
├─ Monitor defect status in Jira
├─ Retest when fix is deployed
├─ Close defect when verified
└─ Update test results
```

---

## Example Workflow: End-to-End

### Scenario: Testing a Login Feature

#### Day 1: Test Design Phase

**1. Create Jira Issue** (already created as SCRUM-2)
```
Title: Implement Login Functionality
Description: Users should be able to log in with email and password
Acceptance Criteria:
- User can login with valid email and password
- System shows error for invalid credentials
- Password is masked while typing
- Login button is disabled until all fields are filled
- Successful login redirects to dashboard
```

**2. Generate Test Cases**
```bash
User Request:
"Use jira-test-generator to create test cases for SCRUM-2. 
Create comprehensive test cases for login feature including:
- Happy path (valid login)
- Error scenarios (invalid credentials)
- Validation (empty fields)
- UI/UX (password masking, button states)
- Edge cases (special characters, case sensitivity)"

Agent Actions:
✓ Fetches SCRUM-2 from Jira
✓ Analyzes acceptance criteria
✓ Creates 8 detailed test cases
✓ Saves to manual-testing/test-cases/SCRUM-2-test-cases.md
✓ Creates traceability matrix
✓ Generates example output (see SCRUM-2-test-cases.md)

Result: 8 test cases ready for execution
```

#### Day 2: Test Execution Phase

**1. Set Up Environment**
```
- Browser: Chrome latest
- Environment: Staging
- Test User Account: Created
- Network: Verified stable
```

**2. Execute Test Cases**
```bash
User Request:
"Use manual-test-runner to execute all test cases in 
manual-testing/test-cases/SCRUM-2-test-cases.md
Document results in manual-testing/test-results/SCRUM-2-test-results.md
Include screenshots for any failures."

Agent Actions:
✓ Loads SCRUM-2-test-cases.md
✓ Starts browser and navigates to application
✓ Executes TC-001: Feature Access
  - Navigates to login page ✅
  - Verifies all UI elements ✅
✓ Executes TC-002: Default State
  - Checks initial form state ✅
✓ Executes TC-003: Valid Login
  - Enters credentials ✅
  - Submits form ✅
  - Verifies redirect ✅
✓ Executes TC-004: Invalid Login
  - Tries invalid credentials
  - Verifies error message ❌ FAILED
  - Takes screenshot of failure
✓ Continues with remaining test cases...

Results:
- TC-001: ✅ PASS
- TC-002: ✅ PASS
- TC-003: ✅ PASS
- TC-004: ❌ FAIL - Error message not displayed
- TC-005: ✅ PASS
- TC-006: ✅ PASS
- TC-007: ✅ PASS
- TC-008: ✅ PASS

Summary: 7/8 tests passed (87.5% success rate)
```

#### Day 3: Defect Review & Reporting

**1. Analyze Failed Test**
```
TC-004 FAILED: Invalid Login Error Message Not Displayed

Expected: Error message "Invalid credentials" should appear
Actual: No error message displayed, page remains on login form
Steps: 
1. Navigate to login
2. Enter invalid email: wrong@example.com
3. Enter invalid password: wrongpassword
4. Click login
5. Expected: Error message
   Actual: No change, no message

This is a legitimate defect.
```

**2. Create Defect Report**
```
File: manual-testing/defects/DEF-001.md

Title: Login Error Message Not Displayed for Invalid Credentials
Severity: High
Steps to Reproduce:
1. Navigate to login page
2. Enter email: wrong@example.com
3. Enter password: wrongpassword
4. Click login button
Expected: Error message "Invalid credentials" appears
Actual: No error message, page remains unchanged
Environment: Chrome, Staging
Evidence: Screenshot attached

Linked to: SCRUM-2, TC-004
```

**3. Report to Development**
- Link defect to Jira issue SCRUM-2
- Development team investigates
- Fix is created and deployed
- Testing team is notified

#### Day 4: Retest After Fix

**1. Verify Fix**
```bash
User Request:
"Use manual-test-runner to retest TC-004 after the error message fix
has been deployed."

Agent Actions:
✓ Re-executes TC-004
✓ Navigates to login page
✓ Enters invalid credentials
✓ Clicks login
✓ Verifies error message now displays ✅ PASS
✓ Confirms issue is resolved
```

**2. Close Defect**
- Update DEF-001 status to "Fixed"
- Update SCRUM-2-test-results.md
- Mark TC-004 as PASS
- Feature is now complete

---

## Quick Reference Commands

### Generate Test Cases from Jira

```bash
# Single issue
Use jira-test-generator to create test cases for SCRUM-2

# Multiple issues in sprint
Use jira-test-generator to create test cases for all issues 
in the active SCRUM sprint

# Specific component/label
Use jira-test-generator to generate test cases for all 
"authentication" labeled issues in SCRUM project
```

### Execute Test Cases

```bash
# Single test file
Use manual-test-runner to execute all tests in 
manual-testing/test-cases/SCRUM-2-test-cases.md

# Specific test cases
Use manual-test-runner to execute TC-001, TC-002, and TC-003 
from manual-testing/test-cases/SCRUM-2-test-cases.md

# All test cases
Use manual-test-runner to execute all test cases in 
manual-testing/test-cases/ directory
```

---

## File Organization After Workflow

```
manual-testing/
├── AGENT_WORKFLOW.md                          ← You are here
├── JIRA_TEST_GENERATION_GUIDE.md
├── README.md
├── test-cases/
│   ├── INDEX.md                               # Auto-generated index
│   ├── SCRUM-1-test-cases.md
│   ├── SCRUM-2-test-cases.md                  # Generated test cases
│   ├── SCRUM-3-test-cases.md
│   └── sample-test-plan.md                    # Original template
│
├── test-results/
│   ├── SCRUM-1-test-results.md                # Execution results
│   ├── SCRUM-2-test-results.md                # Pass/fail, issues found
│   └── SCRUM-3-test-results.md
│
├── defects/
│   ├── DEF-001.md                             # Defect reports
│   ├── DEF-002.md
│   ├── defect-template.md                     # Template
│   └── DEFECTS_SUMMARY.md                     # Summary of all defects
│
├── test-data/
│   └── test-users.json                        # Test data files
│
└── evidence/
    ├── SCRUM-2-TC-004-failure-screenshot.png
    ├── SCRUM-2-TC-008-network-error.png
    └── [other evidence files]
```

---

## Metrics & Reporting

Track these metrics across your testing:

```
Sprint Summary:
├─ Total Test Cases Generated: 35
├─ Total Tests Executed: 35
├─ Pass Rate: 91% (32/35)
├─ Defects Found: 3
│  ├─ Critical: 0
│  ├─ High: 1
│  ├─ Medium: 2
│  └─ Low: 0
├─ Average Execution Time: 5 min per test
└─ Coverage: 95% of requirements
```

---

## Best Practices

### ✅ DO

- Keep test cases updated when requirements change
- Document test results immediately after execution
- Link all artifacts (test cases, results, defects) to Jira
- Review and approve generated test cases before execution
- Retest after defect fixes
- Maintain evidence for failed tests

### ❌ DON'T

- Manually create test cases if Jira issue exists (use agent)
- Skip documenting test results
- Run tests without clear understanding of requirements
- Mix manual notes in structured test case files
- Assume tests are permanent—update when requirements change
- Ignore edge cases and error scenarios

---

## Integration with CI/CD

In future iterations, you can:

1. **Automate Test Generation**
   - Generate test cases when Jira issue reaches "Ready for Testing"
   - Automatically commit test cases to version control

2. **Integrate with Test Execution**
   - Convert manual test cases to automated Playwright tests
   - Run in CI/CD pipeline on every commit
   - Report results back to Jira

3. **Track Metrics**
   - Calculate test coverage percentage
   - Track defect metrics
   - Monitor quality trends over time

---

## Support & Troubleshooting

### Agent Not Generating Test Cases
```
Solution: Check that:
- Jira authentication is configured
- Jira issue exists and has details
- Acceptance criteria are defined in Jira
```

### Test Cases Are Too Generic
```
Solution: Improve Jira acceptance criteria with:
- Specific examples and test data
- Clear expected outcomes
- Edge cases and error scenarios
- Performance requirements
```

### Tests Fail Due to Environment Issues
```
Solution:
- Verify application is running
- Check network connectivity
- Ensure test environment is fresh/clean
- Verify test data is available
```

---

## Summary

This workflow enables you to:

1. **Design** - Use Jira + jira-test-generator to create comprehensive test cases
2. **Execute** - Use manual-test-runner to test the application systematically
3. **Report** - Document defects with evidence and traceability
4. **Track** - Link everything back to Jira for complete visibility

**Result**: Systematic, traceable, high-quality testing that catches issues early! 🚀
