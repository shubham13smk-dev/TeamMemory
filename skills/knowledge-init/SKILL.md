---
name: knowledge-init
description: Set up the team knowledge base (docs/knowledge/ with INDEX.md and starter topic files) in the current git repo, add a pointer to it in CLAUDE.md, and open a PR. Use once per repo, or when the user asks to set up, initialize or bootstrap team knowledge / team context.
---

# Set up the team knowledge base

Run once per code repository. Templates live in the `templates/` folder next to this file.

## Steps

1. **Check the repo.**
   - Confirm the working directory is inside a git repo (`git rev-parse --show-toplevel`) and work from its root.
   - If `docs/knowledge/INDEX.md` already exists, tell the user the knowledge base is already set up and stop.
   - Note the current branch and whether the working tree is clean. If it has uncommitted changes, ask the user before continuing, because you will create a branch.

2. **Create the branch.** `git checkout -b knowledge/init` from the default branch (fetch and use `origin/HEAD` if available).

3. **Create the knowledge base.**
   - Copy `templates/INDEX.md` to `docs/knowledge/INDEX.md`.
   - Copy every file in `templates/topics/` into `docs/knowledge/`. There are business topics (owned by the PM / BA: overview, features and scope, business rules, glossary, product decisions, open questions) and technical topics (owned by developers). Each file's frontmatter records its `audience` and `owner`.
   - Replace `{{DATE}}` with today's date (YYYY-MM-DD) and `{{AUTHOR}}` with `git config user.name`.
   - Ask the user (one question) whether they want extra starter topics for this repo's main domains, e.g. `payments`, `auth`. For each one, create a file from `templates/topic.md` (fill in `{{TOPIC}}`, `{{AUDIENCE}}`, `{{OWNER}}` and a one-line `{{GUIDE}}`) and add a row to the matching table in `INDEX.md`. If they don't answer or decline, skip this.

4. **Point CLAUDE.md at it.**
   - If `CLAUDE.md` exists at the repo root, append the contents of `templates/claude-md-snippet.md` to the end, unless a section titled `## Team knowledge` is already there.
   - If it doesn't exist, create it with that snippet only. Don't generate other content.

5. **Commit and open a PR.**
   - `git add docs/knowledge CLAUDE.md` and commit with the message `docs: set up team knowledge base`.
   - `git push -u origin knowledge/init`.
   - If the `gh` CLI is available and authenticated (`gh auth status`), run `gh pr create --title "Set up team knowledge base" --body "<short explanation of docs/knowledge/ and the /share-context workflow>"`.
   - Otherwise, print the compare URL from the push output (or `<remote web URL>/compare/knowledge/init`) and tell the user to open the PR there.

6. **Report back** with the files created, the PR link, and the next steps:
   - If the repo already has code, run `/team-knowledge:knowledge-bootstrap` so Claude drafts the overview, scope, business rules and other foundation topics from the codebase for the PM / BA to confirm.
   - After merging, anyone can run `/team-knowledge:share-context` at the end of a session.

## Rules

- Never overwrite existing files under `docs/knowledge/` or existing content in `CLAUDE.md`.
- Don't push to the default branch directly.
