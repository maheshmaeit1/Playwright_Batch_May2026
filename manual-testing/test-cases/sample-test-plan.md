# Sample Test Plan - User Login and Dashboard Navigation

**Project**: NeuralQA Playwright Framework  
**Test Environment**: Development/Staging  
**Executed By**: [Tester Name]  
**Execution Date**: [Date]  
**Test Duration**: [Time]  

---

## Test Case: [TC-001] Verify Login with Valid Credentials

**Objective**: Verify that users can successfully log in with valid credentials and access the dashboard

**Preconditions**:
- Browser is open and ready
- Application base URL is accessible
- Valid test user credentials are available
- User is not already logged in

**Test Steps**:
1. Navigate to the application URL
2. Verify login page is displayed with username and password fields
3. Enter valid username in the username field
4. Enter valid password in the password field
5. Click the "Login" button
6. Wait for page to load (max 5 seconds)
7. Verify dashboard page is displayed
8. Verify user welcome message or profile name is visible

**Expected Results**:
- ✅ Login page loads successfully
- ✅ Username and password fields are editable
- ✅ Login button is clickable
- ✅ Dashboard page is displayed after login
- ✅ User information is visible
- ✅ No error messages appear

**Actual Results**: [To be filled during execution]

**Status**: [Pass/Fail]

**Evidence/Screenshots**: [Attach screenshots here]

**Comments**: 

---

## Test Case: [TC-002] Verify Login with Invalid Credentials

**Objective**: Verify that the system rejects invalid credentials and displays appropriate error message

**Preconditions**:
- Browser is open and ready
- Application base URL is accessible
- User is not already logged in

**Test Steps**:
1. Navigate to the application URL
2. Verify login page is displayed
3. Enter invalid username
4. Enter invalid password
5. Click the "Login" button
6. Wait for response (max 5 seconds)
7. Verify error message is displayed

**Expected Results**:
- ✅ Login page is displayed
- ✅ Error message appears (e.g., "Invalid credentials")
- ✅ User remains on login page
- ✅ No user session is created
- ✅ Dashboard is not accessible

**Actual Results**: [To be filled during execution]

**Status**: [Pass/Fail]

**Evidence/Screenshots**: [Attach screenshots here]

**Comments**: 

---

## Test Case: [TC-003] Verify Empty Username Field Validation

**Objective**: Verify that submitting login form with empty username shows validation error

**Preconditions**:
- Browser is open and ready
- Application base URL is accessible
- User is not already logged in

**Test Steps**:
1. Navigate to the application URL
2. Leave username field empty
3. Enter any password
4. Click the "Login" button
5. Verify validation error appears

**Expected Results**:
- ✅ Validation error appears for empty username field
- ✅ Error message is clear (e.g., "Username is required")
- ✅ Login button does not submit the form
- ✅ User remains on login page

**Actual Results**: [To be filled during execution]

**Status**: [Pass/Fail]

**Evidence/Screenshots**: [Attach screenshots here]

**Comments**: 

---

## Test Case: [TC-004] Verify Dashboard Navigation After Login

**Objective**: Verify that all dashboard navigation elements are accessible and functional

**Preconditions**:
- User is successfully logged in
- Dashboard page is displayed
- All navigation elements are visible

**Test Steps**:
1. From dashboard, click on "Profile" menu item
2. Verify profile page loads successfully
3. Click "Back" or "Dashboard" link
4. Verify dashboard page is displayed again
5. Click on "Settings" menu item
6. Verify settings page loads
7. Verify logout functionality is available

**Expected Results**:
- ✅ All menu items are clickable
- ✅ Navigation between pages works correctly
- ✅ Each page loads within 3 seconds
- ✅ Page headers match navigation selection
- ✅ Logout button is visible and accessible

**Actual Results**: [To be filled during execution]

**Status**: [Pass/Fail]

**Evidence/Screenshots**: [Attach screenshots here]

**Comments**: 

---

## Test Case: [TC-005] Verify Logout Functionality

**Objective**: Verify that users can successfully log out and session is properly terminated

**Preconditions**:
- User is successfully logged in
- Dashboard page is displayed

**Test Steps**:
1. Click on user profile menu (top right)
2. Click "Logout" button
3. Wait for redirect (max 3 seconds)
4. Verify login page is displayed
5. Try to navigate back using browser back button
6. Verify login page is still displayed (no cached session)

**Expected Results**:
- ✅ Logout button is accessible
- ✅ User is redirected to login page
- ✅ Session is terminated
- ✅ Back button does not restore logged-in state
- ✅ No sensitive data is displayed after logout

**Actual Results**: [To be filled during execution]

**Status**: [Pass/Fail]

**Evidence/Screenshots**: [Attach screenshots here]

**Comments**: 

---

## Summary

| Test Case | Status | Defects Found | Severity |
|-----------|--------|--------------|----------|
| TC-001 | | | |
| TC-002 | | | |
| TC-003 | | | |
| TC-004 | | | |
| TC-005 | | | |

**Total Tests**: 5  
**Passed**: [#]  
**Failed**: [#]  
**Blocked**: [#]  
**Overall Status**: [Pass/Fail]

### Defects Found:
- [List any defects with severity level]

### Recommendations:
- [Any recommendations for improvement]
