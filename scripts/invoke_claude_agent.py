#!/usr/bin/env python3
"""
Invoke Claude agents via API for test generation and execution
Used by Jenkins to dynamically call agents
"""

import os
import sys
import json
import argparse
from anthropic import Anthropic

def invoke_test_generator(jira_issue, app_url):
    """Invoke jira-test-generator agent"""
    client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    print(f"[Agent] Generating test cases for {jira_issue}...")

    prompt = f"""You are the jira-test-generator agent.

Generate comprehensive manual test cases for Jira issue: {jira_issue}

Application: {app_url}
Test User: neuralqaacademy@gmail.com / Tester@123

Fetch the Jira issue details and create 5-10 detailed test cases in markdown format.

Each test case should include:
- Title (TC-XXX)
- Objective
- Preconditions
- Numbered test steps (plain language)
- Expected results
- Test data

Format as professional markdown.

Start generating now."""

    response = client.messages.create(
        model="claude-opus-4-1",
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.content[0].text

def invoke_test_executor(test_case_file, app_url):
    """Invoke manual-test-runner agent"""
    client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    print(f"[Agent] Executing test cases from {test_case_file}...")

    prompt = f"""You are the manual-test-runner agent.

Execute the test cases and document results.

Application: {app_url}
Test Cases: {test_case_file}
Test User: neuralqaacademy@gmail.com / Tester@123

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

Start executing now."""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.content[0].text

def save_test_cases(content, output_file):
    """Save generated test cases to file"""
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✅ Saved: {output_file}")

def main():
    parser = argparse.ArgumentParser(description='Invoke Claude agents from Jenkins')
    parser.add_argument('--action', choices=['generate', 'execute'], required=True,
                        help='Action to perform')
    parser.add_argument('--jira-issue', help='Jira issue key (e.g., SCRUM-2)')
    parser.add_argument('--app-url', help='Application URL')
    parser.add_argument('--test-case-file', help='Path to test case file')
    parser.add_argument('--output-file', help='Output file path')

    args = parser.parse_args()

    # Verify API key
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("ERROR: ANTHROPIC_API_KEY environment variable not set")
        sys.exit(1)

    try:
        if args.action == 'generate':
            if not args.jira_issue or not args.app_url or not args.output_file:
                print("ERROR: --jira-issue, --app-url, and --output-file required for generate")
                sys.exit(1)

            content = invoke_test_generator(args.jira_issue, args.app_url)
            save_test_cases(content, args.output_file)
            print("✅ Test case generation complete")

        elif args.action == 'execute':
            if not args.test_case_file or not args.app_url or not args.output_file:
                print("ERROR: --test-case-file, --app-url, and --output-file required for execute")
                sys.exit(1)

            content = invoke_test_executor(args.test_case_file, args.app_url)
            save_test_cases(content, args.output_file)
            print("✅ Test execution complete")

    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
