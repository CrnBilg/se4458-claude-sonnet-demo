# SE 4458 – Assignment 1: Claude Sonnet Coding Model

**Course:** SE 4458 Software Architecture & Design of Modern Large Scale Systems (Yaşar University, Fall 2026)
**Topic:** Claude Sonnet coding model
**Team:** Ceren Bilgenoğlu, Yasmin Malgir
**Presentation date:** 26 November 2026

This repository contains the presentation material and the running code examples for our topic.
The demos show how a coding model (Claude Sonnet, used through Claude Code) works on **real course
code** from the instructor's classwork repositories, instead of a toy app built only for the demo.

## What we demonstrate

| Demo | What it shows | Based on |
|---|---|---|
| **A (main)** | Claude Code reads a REST API, plans a change, edits the code, writes and runs tests, fixes its own errors | Instructor's Todo API (Node/Express/SQLite) |
| **B (supporting)** | How the model connects to external tools through MCP (Model Context Protocol) and answers with cited sources | Instructor's MCP example server |

MCP is only the *connection mechanism* in our talk; the topic itself is the coding model and how it is used.

## Cost note

Both demos run **locally** and use the team members' existing Claude subscriptions through Claude Code.
No API key is used and no pay-as-you-go API usage is created. (A subscription is not free, but it creates
no additional charge for this project.) The instructor's original MCP client (`client.ts`) needs an
OpenAI API key; we do **not** use it.

## Repository layout

```
.
├── README.md            this file
├── demo-script.md       step-by-step demo and backup plan (read this before presenting)
├── demo-a/              Demo A: task prompt, acceptance checklist, our fork/branch notes
├── demo-b/              Demo B: MCP setup steps and result log
├── docs/                rehearsal log, sources, notes
├── slides/              presentation (add the final .pptx/.pdf here)
└── backup/              backup screen recordings (videos are git-ignored, see backup/README.md)
```

The instructor's code is **not copied into this repository by hand**. We use GitHub forks so the original
author stays visible (links below). Fork URLs are filled in by the team:

- Todo API (Node/Express): https://github.com/southriver/apiNode — our fork: `TODO`
- MCP example: https://github.com/southriver/MCP — our fork: `TODO`

## Prerequisites

- Node.js **22.18 or newer** (the instructor's MCP example uses native TypeScript and SQLite). Check with `node -v`.
- Git
- Claude Code, signed in with a **Claude Pro account** (not a Console/API account)

## Before every session (cost safety check)

1. In Claude Code run `/status`. The login source must be your Pro account.
2. In PowerShell run `$env:ANTHROPIC_API_KEY`. It must print nothing. (A set key overrides the subscription and creates API charges.)
3. If Claude Code ever offers to continue with API credits or usage credits after a limit message, **decline**.
4. Never run `npm start` in the instructor's MCP project (it needs an OpenAI key). `npm test` and `npm run server` are fine.

## Team

| Person | Responsibility |
|---|---|
| Ceren | Repository, Claude Code setup, Demo B, demo environment on the presenting laptop |
| Yasmin | Demo A dry run (own branch `demo-a`), theory slides, comparison slide |
| Both | Slides review, rehearsals, backup recordings, Moodle upload |

## Moodle submission checklist

- [ ] Presentation file in `slides/` (with the public GitHub link on the title slide)
- [ ] Public GitHub repository link works without login
- [ ] Code uploaded to Moodle (online.yasar.edu.tr) as required by the assignment PDF
- [ ] No secrets in the repository (`.env`, keys, tokens)

## References

See [docs/sources.md](docs/sources.md).
