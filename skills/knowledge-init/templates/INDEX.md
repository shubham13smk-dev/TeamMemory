# Team knowledge index

The shared source of truth for this project: what it is, the rules it follows, the decisions behind it,
and the things the code and git history don't tell you.

- Business topics are owned by the PM / BA and are the source of truth for product rules.
- Technical topics are owned by developers.
- Updated through `/team-knowledge:share-context` (or the Knowledge Portal) and reviewed in PRs. Keep each topic current; it is not a changelog.
- Claude reads this file first, then opens only the topics it needs.

## Business (owned by PM / BA)

| Topic | File | What's in it |
|---|---|---|
| Overview | [overview.md](overview.md) | One page: what the product is, who it's for, the problem it solves, the goal, and its current status |
| Features and scope | [features-and-scope.md](features-and-scope.md) | What the product does today, what is deliberately out of scope (and why), and what is planned next |
| Business rules | [business-rules.md](business-rules.md) | Rules the product must follow (calculations, limits, eligibility, game rules…), each with the reason |
| Glossary | [glossary.md](glossary.md) | Terms with a specific meaning in this project, especially ones people could confuse |
| Product decisions | [product-decisions.md](product-decisions.md) | Product-level choices and why they were made (what was chosen, what was rejected) |
| Open questions | [open-questions.md](open-questions.md) | Questions waiting for a decision, and assumptions that need confirming |

## Technical (owned by developers)

| Topic | File | What's in it |
|---|---|---|
| Architecture | [architecture.md](architecture.md) | How the system fits together and the major technical design decisions, with the reason for each |
| Getting started | [getting-started.md](getting-started.md) | How to run, test and debug the project locally |
| Conventions | [conventions.md](conventions.md) | Coding, naming, testing, visual and review conventions the team follows, with the reason for each |
| Integrations | [integrations.md](integrations.md) | External services, APIs and data sources: what each is used for, who owns it, and where its credentials live (never the credentials themselves) |
| Deployment | [deployment.md](deployment.md) | Environments, release process, configuration and infrastructure notes |
| Known issues | [known-issues.md](known-issues.md) | Known limitations and tech debt, and why they haven't been fixed yet |
| Gotchas | [gotchas.md](gotchas.md) | Non-obvious traps that don't belong to a single topic, and how to avoid them |

_Created {{DATE}} by {{AUTHOR}}_
