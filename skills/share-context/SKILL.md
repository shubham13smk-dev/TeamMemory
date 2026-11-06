---
name: share-context
description: Save what was learned in this Claude session (technical and product decisions and why, business rules, scope changes, terms, open questions, gotchas, rejected approaches, conventions) into the team knowledge base in docs/knowledge/, editing topic files in place, and open a PR for review. Use when the user runs /share-context or asks to share context, save this for the team, document this decision, or update team knowledge.
---

# Share session context with the team

Turn what was learned in this session into durable team knowledge. The knowledge base must stay **small, current and trustworthy**. Saving nothing is better than saving noise.

## Steps

### 1. Check the knowledge base
- Find the repo root (`git rev-parse --show-toplevel`).
- If `docs/knowledge/INDEX.md` doesn't exist, tell the user to run `/team-knowledge:knowledge-init` first and stop.
- Read `INDEX.md`, then read the topic files this session's work touches.

### 2. Extract candidate items from this session
Review the conversation and the changes made in it (`git diff`, `git status`, recent commits on this branch). Look for:

| Type | What qualifies | Usual topic |
|---|---|---|
| **Business rule** | A rule the product must follow (a limit, calculation, game rule, eligibility…), with its reason | `business-rules.md` |
| **Scope** | A feature added, removed, or deliberately left out | `features-and-scope.md` |
| **Product decision** | A choice about how the product behaves for users, with the reason | `product-decisions.md` |
| **Term** | A word that now has a specific meaning in this project | `glossary.md` |
| **Open question** | A product question the session couldn't settle, or an assumption that needs a PM / BA to confirm | `open-questions.md` |
| **Decision** | A technical choice that shapes future work, with the reason | `architecture.md` |
| **Gotcha** | Something non-obvious that broke or nearly broke, and how to avoid it | `gotchas.md` or the area's topic |
| **Rejected** | An approach that was tried or considered and dropped, and why | the area's topic |
| **Convention** | A pattern or rule the team should follow from now on | `conventions.md` |

If an item has a business side and a technical side, split it: the rule in plain language in the business topic, the implementation detail in the technical topic.

**Leave out** anything a teammate could learn from reading the code or the git log: what a function does, a list of changed files, refactor details, typo fixes, dependency bumps, or step-by-step narration of the session. Also leave out anything that was only true temporarily (debugging state, local machine setup quirks for one person).

If nothing qualifies, say: "Nothing in this session needs team context — the changes are self-explanatory from the diff." Then stop. This is a normal, good outcome.

### 3. Ask the user to confirm
Show a numbered list. For each item give the type, a one-line statement including the *why*, and the target topic file. Business items should read as a PM would say them. Also say what you left out and why, in one line. Example:

```
I found 3 things worth sharing with the team:

1. [Decision] Payment webhooks must respond in <5s; heavy work goes to the process_payment job.
   Why: the provider retries after 5s, which caused double charges.  → payments.md
2. [Gotcha] Dedupe webhooks on event_id (processed_events table).  → payments.md
3. [Rejected] DB row-locking for dedupe: it deadlocked under load.  → payments.md

Not included: the PaymentService refactor (clear from the diff).

Save these? (yes / edit / skip)
```

Wait for the answer. On **edit**, apply the user's changes and show the list again. On **skip**, stop without touching any file.

### 4. Write the items into topic files, in place
Write in a separate worktree so the developer's checkout and uncommitted code are never touched:
- `git fetch origin`, find the default branch (`git symbolic-ref --short refs/remotes/origin/HEAD`, e.g. `origin/main`).
- Pick `<slug>`: 2–4 words from the main item, e.g. `webhook-idempotency`.
- `git worktree add "<parent of repo root>/<repo name>-knowledge-<slug>" -b knowledge/<slug> <default branch>`.
- Do all edits below on the files inside that worktree, re-reading them there (they reflect the latest default branch).

For each confirmed item:
- Put it in the best-matching existing topic file, under the most relevant `##` section (create the section if needed).
- **If it contradicts or updates an existing statement, replace that statement.** Tell the user what you replaced. Never leave two conflicting versions. Never add a dated changelog entry.
- If an existing statement is now obsolete because of this session's work, remove it.
- Write tersely: short bullets, the fact plus the reason. Use `❌` to mark rejected approaches.
- **Business topics** (frontmatter `audience: business`) are read by PMs and BAs: write in plain language, with no function, variable or file names in the bullets. File paths belong only in the `related:` line.
- **Business topics are owned by the PM / BA.** Add to them, but don't rewrite or delete an existing business statement. If the session contradicts one, keep it and add an entry to `open-questions.md` instead.
- When an open question is answered in this session, record the answer in the right topic and remove the question from `open-questions.md`.
- If the target topic file doesn't exist (an older knowledge base), create it from `../knowledge-init/templates/topics/<name>.md` and add its row to the matching table in `INDEX.md`.
- Create a new custom topic only when no existing topic fits. Use `kebab-case.md` from `../knowledge-init/templates/topic.md` (fill in the title, `audience`, `owner` and guide), and add a row to the matching table in `INDEX.md`.
- Below each section you changed, set a single line (replace any previous one for that section):
  `_Updated YYYY-MM-DD by <git config user.name> — related: <repo-relative paths>_`

### 5. Remove sensitive data
Before committing, scan what you wrote and remove: secrets, API keys, tokens, passwords, connection strings, internal hostnames or IPs, customer or personal data. Describe them generically instead (e.g. "the payment provider's webhook secret, stored in the vault").

### 6. Commit and open a PR
All of this runs inside the worktree:
- Stage **only** `docs/knowledge/`. The session's code changes stay in the developer's checkout and are never part of this commit.
- Commit message: `docs(knowledge): <short summary>`.
- `git push -u origin knowledge/<slug>`.
- If the `gh` CLI is available and authenticated (`gh auth status`), run `gh pr create` with the title `Team knowledge: <short summary>` and a body listing the items. Otherwise give the user the compare URL from the push output to open the PR in the browser.
- Remove the worktree: `git worktree remove "<worktree path>"`. The branch stays on the remote for the PR.
- If anything fails, tell the user exactly where it stopped and leave the worktree in place so nothing is lost.

### 7. Report
One short summary: the items saved, the files changed, anything replaced, and the PR link.

## Rules
- Never commit to the default branch directly.
- Write exactly the items the user confirmed in step 3, nothing more. If you spot another item while writing, don't add it; mention it in the report as a suggestion for a follow-up `/team-knowledge:share-context`.
- Keep each topic file short. If a file goes past roughly 200 lines, suggest splitting it into sub-topics in the report.
