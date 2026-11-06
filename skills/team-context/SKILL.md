---
name: team-context
description: Read the team knowledge base in docs/knowledge/ and summarise what applies to the current task (decisions, gotchas, rejected approaches, conventions), or give an onboarding tour of all topics. Use when the user runs /team-context, asks what the team knows or decided about an area, asks for onboarding, or is about to work in an unfamiliar part of the codebase.
---

# Recall team context

## Steps

1. **Find the knowledge base.** From the repo root, read `docs/knowledge/INDEX.md`. If it doesn't exist, say the repo has no team knowledge base yet and suggest `/team-knowledge:knowledge-init`. Then stop.

2. **Pick what to read.**
   - **With a topic argument** (e.g. `/team-knowledge:team-context payments`): read the topic files that match it by name or by description in `INDEX.md`. Also search `docs/knowledge/` for the term (grep), since related notes may live in other topics such as `gotchas.md`.
   - **Without an argument, but in the middle of a task:** infer the area from the conversation and the files being worked on, and read the matching topics.
   - **Without an argument at the start of a session, or when asked for onboarding:** read every topic file.

3. **Answer.**
   - For a task: list only the notes that change how the task should be done, grouped as **Must follow** (business rules, decisions, conventions), **Watch out** (gotchas), **Don't try** (rejected approaches) and **Unresolved** (related entries in `open-questions.md`). Say how each one affects the plan, e.g. "→ I'll put refund processing in a background job."
   - For onboarding: start with `overview.md` and `features-and-scope.md`, then one short paragraph per remaining topic, followed by a list of the topic files.
   - Mention any `⚠ Needs PM/BA confirmation` flag on a note you rely on.
   - Cite the file for each point, e.g. `(payments.md)`.
   - Mention the `_Updated …_` date when a note looks old relative to the code it describes.

4. **Flag conflicts.** If a note contradicts the current code, say so plainly and ask the user which is right. Don't silently pick one. If the code is right, suggest running `/team-knowledge:share-context` afterwards to correct the note.

## Rules
- Read-only: never edit the knowledge base from this skill.
- If nothing relevant is found, say so in one line rather than padding the answer.
