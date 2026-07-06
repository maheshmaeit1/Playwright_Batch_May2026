import * as fs from "fs";
import * as path from "path";

export interface LoadedAgent {
  systemPrompt: string;
  tools: string[];
}

// Loads an agent definition from .claude/agents/<name>.md.
//
// We do NOT invoke `claude --agent <name>` directly: that flag fails to
// expose MCP tools (e.g. mcp__atlassian__*) to the model in headless
// `--print` mode, even though the same tools work fine when granted via
// --allowedTools on a plain (agent-less) invocation. Instead we read the
// agent's own system prompt and declared tool list from its definition
// file and pass them explicitly, so the agent's real behavior is reused
// without depending on the broken --agent + --print combination.
export function loadAgent(agentName: string): LoadedAgent {
  const agentFile = path.join(
    __dirname,
    "..",
    ".claude",
    "agents",
    `${agentName}.md`
  );

  const raw = fs.readFileSync(agentFile, "utf-8");

  // Tolerate both LF and CRLF line endings: a git checkout on Windows
  // (autocrlf) rewrites the agent .md to \r\n, which a \n-only regex misses.
  const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    throw new Error(`Could not parse frontmatter in ${agentFile}`);
  }

  const [, frontmatter, body] = frontmatterMatch;

  const toolsLine = frontmatter
    .split("\n")
    .find((line) => line.startsWith("tools:"));
  if (!toolsLine) {
    throw new Error(`No 'tools:' field found in ${agentFile}`);
  }

  const tools = toolsLine
    .slice("tools:".length)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return { systemPrompt: body.trim(), tools };
}
