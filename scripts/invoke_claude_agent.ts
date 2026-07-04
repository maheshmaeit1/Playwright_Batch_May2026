import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface AgentOptions {
  action: "generate" | "execute";
  jiraIssue?: string;
  appUrl?: string;
  testCaseFile?: string;
  outputFile: string;
}

// Test case generation prompt
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

DO NOT ask for permission or confirmation. Write the markdown content directly.
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

// Test execution prompt
async function executeTestCases(
  testCaseFile: string,
  appUrl: string
): Promise<string> {
  console.log(`[Agent] Executing test cases from ${testCaseFile}...`);

  // Read test case file
  const testCaseContent = fs.readFileSync(testCaseFile, "utf-8");

  const prompt = `You are the manual-test-runner agent.

Execute the test cases and document results.

Application: ${appUrl}
Test User: neuralqaacademy@gmail.com / Tester@123

Test Cases:
\`\`\`
${testCaseContent}
\`\`\`

Follow each test step:
1. Navigate the application
2. Execute each step exactly as described
3. Document: Pass or Fail for each step
4. Take screenshots only if test fails
5. Document actual vs expected results

Output results in markdown format with:
- Test case ID and title
- Status: PASS or FAIL
- Observations
- Any failures with evidence

DO NOT ask for permission or confirmation. Write the markdown content directly.
Start executing now.`;

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

      content = await executeTestCases(options.testCaseFile, options.appUrl);
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
