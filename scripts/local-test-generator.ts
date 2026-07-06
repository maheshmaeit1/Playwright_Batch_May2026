import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { spawnSync } from "child_process";
import { loadAgent } from "./agent-loader";

// Heuristic: did the agent actually produce test cases, or bail out on a blocker?
// The agent's template emits headings like "## Test Case: TC-001 ...", so match
// the TC-<number> marker anywhere in a heading rather than requiring "## TC-".
function looksLikeRealTestCases(content: string): boolean {
  return /TC-\d+/.test(content);
}

function invokeGenerator(jiraIssue: string, appUrl: string, outputFile: string): string {
  const agent = loadAgent("jira-test-generator");

  const prompt = `Generate manual test cases for Jira issue: ${jiraIssue}

Application: ${appUrl}
Test User: neuralqaacademy@gmail.com / Tester@123

MANDATORY FIRST STEP: Call the mcp__atlassian__getJiraIssue tool with issue key "${jiraIssue}" to fetch the real requirements before writing anything (use mcp__atlassian__getAccessibleAtlassianResources first if you need the cloudId). Do not assume or guess the feature from the URL or credentials. If the tool call fails or is denied, stop and report the exact error instead of fabricating requirements.

Save the test case document to: ${outputFile}
Also output the complete markdown test case document directly in your response.

Start generating now.`;

  // Write the system prompt to a temp file rather than passing it inline:
  // the agent's markdown contains backticks, pipes and quotes that corrupt
  // cmd.exe's argument reconstruction under shell:true on Windows, which
  // was silently truncating/shifting the --allowedTools value that follows.
  const systemPromptFile = path.join(
    os.tmpdir(),
    `jira-test-generator-system-prompt-${process.pid}.txt`
  );
  fs.writeFileSync(systemPromptFile, agent.systemPrompt, "utf-8");

  let result;
  try {
    result = spawnSync(
      "claude",
      [
        "--print",
        "--append-system-prompt-file",
        systemPromptFile,
        "--allowedTools",
        agent.tools.join(","),
      ],
      {
        input: prompt,
        encoding: "utf-8",
        maxBuffer: 10 * 1024 * 1024,
        shell: true,
      }
    );
  } finally {
    fs.unlinkSync(systemPromptFile);
  }

  if (result.status !== 0) {
    throw new Error(result.stderr || result.error?.message || "Unknown error");
  }

  return result.stdout;
}

// Generate test cases from a Jira issue using the jira-test-generator agent's
// own skill definition (see agent-loader.ts for why --agent is avoided).
// One shot, no retry: fetch the requirement, let the agent generate. If the
// agent wrote a valid file itself, that counts as success even when stdout is
// just a summary.
function generateTestCases(
  jiraIssue: string,
  appUrl: string,
  outputFile: string
): string {
  console.log(`🚀 Generating test cases for ${jiraIssue}...\n`);

  console.log("Invoking jira-test-generator agent...");
  const content = invokeGenerator(jiraIssue, appUrl, outputFile);

  const fileHasTestCases =
    fs.existsSync(outputFile) &&
    looksLikeRealTestCases(fs.readFileSync(outputFile, "utf-8"));

  if (!looksLikeRealTestCases(content) && !fileHasTestCases) {
    console.error(
      "❌ Generation failed: agent did not produce test cases. Raw response follows:\n"
    );
    console.error(content);
    process.exit(1);
  }

  return content;
}

// Persist the generated content. The agent may have already written the file
// itself via its own Write tool - only overwrite it with the captured stdout
// if that file is missing or doesn't actually contain test cases, so a good
// agent-written file is never clobbered by a lesser chat-summary response.
function saveTestCases(content: string, outputFile: string): void {
  if (fs.existsSync(outputFile)) {
    const existing = fs.readFileSync(outputFile, "utf-8");
    if (looksLikeRealTestCases(existing)) {
      console.log(`\n✅ Agent already saved valid test cases: ${outputFile}`);
      return;
    }
  }

  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, content, "utf-8");
  console.log(`\n✅ Test cases saved: ${outputFile}`);
}

// Main function
function main(): void {
  console.log("\n🔷 Local Test Generator - Claude Agent\n");

  // Parse arguments
  const args = process.argv.slice(2);
  let jiraIssue = "";
  let appUrl = "";
  let outputFile = "";

  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];

    if (flag === "--jira-issue") jiraIssue = value;
    if (flag === "--app-url") appUrl = value;
    if (flag === "--output-file") outputFile = value;
  }

  // Validate required args - headless, no interactive fallback
  if (!jiraIssue || !appUrl || !outputFile) {
    console.error(
      "ERROR: --jira-issue, --app-url, and --output-file are all required"
    );
    console.error(
      "Usage: ts-node local-test-generator.ts --jira-issue SCRUM-2 --app-url <url> --output-file <path>"
    );
    process.exit(1);
  }

  console.log(`📋 Jira Issue: ${jiraIssue}`);
  console.log(`🌐 Application URL: ${appUrl}`);
  console.log(`📁 Output File: ${outputFile}\n`);

  const content = generateTestCases(jiraIssue, appUrl, outputFile);
  saveTestCases(content, outputFile);

  console.log("\n" + "=".repeat(60));
  console.log("TEST GENERATION SUMMARY");
  console.log("=".repeat(60));
  console.log(`Jira Issue: ${jiraIssue}`);
  console.log(`Output: ${outputFile}`);
  console.log("=".repeat(60));
}

main();
