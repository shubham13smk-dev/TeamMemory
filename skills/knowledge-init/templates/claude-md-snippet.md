
## Team knowledge

The project's shared knowledge lives in `docs/knowledge/`: what the product is, its business rules and scope,
decisions and why they were made, gotchas and conventions.
Before working in an area, read `docs/knowledge/INDEX.md` and the topic files relevant to the task, and follow them.
- Business topics (overview, features and scope, business rules, glossary, product decisions) are owned by the PM / BA
  and are the source of truth for how the product should behave. If the code disagrees with them, point it out to the user
  instead of silently picking one.
- If the work depends on an unanswered product question, check `open-questions.md` and say so.
At the end of meaningful work, suggest running `/team-knowledge:share-context` to save anything the team should know.
