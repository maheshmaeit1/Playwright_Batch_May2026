# Defect Report Template

## Defect: [DEF-001]

**Title**: [Brief title of the defect]

**Date Reported**: [Date]  
**Reported By**: [Tester Name]  
**Assigned To**: [Developer Name]  
**Status**: [Open/In Progress/Fixed/Closed]  

---

### Priority & Severity

**Severity**: [Critical/High/Medium/Low]
- **Critical**: Application crash, data loss, security vulnerability, login issues
- **High**: Major feature broken, significant impact on user workflow
- **Medium**: Feature partially working, workaround available
- **Low**: Minor UI issue, cosmetic problem, documentation error

**Priority**: [P1/P2/P3/P4]
- **P1**: Fix immediately, blocks release
- **P2**: Fix in current sprint
- **P3**: Fix in next sprint
- **P4**: Fix when resources available

---

### Environment

**Browser**: [e.g., Chrome 120, Firefox 121]  
**OS**: [e.g., Windows 11, macOS 14]  
**Environment**: [Development/Staging/Production]  
**Application Version**: [Version number]  
**Test Environment**: [URL or local setup details]  

---

### Description

**Summary**: 
[Concise description of the issue]

**Expected Behavior**: 
[What should happen according to requirements/design]

**Actual Behavior**: 
[What actually happens]

**Impact**: 
[How does this affect users/functionality]

---

### Steps to Reproduce

1. [First step]
2. [Second step]
3. [Third step]
4. [Continue as needed]

**Prerequisites**:
- [Any setup required before reproducing]
- [Specific data/state needed]

---

### Evidence

**Screenshots/Videos**:
- [Expected behavior screenshot]
- [Actual behavior screenshot]
- [Error message screenshot]

**Console Errors**:
```
[Paste console errors here if applicable]
```

**Network Requests**:
- [Any failed API calls]
- [Unusual response codes]

---

### Additional Details

**Frequency**: [Always/Sometimes/Rare]

**Reproducibility**: [100%/75%/50%/Intermittent]

**Workaround Available**: [Yes/No]  
If Yes:
```
[Describe workaround here]
```

**Related Issues**: 
- [Link to related defects or issues]

**Test Case Reference**:
- [TC-001], [TC-002], etc.

---

### Comments & Discussion

**Developer Comment**: 
[Root cause analysis and fix details]

**Tester Comment**: 
[Verification notes after fix]

---

## Defect Lifecycle

| Status | Date | Updated By | Notes |
|--------|------|-----------|-------|
| Open | [Date] | [Name] | Initially reported |
| In Progress | [Date] | [Name] | Work started on fix |
| Fixed | [Date] | [Name] | Fix deployed to staging |
| Closed | [Date] | [Name] | Verified fixed |

---

## Checklist for Complete Defect Report

- [ ] Clear, descriptive title provided
- [ ] Steps to reproduce are clear and testable
- [ ] Expected vs actual behavior clearly stated
- [ ] Severity and priority assigned
- [ ] Screenshots/evidence attached
- [ ] Reproducibility percentage noted
- [ ] Environment details documented
- [ ] No sensitive data exposed in report
- [ ] Workaround provided (if available)
- [ ] Assigned to appropriate developer
