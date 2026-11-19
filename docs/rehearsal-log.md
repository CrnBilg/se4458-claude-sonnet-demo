# Rehearsal log

Fill in after every run. This is also our evidence for the slide "what we observed".

| Date | Who | Account (1 or 2) | Demo | Duration | Result | Problems / fixes | Recorded? |
|---|---|---|---|---|---|---|---|
| | | | A | | | | |
| 2026-11-19 | Ceren | Pro (Ceren) | B | ~54 sec (from session timestamps) | Sonnet 5.5. 17/17 tests passed. Pagination, priority field and filter, openapi.json, app/README.md. Verified by us: page=2&limit=2 with X-Total-Count, limit=1000 gives 400, invalid priority gives 400, priority+completed filter, old record reads as normal and the data file is unchanged. | One Claude run, no problems. Diff review by a human still open. Code on branch demo-b-live (commit 3b3d760, local only). | No (planned 24 Nov) |

## Environment checks

| Check | Ceren laptop | Yasmin laptop |
|---|---|---|
| `node -v` ≥ 22.18 | | |
| `git --version` works | | |
| `/status` shows Pro login, no API key | | |
| `$env:ANTHROPIC_API_KEY` is empty | | |
| Repo cloned, on `main`, can push | | |
| `npm install` works in `app/` after Demo A | | |

## Usage limit notes

Pro limits are shared between Claude chat and Claude Code and use a rolling session window plus a weekly cap.
Write down when a limit message appeared so the final rehearsal can be planned around it.

| Date/time | Account | Limit message? | What we were doing |
|---|---|---|---|
| | | | |
