import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface AgentOptions {
  action: "generate" | "execute";
  jiraIssue?: string;
  appUrl?: string;
  testCaseFile?: string;
  selectedTestCase?: string;
  outputFile: string;
}

// Test case generation via API
async function generateTestCases(
  jiraIssue: string,
  appUrl: string
): Promise<string> {
  console.log(`[Agent] Generating test cases for ${jiraIssue}...`);

  const prompt = `You are the jira-test-generator agent.

Generate comprehensive manual test cases for Jira issue: ${jiraIssue}

Application: ${appUrl}
Test User: neuralqaacademy@gmail.com / Tester@123

Fetch the Jira issue details and create 5-10 detailed test cases in markdown format.

Each test case should include:
- Title (TC-XXX)
- Objective
- Preconditions
- Numbered test steps (plain language)
- Expected results
- Test data

Format as professional markdown documentation ONLY.
Start generating now.`;

  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in response");
  }

  return textBlock.text;
}

// Test execution via Claude CLI (has browser tools)
async function executeTestCases(
  testCaseFile: string,
  appUrl: string,
  selectedTestCase?: string
): Promise<string> {
  console.log(
    `[Agent] Executing test case: ${selectedTestCase} via Claude CLI...`
  );

  // Read test case file
  const fullContent = fs.readFileSync(testCaseFile, "utf-8");

  // Extract only the selected test case if specified
  let testCaseContent = fullContent;
  if (selectedTestCase) {
    // Extract the specific test case (e.g., TC-001)
    const testCasePattern = new RegExp(
      `## ${selectedTestCase}:.*?(?=## TC-\\d+:|$)`,
      "is"
    );
    const match = fullContent.match(testCasePattern);
    if (match) {
      testCaseContent = match[0];
      console.log(`[Agent] Extracted test case: ${selectedTestCase}`);
    } else {
      console.warn(
        `[Agent] Could not extract ${selectedTestCase}, using full file`
      );
    }
  }

  // Create a temporary prompt file
  const promptFile = path.join(
    process.env.TEMP || "/tmp",
    `execute_test_${Date.now()}.txt`
  );

  const prompt = `Execute ONLY the following test case and document results.

Application: ${appUrl}
Test User: neuralqaacademy@gmail.com / Tester@123

Test Case to Execute:
\`\`\`
${testCaseContent}
\`\`\`

Instructions:
1. Execute ONLY this ONE test case - do not execute other tests
2. Follow each test step exactly as described
3. Navigate the application and verify expected results
4. Document: Pass or Fail for each step
5. Take screenshots only if test fails
6. Document actual vs expected results

Output results in markdown format with:
- Test case ID and title
- Status: PASS or FAIL
- Step-by-step results
- Observations
- Any failures with evidence

Start executing now.`;

  fs.writeFileSync(promptFile, prompt, "utf-8");

  try {
    // Invoke Claude CLI with manual-test-runner agent (has browser tools)
    console.log("Invoking manual-test-runner agent via CLI...");
    const result = execSync(
      `claude --agent manual-test-runner "${prompt}"`,
      {
        encoding: "utf-8",
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      }
    );

    return result;
  } catch (error) {
    console.error(
      "CLI execution error:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  } finally {
    // Clean up temp file
    try {
      fs.unlinkSync(promptFile);
    } catch {}
  }
}

// Save content to file
async function saveContent(content: string, outputFile: string): Promise<void> {
  const outputDir = path.dirname(outputFile);

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, content, "utf-8");
  console.log(`✅ Saved: ${outputFile}`);
}

// Parse command line arguments
function parseArgs(): AgentOptions {
  const args = process.argv.slice(2);
  const options: Partial<AgentOptions> = { outputFile: "" };

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, "");
    const value = args[i + 1];

    switch (key) {
      case "action":
        options.action = value as "generate" | "execute";
        break;
      case "jira-issue":
        options.jiraIssue = value;
        break;
      case "app-url":
        options.appUrl = value;
        break;
      case "test-case-file":
        options.testCaseFile = value;
        break;
      case "selected-test-case":
        options.selectedTestCase = value;
        break;
      case "output-file":
        options.outputFile = value;
        break;
    }
  }

  return options as AgentOptions;
}

// Main execution
async function main(): Promise<void> {
  try {
    const options = parseArgs();

    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ERROR: ANTHROPIC_API_KEY environment variable not set");
      process.exit(1);
    }

    // Validate required options
    if (!options.action || !options.outputFile) {
      console.error(
        "ERROR: --action and --output-file are required parameters"
      );
      process.exit(1);
    }

    let content: string;

    if (options.action === "generate") {
      if (!options.jiraIssue || !options.appUrl) {
        console.error(
          "ERROR: --jira-issue and --app-url required for generate action"
        );
        process.exit(1);
      }

      content = await generateTestCases(options.jiraIssue, options.appUrl);
      await saveContent(content, options.outputFile);
      console.log("✅ Test case generation complete");
    } else if (options.action === "execute") {
      if (!options.testCaseFile || !options.appUrl) {
        console.error(
          "ERROR: --test-case-file and --app-url required for execute action"
        );
        process.exit(1);
      }

      content = await executeTestCases(
        options.testCaseFile,
        options.appUrl,
        options.selectedTestCase
      );
      await saveContent(content, options.outputFile);
      console.log("✅ Test execution complete");
    } else {
      console.error("ERROR: Invalid action. Use 'generate' or 'execute'");
      process.exit(1);
    }
  } catch (error) {
    console.error(
      "ERROR:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

main();
