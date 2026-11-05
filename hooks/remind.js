#!/usr/bin/env node
// Stop hook: remind the developer (once per session) to run /team-knowledge:share-context
// when the session changed code in a repo that has a team knowledge base.
// It only prints a message; it never blocks Claude and never writes to the repo.

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const KNOWLEDGE_DIR = path.join("docs", "knowledge");

function readStdin() {
  try {
    return JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
}

function main() {
  const input = readStdin();
  if (input.stop_hook_active) return;

  const cwd = input.cwd || process.cwd();
  let root;
  try {
    root = git(["rev-parse", "--show-toplevel"], cwd).trim();
  } catch {
    return; // not a git repo
  }
  if (!fs.existsSync(path.join(root, KNOWLEDGE_DIR))) return;

  // Only code changes count; edits to the knowledge base itself don't need a reminder.
  let changed;
  try {
    changed = git(["status", "--porcelain", "--untracked-files=all"], root)
      .split("\n")
      .map((line) => line.slice(3).trim().replace(/^"|"$/g, ""))
      .filter((file) => file && !file.replace(/\\/g, "/").startsWith("docs/knowledge/"));
  } catch {
    return;
  }
  if (changed.length === 0) return;

  const sessionId = String(input.session_id || "unknown").replace(/[^a-zA-Z0-9_-]/g, "");
  const marker = path.join(os.tmpdir(), `team-knowledge-reminded-${sessionId}`);
  if (fs.existsSync(marker)) return;
  try {
    fs.writeFileSync(marker, new Date().toISOString());
  } catch {
    // If we can't record the reminder, still show it once now.
  }

  process.stdout.write(
    JSON.stringify({
      systemMessage:
        "💡 This session changed code. If you learned anything the team should know " +
        "(a decision, a gotcha, a rejected approach), run /team-knowledge:share-context to save it.",
    })
  );
}

main();
