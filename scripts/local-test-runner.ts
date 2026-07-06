import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

interface TestCase {
  id: string;
  title: string;
  content: string;
}

// Extract test cases from markdown file
function extractTestCases(fileContent: string): TestCase[] {
  const testCases: TestCase[] = [];
  const pattern = /## (TC-\d+):\s+(.+?)(?=## TC-\d+:|$)/gs;
  let match;

  while ((match = pattern.exec(fileContent)) !== null) {
    const id = match[1];
    const title = match[2];
    const content = match[0];

    testCases.push({ id, title, content });
  }

  return testCases;
}

// Find test case by ID (non-interactive, for CI/Jenkins use)
function findTestCase(testCases: TestCase[], testId: string): TestCase {
  const found = testCases.find(
    (tc) => tc.id.toLowerCase() === testId.toLowerCase()
  );

  if (!found) {
    console.error(`❌ Test case "${testId}" not found in file`);
    console.error("Available test cases:");
    testCases.forEach((tc) => console.error(`  - ${tc.id}: ${tc.title}`));
    process.exit(1);
  }

  console.log(`✅ Selected: ${found.id} - ${found.title}\n`);
  return found;
}

// Execute test case using Claude CLI
async function executeTest(
  testCase: TestCase,
  appUrl: string,
  outputFile: string
): Promise<void> {
  console.log(`🚀 Executing ${testCase.id}...\n`);

  const prompt = `Execute ONLY the following test case and document results.

Application: ${appUrl}
Test User: neuralqaacademy@gmail.com / Tester@123

Test Case to Execute:
\`\`\`
${testCase.content}
\`\`\`

Start executing now.`;

  try {
    // Invoke Claude CLI with manual-test-runner agent
    console.log("Invoking manual-test-runner agent...");
    const result = execSync(`claude --agent manual-test-runner "${prompt}"`, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
      stdio: "pipe",
    });

    // Create output directory
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save results
    fs.writeFileSync(outputFile, result, "utf-8");
    console.log(`\n✅ Test execution complete`);
    console.log(`📁 Results saved: ${outputFile}\n`);

    // Display summary
    console.log("=".repeat(60));
    console.log("TEST EXECUTION SUMMARY");
    console.log("=".repeat(60));
    console.log(`Test Case: ${testCase.id}`);
    console.log(`Status: ✅ Executed`);
    console.log(`Results: ${outputFile}`);
    console.log("=".repeat(60));
  } catch (error) {
    console.error(
      "❌ Execution failed:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

// Main function
async function main(): Promise<void> {
  console.log("\n🔷 Local Test Runner - Claude Agent\n");

  // Parse arguments
  const args = process.argv.slice(2);
  let testCaseFile = "";
  let appUrl = "";
  let testId = "";
  let outputFile = "";

  // Parse flags
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];

    if (flag === "--test-file") testCaseFile = value;
    if (flag === "--app-url") appUrl = value;
    if (flag === "--test-id") testId = value;
    if (flag === "--output-file") outputFile = value;
  }

  // Validate required args - no interactive fallback, this runs headless in Jenkins
  if (!testCaseFile || !appUrl || !testId || !outputFile) {
    console.error(
      "ERROR: --test-file, --app-url, --test-id, and --output-file are all required"
    );
    console.error(
      'Usage: ts-node local-test-runner.ts --test-file <path> --app-url <url> --test-id TC-001 --output-file <path>'
    );
    process.exit(1);
  }

  // Verify test case file exists
  if (!fs.existsSync(testCaseFile)) {
    console.error(`❌ Test case file not found: ${testCaseFile}`);
    process.exit(1);
  }

  console.log(`📄 Test Case File: ${testCaseFile}`);
  console.log(`🌐 Application URL: ${appUrl}`);
  console.log(`🎯 Requested Test: ${testId}\n`);

  // Read and parse test cases
  const fileContent = fs.readFileSync(testCaseFile, "utf-8");
  const testCases = extractTestCases(fileContent);

  if (testCases.length === 0) {
    console.error("❌ No test cases found in file");
    process.exit(1);
  }

  console.log(`Found ${testCases.length} test case(s) in file\n`);

  // Find the approved test case (no prompt, provided by Jenkins)
  const selectedTest = findTestCase(testCases, testId);

  // Execute test
  await executeTest(selectedTest, appUrl, outputFile);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
