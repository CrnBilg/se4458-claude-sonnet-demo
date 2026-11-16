# SE 4458 – Assignment 1: Claude Sonnet Coding Model

**Course:** SE 4458 Software Architecture & Design of Modern Large Scale Systems (Yaşar University, Fall 2026)
**Topic:** Claude Sonnet coding model
**Team:** Ceren Bilgenoğlu, Yasmin Malgir
**Presentation date:** 26 November 2026

This repository contains the presentation material and the running code examples for our topic.
In the demos, Claude Code (powered by Claude Sonnet) builds and then changes a small REST API in this repository,
and we verify the result ourselves with tests and a diff.

## What we demonstrate

| Demo | What it shows |
|---|---|
| **A – Build from a short spec** | Claude Code reads a short specification, plans, writes a small Express REST API with Swagger and tests, runs the tests and the server, and fixes its own errors |
| **B – Change request on existing code** | Claude Code reads the code from Demo A and adds pagination and a new field, updates the OpenAPI file and the tests |

Both demos produce code in the `app/` folder. The topics match the API Design lecture (REST, status codes, Swagger/OpenAPI, pagination, testing).

## Cost note

Both demos run **locally** and use the team members' existing Claude subscriptions through Claude Code.
No API key is used and no pay-as-you-go API usage is created. (A subscription is not free, but it creates
no additional charge for this project.)

## Repository layout

```
.
├── README.md            this file
├── demo-script.md       step-by-step demo and backup plan (read this before presenting)
├── demo-a/              Demo A: prompt and acceptance checklist
├── demo-b/              Demo B: prompt and acceptance checklist
├── app/                 the application Claude Code builds in the demos (created during Demo A)
├── docs/                rehearsal log, sources
├── slides/              presentation (add the final .pptx/.pdf here)
└── backup/              backup screen recordings (videos are git-ignored, see backup/README.md)
```

## Prerequisites

- Node.js 22.18 or newer (`node -v`)
- Git
- Claude Code, signed in with a **Claude Pro account** (not a Console/API account)

## Before every session (cost safety check)

1. In Claude Code run `/status`. The login source must be your Pro account.
2. In PowerShell run `$env:ANTHROPIC_API_KEY`. It must print nothing. (A set key overrides the subscription and creates API charges.)
3. If Claude Code ever offers to continue with API credits or usage credits after a limit message, **decline**.

## Team

| Person | Responsibility |
|---|---|
| Ceren | Repository, demo environment on the presenting laptop, Demo B rehearsal, architecture slides |
| Yasmin | Demo A rehearsal (own branch `demo-a`), theory slides, comparison slide |
| Both | Slides review, rehearsals, backup recordings, Moodle upload |

## Moodle submission checklist

- [ ] Presentation file in `slides/` (with the public GitHub link on the title slide)
- [ ] Public GitHub repository link works without login
- [ ] Code uploaded to Moodle (online.yasar.edu.tr) as required by the assignment PDF
- [ ] No secrets in the repository (`.env`, keys, tokens)

## References

See [docs/sources.md](docs/sources.md).
