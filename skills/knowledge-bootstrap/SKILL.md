---
name: knowledge-bootstrap
description: Draft the foundation of an existing project's team knowledge base from its codebase — overview, features and scope, business rules, glossary, getting started, architecture, integrations, known issues — flag everything the code can't confirm for the PM / BA, upgrade an older docs/knowledge/ layout, and open one PR for review. Use when the user runs /knowledge-bootstrap, or asks to fill in, seed or bootstrap project knowledge, or says the knowledge base is missing the big picture.
---

# Bootstrap the project knowledge base

`/team-knowledge:share-context` records what is learned session by session, but nobody writes down what the project *is*. This skill drafts that foundation from the code so the PM / BA only has to **correct and confirm**, not write from scratch.

Templates live in `../knowledge-init/templates/` relative to this file.

## The evidence rule (most important)

The code shows **what** the product does. It rarely shows **why**, **for whom**, or whether a behaviour is **intended**.
- State as fact only what you can point to in the code or existing docs. Record the evidence in the section's `related:` line.
- Anything about audience, goals, motivation, priorities or intent is a guess. Write your best guess, mark it `⚠ Needs PM/BA confirmation`, and add a matching entry to `open-questions.md`.
- A hard-coded value that looks like a business rule (a limit, a price, a count, a timing) is written as the current behaviour, with the question "Is this intended?" in `open-questions.md`.
- Never invent users, customers, metrics, deadlines or roadmap items.

## Steps

### 1. Check the repo and prepare a worktree
- Find the repo root. If `docs/knowledge/INDEX.md` doesn't exist on the default branch, tell the user to run `/team-knowledge:knowledge-init` first and stop.
- `git fetch origin` and find the default branch (`git symbolic-ref --short refs/remotes/origin/HEAD`).
- Create a worktree so the developer's checkout is never touched:
  `git worktree add "<parent of repo root>/<repo name>-knowledge-bootstrap" -b knowledge/bootstrap <default branch>`.
  If the branch already exists, use `knowledge/bootstrap-<YYYYMMDD>`.
- Do all reading of `docs/knowledge/` and all writing inside that worktree.

### 2. Upgrade the knowledge base layout
Older knowledge bases only have a few technical topics. Bring them up to the current layout without losing anything:
- For every file in `../knowledge-init/templates/topics/` that is missing from `docs/knowledge/`, copy it in.
- For existing topic files without frontmatter, add frontmatter (`audience` and `owner`) using the template file of the same name. Custom topics: choose `business` if a PM or BA would own it, otherwise `technical`, with `owner: Developers` or `owner: PM`/`BA`.
- Rebuild `INDEX.md` from `../knowledge-init/templates/INDEX.md`: keep the original `_Created …_` line, and add a row for every custom topic to the matching table.
- In `CLAUDE.md`, replace the existing `## Team knowledge` section with `../knowledge-init/templates/claude-md-snippet.md`. If there is no such section, append the snippet.

### 3. Survey the codebase
Read enough to describe the project accurately. Spend the effort on breadth, not on reading every line:
- `README*`, `CLAUDE.md`, `docs/`, existing `docs/knowledge/` entries
- Manifests and config: `package.json`, `pyproject.toml`, `go.mod`, Dockerfiles, CI workflows, `.env.example`
- Entry points, routes / screens / commands, the main domain modules, constants and settings
- Tests (they often state intended behaviour), and `git log --format='%ad %an %s' --date=short` for the project's history and contributors
For a large repo, cover every top-level area briefly rather than one area deeply.

### 4. Draft the topics
Fill each topic with short, plain bullets under `##` sections. Replace `_No entries yet._` when you add content. **Never remove or rewrite existing entries.** If the code contradicts one, leave it and add an open question.

**Business topics: plain language, no code identifiers (file names only in the `related:` line).**
| Topic | Draft |
|---|---|
| `overview.md` | One paragraph on what the product is; who it's for ⚠; the problem it solves ⚠; current status (from git history). Max ~20 lines. |
| `features-and-scope.md` | Features that exist today, grouped by area. A "Not in the product" list only for things a reader would reasonably expect (e.g. accounts, saving progress) — each marked ⚠ deliberate or not yet built? |
| `business-rules.md` | Every rule the product enforces: calculations, limits, scoring, eligibility, timings, with the current values. Each rule's *reason* ⚠ unless the code or docs state it. |
| `glossary.md` | Domain terms used in the UI or code, especially ones that could be confused. One line each. |
| `product-decisions.md` | Only decisions that are evident and explained in docs, comments or commit messages. Leave it empty rather than guessing. |
| `open-questions.md` | One `##` section per question: the question, what the code currently does, and `Raised by: knowledge-bootstrap (<date>)`. Group them so a PM can answer in one sitting. |

**Technical topics: concise, for developers.**
| Topic | Draft |
|---|---|
| `architecture.md` | The main parts and how they connect; key technical choices visible in the code. |
| `getting-started.md` | How to install, run and test locally — only what isn't obvious. Verify commands against the manifests. |
| `integrations.md` | External services, APIs, CDNs or data sources and what each is for. Names of the env vars that hold credentials, never values. |
| `deployment.md` | Only what config / CI shows. If nothing, leave it empty and add an open question for the team. |
| `known-issues.md` | Clear `TODO`/`FIXME`s, missing tests, obvious limitations. |
| `conventions.md`, `gotchas.md` | Only add something clearly visible and non-obvious. These mainly grow through `/share-context`. |

Below each section you write, add: `_Drafted YYYY-MM-DD by knowledge-bootstrap — related: <repo-relative paths>_`.

### 5. Remove sensitive data
Scan everything you wrote and remove secrets, tokens, connection strings, internal hostnames or IPs, and customer or personal data.

### 6. Confirm with the user
Show a short summary: per topic, the number of entries drafted; the number of `⚠ Needs PM/BA confirmation` flags; the open questions (titles only). Ask: **create the PR? (yes / edit / skip)**. On edit, apply changes and show the summary again. On skip, remove the worktree and branch and stop.

### 7. Commit and open a PR
Inside the worktree:
- Stage `docs/knowledge/` and `CLAUDE.md` only. Commit: `docs(knowledge): bootstrap project knowledge from the codebase`.
- `git push -u origin <branch>`.
- If `gh` is available and authenticated, `gh pr create` with the title `Team knowledge: project foundation (needs PM/BA review)` and a body that tells the reviewer what to do: correct the drafts, answer `open-questions.md`, and remove each ⚠ flag once confirmed. Otherwise give the compare URL from the push output.
- Remove the worktree. If anything fails, say where it stopped and leave the worktree in place.

### 8. Report
The PR link, what was drafted, how many items need confirmation, and who should review (PM / BA for business topics, a developer for technical ones).

## Rules
- Never commit to the default branch directly.
- Keep every topic short; this is a map of the project, not documentation of the code.
- If the repo has almost no code yet, draft only `overview.md` and `open-questions.md` and say so.
