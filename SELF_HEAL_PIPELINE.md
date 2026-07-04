# Jenkins Self-Heal Pipeline — Playwright POM Framework

A simple Jenkins pipeline that runs the Playwright tests, **auto-heals** the failing ones using
Playwright's built-in AI healer, re-runs them, and publishes the report.

## Flow

```
Prepare → Init healer → Run tests ──pass──────────────────────────────┐
                             │ fail                                    │
                             ▼                                         ▼
                        AI Heal (claude -p) → Re-run tests → Publish HTML report + artifacts
```

The 3 steps requested:

1. **Execute** the current tests.
2. On failure, **heal** the failed tests with the AI healer.
3. **Re-execute** and **show the report** once tests pass.

## How self-heal works here

This project already ships Playwright's **`playwright-test-healer`** agent
(`node_modules/playwright/lib/agents/playwright-test-healer.agent.md`). It uses an LLM + the
`playwright-test` MCP server to debug failing tests and fix broken locators/assertions in the
`pages/**` and `tests/**` code, then re-runs until green.

`npx playwright init-agents --loop=claude` generates:
- `.claude/agents/playwright-test-healer.md` — the healer agent definition
- `.mcp.json` — registers the `playwright-test` MCP server (`npx playwright run-test-mcp-server`)

The **Claude Code CLI** (`claude -p ...`) drives that agent headlessly inside Jenkins.

## Prerequisites (Jenkins agent — one-time)

- **Node.js 18+** on the agent (NodeJS plugin tool or on PATH).
- **Claude Code CLI**: `npm i -g @anthropic-ai/claude-code`.
- **`ANTHROPIC_API_KEY`** as a Jenkins **Secret text** credential (id: `anthropic-api-key`).
- **HTML Publisher** plugin (to show the Playwright HTML report); optional **Allure** plugin.

## Files this pipeline adds (when implemented)

### `package.json` scripts
```jsonc
"scripts": {
  "test": "playwright test",
  "test:failed": "playwright test --last-failed",
  "report": "playwright show-report",
  "init:agents": "playwright init-agents --loop=claude"
}
```

### `heal.txt` — versioned prompt for the headless healer
> Act as the playwright-test-healer. Run the failing Playwright tests, diagnose the failures,
> fix selectors/assertions in `pages/**` and `tests/**` only, and re-run until they pass.

### `Jenkinsfile` — declarative pipeline (Windows agent shown; swap `bat`→`sh` for Linux)

```groovy
pipeline {
  agent any
  environment {
    CI = 'true'
    ANTHROPIC_API_KEY = credentials('anthropic-api-key')
  }
  stages {
    stage('Prepare') {
      steps {
        bat 'npm ci'
        bat 'npx playwright install --with-deps chromium'
      }
    }
    stage('Init healer agent') {
      steps { bat 'npx playwright init-agents --loop=claude' }
    }
    stage('Run tests (step 1)') {
      steps {
        script {
          def rc = bat(returnStatus: true, script: 'npx playwright test')
          env.TESTS_FAILED = (rc != 0).toString()
        }
      }
    }
    stage('Self-Heal (step 2)') {
      when { environment name: 'TESTS_FAILED', value: 'true' }
      steps {
        bat '''
          claude -p "%CD%\\heal.txt" ^
            --mcp-config .mcp.json ^
            --permission-mode acceptEdits ^
            --allowedTools "Read,Edit,Write,Glob,Grep,Bash(npx playwright test:*),mcp__playwright-test__*"
        '''
      }
    }
    stage('Re-run tests (step 3)') {
      when { environment name: 'TESTS_FAILED', value: 'true' }
      steps { bat 'npx playwright test' }   // this result decides build status
    }
  }
  post {
    always {
      publishHTML(target: [reportDir: 'playwright-report', reportFiles: 'index.html',
                           reportName: 'Playwright Report', keepAll: true])
      archiveArtifacts artifacts: 'playwright-report/**, test-results/**, target/allure-results/**',
                       allowEmptyArchive: true
      // Optional (Allure plugin): allure results: [[path: 'target/allure-results']]
    }
  }
}
```

## Notes

- `playwright.config.ts` already sets `retries: 2` under `CI`, so Jenkins runs get native
  flaky-retries before the AI healer is even invoked.
- **Report-only**: healed code changes are left in the workspace and archived for human review.
  This folder is **not a git repo**, so there is no auto-commit/PR (can be added later).
- **Graceful fallback**: if `ANTHROPIC_API_KEY` or `claude` is missing, replace the heal stage
  with `npm run test:failed` so the pipeline still runs.
- Add `.claude/`, `.mcp.json`, `specs/` to `.gitignore` (generated artifacts) once git is set up.
- Live demo: `loginTest.spec.ts` currently fails on a `toHaveScreenshot()` pixel diff — a good
  candidate for the healer to fix (update baseline or make the assertion resilient).

## Verify locally before Jenkins

```bash
npm ci
npx playwright install chromium
npx playwright init-agents --loop=claude
npx playwright test                 # observe failure
claude -p "./heal.txt" --mcp-config .mcp.json --permission-mode acceptEdits   # heal
npx playwright test                 # should pass
npx playwright show-report          # view report
```
