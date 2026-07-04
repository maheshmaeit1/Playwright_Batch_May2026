# Jenkins Quick Start (Claude Already Installed)

Fast setup guide - assumes Claude CLI is already available.

---

## ✅ Verification (30 seconds)

```bash
# Verify Claude is available
claude-code --version

# Should output something like:
# claude-code version X.X.X
```

If you get "command not found", make sure claude-code is in your PATH.

---

## 🚀 Setup Jenkins Job (2 minutes)

### Step 1: Open Jenkins
```
http://localhost:8080
```

### Step 2: Create New Job
1. Click **New Item**
2. Enter Name: `NeuralQA-Test-Automation`
3. Select **Pipeline**
4. Click **OK**

### Step 3: Configure Pipeline

In the **Pipeline** section, choose one option:

#### Option A: Script from SCM (Recommended)
```
Definition: Pipeline script from SCM
SCM: Git
Repository URL: <your-repo-url>
Branch: */main
Script Path: Jenkinsfile
```

#### Option B: Paste Script Directly
```
Definition: Pipeline script
Script: [Paste contents of Jenkinsfile]
```

### Step 4: Add Build Parameters (Optional)

Click **Pipeline Syntax** → **Steps** and add:

```groovy
parameters {
    string(name: 'JIRA_ISSUE', defaultValue: 'SCRUM-2', description: 'Jira issue to test')
    string(name: 'APP_URL', defaultValue: 'http://localhost:3000', description: 'App URL')
    booleanParam(name: 'SKIP_TEST_GENERATION', defaultValue: false, description: 'Skip generation')
}
```

### Step 5: Save
Click **Save**

---

## ▶️ Run First Build (1 minute)

### Option 1: Build with Parameters (Easiest)
1. On job page, click **Build with Parameters**
2. Leave defaults or set:
   - JIRA_ISSUE: `SCRUM-2`
   - APP_URL: `https://demowebshop.tricentis.com/` (pre-set)
3. Click **Build**

### Option 2: Quick Build
Click **Build Now** (uses default parameters)

---

## 📊 Monitor Execution

Click the build number to see progress:
```
NeuralQA-Test-Automation → Build #1 → Console Output
```

You'll see:
```
==========================================
QA Test Automation Pipeline (Local)
==========================================
...
🟣 Stage: Generate Test Cases
...
🔵 Stage: Execute Tests
...
📦 Stage: Archive Results
...
==========================================
PIPELINE SUMMARY
```

---

## 📁 Find Your Results

### Location
```
Jenkins Workspace/results/
```

### Key Files
```
results/
├── SCRUM-2-test-cases.md         ← Generated test cases
├── SCRUM-2-test-results.md       ← Test execution results ⭐
├── METRICS.txt                    ← Pass/fail stats
├── REPORT.html                    ← Visual report
├── evidence/                      ← Screenshots
└── logs/                          ← Execution logs
```

### Quick View
```bash
# View test results
cat workspace/results/SCRUM-2-test-results.md

# View metrics
cat workspace/results/METRICS.txt

# Open HTML report in browser
open workspace/results/REPORT.html
```

---

## 🎯 Run for Different Issues

### Change Jira Issue
1. Click **Build with Parameters**
2. Change JIRA_ISSUE to: `SCRUM-3`
3. Click **Build**

Results go to: `results/SCRUM-3-test-results.md`

---

## 🔄 Run Multiple Issues

```bash
# Trigger 3 different issues
for ISSUE in SCRUM-2 SCRUM-3 SCRUM-4; do
  curl -X POST http://localhost:8080/job/NeuralQA-Test-Automation/buildWithParameters \
    -F JIRA_ISSUE=$ISSUE
done
```

---

## ⏱️ What to Expect

### Build Timeline
```
Initialize                    <1 min
  ↓
Generate Test Cases          2-3 min
  ↓
Verify Test Cases            <1 min
  ↓
Execute Tests               5-10 min
  ↓
Collect Results             1-2 min
  ↓
Parse Metrics               <1 min
  ↓
Generate Report             <1 min
  ↓
Archive                     <1 min

Total: ~15-20 minutes
```

### Console Output Example
```
[Pipeline] Start of Pipeline
[Initialize] Creating directories...
[Generate Test Cases] Using jira-test-generator...
📝 Requesting Claude to generate test cases...
✅ Test cases generated successfully

[Verify Test Cases] Checking file...
✅ Test case file found

[Execute Tests] Using manual-test-runner...
🖥️ Starting browser automation...
Executing TC-001: ✅ PASS
Executing TC-002: ✅ PASS
Executing TC-003: ✅ PASS
...
Test execution completed

[Archive] Saving artifacts...
✅ All results stored in: workspace/results
```

---

## 📊 Results Summary

### METRICS.txt Example
```
=====================================
TEST EXECUTION METRICS
=====================================
Build Number: 1
Jira Issue: SCRUM-2
Execution Date: 2026-07-04

Total Tests: 8
Passed: 7
Failed: 1
Pass Rate: 87%
```

### Test Results Example
```markdown
# Test Results for SCRUM-2

Total Tests: 8
Passed: 7 ✅
Failed: 1 ❌
Pass Rate: 87%

## Test Details
- TC-001: ✅ PASS - Login with valid credentials
- TC-002: ✅ PASS - Invalid credentials error message
- TC-003: ✅ PASS - Form validation
- TC-004: ❌ FAIL - Login button unresponsive
  Evidence: evidence/screenshot-TC-004.png
- TC-005: ✅ PASS - Dashboard access
...
```

---

## 🐛 Quick Troubleshooting

### Issue: Build stuck or taking too long
**Check**: Console Output → Look for the stage that's running  
**Solution**: Wait for it to complete (could be 15-20 min)

### Issue: "No test results generated"
**Check**: `results/logs/generation.log` and `execution.log`  
**Solution**: Review logs for error messages

### Issue: Test cases not found
**Check**: Is Jira issue SCRUM-2 valid?  
**Solution**: Change JIRA_ISSUE parameter to existing issue

### Issue: Claude command not found
**Check**: Is Claude installed? `which claude-code`  
**Solution**: Add to PATH or install globally

### Issue: Permission denied on results folder
**Check**: Jenkins user permissions  
**Solution**: Ensure Jenkins has write access to workspace

---

## 🔗 Related Files

- **Jenkinsfile** - Main pipeline (in your repo root)
- **JENKINSFILE_README.md** - Quick reference card
- **JENKINS_LOCAL_SETUP.md** - Detailed setup guide
- **manual-testing/AGENT_WORKFLOW.md** - Complete workflow

---

## 📋 Checklist

- [ ] Claude CLI verified: `claude-code --version` ✅
- [ ] Jenkins job created: `NeuralQA-Test-Automation`
- [ ] Jenkinsfile in repository
- [ ] Build parameters added (optional)
- [ ] First build executed
- [ ] Results folder created: `workspace/results/`
- [ ] Test results file present: `SCRUM-2-test-results.md`
- [ ] Evidence screenshots saved

✅ **All checked? You're ready!**

---

## 🎯 Typical Workflow

```
1. Developer creates Jira issue (e.g., SCRUM-5)
   
2. QA goes to Jenkins job
   
3. Click "Build with Parameters"
   
4. Set JIRA_ISSUE=SCRUM-5
   
5. Click "Build"
   
6. Wait ~20 minutes for completion
   
7. Results auto-saved in workspace/results/SCRUM-5-test-results.md
   
8. Review results and metrics
   
9. Share findings with team
```

---

## 💡 Pro Tips

### Fastest Way to View Results
```bash
# After build completes
cat ~/Jenkins/workspace/NeuralQA-Test-Automation/results/METRICS.txt
```

### Setup Periodic Testing (Daily at 9 AM)
In Jenkins job:
```
Build Triggers:
☑ Build periodically
Schedule: H 9 * * *
```

### Quick Build via Command Line
```bash
curl -X POST http://localhost:8080/job/NeuralQA-Test-Automation/buildWithParameters \
  -F JIRA_ISSUE=SCRUM-3 \
  -F APP_URL=http://localhost:3000
```

### Monitor Multiple Builds
```
Jenkins Home → NeuralQA-Test-Automation → Build History
```

---

## ✅ Success Indicators

Build is working when you see:

✅ Console shows all 8 stages completing  
✅ Build time: ~15-20 minutes  
✅ `results/` folder created  
✅ `SCRUM-2-test-results.md` contains results  
✅ `METRICS.txt` shows pass/fail counts  
✅ Evidence screenshots in `evidence/` folder  
✅ No errors in console output  

🎉 **You're all set!**

---

## 🚀 Next Steps

1. **Run your first build** with default SCRUM-2
2. **Review the results** in `results/` folder
3. **Run with different Jira issue** (SCRUM-3, etc.)
4. **Schedule periodic builds** if needed
5. **Integrate with your workflow** (CI/CD, webhooks, etc.)

---

**That's it! Local Jenkins pipeline with Claude is ready to use!** 🎯
