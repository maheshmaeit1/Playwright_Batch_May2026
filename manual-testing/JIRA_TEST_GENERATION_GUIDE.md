# Jira Test Generation Guide

This guide explains how to use the `jira-test-generator` agent to automatically generate test cases from Jira requirements.

## Overview

The `jira-test-generator` agent:
- 🔗 Fetches requirements from Jira issues
- 📝 Analyzes acceptance criteria and user stories
- ✅ Generates comprehensive test cases
- 📁 Saves test cases in the proper format
- 🔄 Creates traceability to Jira issues

## Prerequisites

✅ Atlassian authentication is configured (already done)  
✅ Access to NeuralQA Jira project  
✅ Jira issues with acceptance criteria defined  

## How to Use

### Method 1: Generate Test Cases for a Single Jira Issue

```
Use the jira-test-generator agent to create test cases for Jira issue SCRUM-2
```

The agent will:
1. Fetch issue SCRUM-2 from Jira
2. Parse the requirement and acceptance criteria
3. Generate comprehensive test cases
4. Save as `manual-testing/test-cases/SCRUM-2-test-cases.md`

### Method 2: Generate Test Cases for Multiple Issues

```
Use the jira-test-generator agent to create test cases for all stories in the active SCRUM sprint
```

The agent will:
1. Search for all relevant issues
2. Generate test cases for each issue
3. Create an index file linking all test cases
4. Save to `manual-testing/test-cases/`

### Method 3: Generate Test Cases for a Specific Feature

```
Use the jira-test-generator agent to generate test cases for all issues labeled "authentication" in the SCRUM project
```

## Example Usage Scenarios

### Scenario 1: Generate Tests for a User Story

**Request**:
```
Use jira-test-generator to create test cases for SCRUM-2 (Task 2).
Generate comprehensive test cases covering:
- Happy path scenarios
- Edge cases
- Error handling
- Validation rules
Include traceability to the Jira issue.
```

**Expected Output**:
- File: `manual-testing/test-cases/SCRUM-2-test-cases.md`
- Contains: 5-10 test cases with detailed steps
- Includes: Traceability matrix linking to Jira

### Scenario 2: Batch Generate for Sprint

**Request**:
```
Use jira-test-generator to generate test cases for all open issues in SCRUM sprint.
Create one test case file per issue and an index file summarizing all test cases.
```

**Expected Output**:
- Multiple files: `SCRUM-1-test-cases.md`, `SCRUM-2-test-cases.md`, etc.
- Index file: `manual-testing/test-cases/INDEX.md`
- Summary: Total test cases created, coverage percentage

## Test Case Output Format

Generated test cases follow this structure:

```markdown
# Test Cases for [JIRA-KEY]: [Feature Title]

**Jira Issue**: [Link to issue]
**Total Test Cases**: [Number]
**Coverage**: [Estimated %]

## Test Case: [TC-001] [Title]

**Objective**: [What this validates]

**Acceptance Criteria Mapping**:
- AC1: [Mapped criteria]
- AC2: [Mapped criteria]

**Preconditions**:
- [Setup requirements]

**Test Steps**:
1. [Step 1]
2. [Step 2]
...

**Expected Results**:
- ✅ [Expected outcome]
- ✅ [Expected outcome]

**Test Data**:
- [Data needed]

---

## Traceability Matrix

| TC ID | Title | AC Coverage | Status |
|-------|-------|-------------|--------|
| TC-001 | ... | AC1, AC2 | ✓ |
```

## File Organization

After generation, files are organized as:

```
manual-testing/
├── test-cases/
│   ├── INDEX.md                      # Index of all generated test cases
│   ├── SCRUM-1-test-cases.md        # Test cases for SCRUM-1
│   ├── SCRUM-2-test-cases.md        # Test cases for SCRUM-2
│   ├── SCRUM-3-test-cases.md        # Test cases for SCRUM-3
│   └── sample-test-plan.md           # (Original sample)
├── test-results/
│   ├── SCRUM-1-test-results.md      # Execution results
│   └── SCRUM-2-test-results.md
└── defects/
    └── [Defect reports from testing]
```

## Best Practices

### 1. **Organize by Project/Feature**
Group related issues and their test cases together
```
Feature-Login/
├── SCRUM-5-login-test-cases.md
├── SCRUM-6-password-reset-test-cases.md
└── SCRUM-7-mfa-test-cases.md
```

### 2. **Update Test Cases When Requirements Change**
When Jira requirements are updated:
```
Use jira-test-generator to regenerate test cases for SCRUM-2 
based on updated acceptance criteria
```

### 3. **Execute Generated Test Cases**
Once test cases are generated, execute them using the manual-test-runner:
```
Use manual-test-runner to execute test cases in SCRUM-2-test-cases.md
and save results to manual-testing/test-results/SCRUM-2-test-results.md
```

### 4. **Maintain Traceability**
Keep links between:
- Jira issues → Test cases
- Test cases → Test results
- Test results → Defects

## Jira Integration Tips

### Write Better Acceptance Criteria for Better Test Cases

**Good Acceptance Criteria** ✅
```
Given a user with valid credentials
When they click the login button
Then they should see the dashboard
And their session should be active
```

**Poor Acceptance Criteria** ❌
```
Login should work
User can access features after login
```

### Use Issue Labels and Components

Label issues in Jira for better organization:
```
Labels: authentication, critical, SCRUM-sprint-1
Components: Auth Module, Frontend
Priority: High
```

The agent will consider these when generating test cases.

## Workflow Example

### Step 1: Create Jira Issue with Requirements
In Jira, create issue with:
- Clear description
- Detailed acceptance criteria
- Story points and priority
- Component labels

### Step 2: Generate Test Cases
```
Use jira-test-generator to create comprehensive test cases for SCRUM-5
```

### Step 3: Review Generated Test Cases
- Check if all acceptance criteria are covered
- Review test case clarity
- Ensure edge cases are included

### Step 4: Execute Test Cases
```
Use manual-test-runner to execute test cases from SCRUM-5-test-cases.md
and document results in SCRUM-5-test-results.md
```

### Step 5: Report Defects
If issues are found:
```
Create defect reports in manual-testing/defects/ using defect-template.md
Link defects back to test cases and Jira issues
```

## Common Jira Queries

Use these JQL queries with the agent:

```jql
# Get all open stories in SCRUM project
project = SCRUM AND type = Story AND status != Done

# Get all issues from current sprint
project = SCRUM AND sprint = OPEN

# Get all issues with specific label
project = SCRUM AND labels = authentication

# Get all high-priority issues
project = SCRUM AND priority = High

# Get issues updated in last 7 days
project = SCRUM AND updated >= -7d
```

## Troubleshooting

### Issue: Agent Cannot Access Jira
**Solution**: Ensure Atlassian authentication is configured
```
Run `/atlassian` to authenticate
```

### Issue: Test Cases Are Too Generic
**Solution**: Improve Jira acceptance criteria with specific details and examples
```
Instead of: "User can login"
Use: "User can login with email and password format user@domain.com"
```

### Issue: Missing Edge Cases
**Solution**: Ask agent to include specific test scenarios
```
Use jira-test-generator to create test cases for SCRUM-2
including: boundary values, negative testing, performance scenarios
```

## Next Steps

1. **Set up Jira requirements** with clear acceptance criteria
2. **Generate test cases** using jira-test-generator
3. **Execute tests** using manual-test-runner
4. **Track results** in test-results folder
5. **Report defects** with proper documentation

Your automated test case generation workflow is ready! 🚀
