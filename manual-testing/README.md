# Manual Testing Module

This folder contains manual test cases, test results, and defect documentation for the NeuralQA Playwright POM Framework.

## Structure

- `test-cases/` - Test case definitions and test plans
- `test-results/` - Documented test execution results
- `defects/` - Defect reports and issue documentation
- `test-data/` - Test data files and fixtures
- `evidence/` - Screenshots and evidence from test execution

## Using the Manual Test Runner Agent

The `manual-test-runner` agent is configured to help you:

1. Execute manual test cases step-by-step
2. Validate application behavior
3. Document test results
4. Identify and report defects
5. Capture evidence (screenshots, console logs)

### Example Usage

```
Use the manual-test-runner agent to execute the test plan in test-cases/login-flow-tests.md
```

## Test Case Format

Each test case should follow this structure:

```markdown
## Test Case: [TC-001] Verify Login with Valid Credentials

**Objective**: Verify that users can successfully log in with valid credentials

**Preconditions**:
- Browser is open
- Application URL is loaded
- User has valid credentials

**Test Steps**:
1. Navigate to login page
2. Enter username in username field
3. Enter password in password field
4. Click login button
5. Verify dashboard appears

**Expected Results**:
- User is redirected to dashboard
- Session is established
- Welcome message is displayed

**Actual Results**: [To be filled during execution]

**Status**: [Pass/Fail]

**Comments**: [Any observations or issues]
```

## Defect Report Format

When defects are found, document them using:

```markdown
## Defect Report: [DEF-001]

**Title**: Login button does not respond to clicks

**Severity**: High

**Steps to Reproduce**:
1. Navigate to login page
2. Enter valid credentials
3. Click login button

**Expected Behavior**: Page redirects to dashboard

**Actual Behavior**: Page remains on login form, no error message

**Environment**: Chrome, Windows 11

**Evidence**: [screenshot.png]

**Root Cause**: [To be investigated by development]
```

## Getting Started

1. Create test case files in `test-cases/`
2. Use the `manual-test-runner` agent to execute tests
3. Document results in `test-results/`
4. Report defects in `defects/`
5. Organize evidence in `evidence/`
