# Rehearsal log

Fill in after every run. This is also our evidence for the slide "what we observed".

| Date | Who | Account (1 or 2) | Demo | Duration | Result | Problems / fixes | Recorded? |
|---|---|---|---|---|---|---|---|
| 2026-11-16 | Yasmin | - | A | ~7 min 7 sec | Sonnet 5.5. 10/10 tests passed. Swagger verified 200, 201, 400, 404 and 204. GET /todos/1 returned 404 after deletion. | One Claude run. The initial test command failed on Node 24. Changed the test script to use a glob and reran successfully. | Screenshots |
| 2026-11-16 | Yasmin | - | A (service refactor) | - | Commit 73dee6b. Reran npm test locally: 10/10 passed. Claude smoke check: Swagger returned 200 and GET /todos returned []. | Separated HTTP routes, Todo logic and JSON storage into three files. | - |
| | | | B | | | | |

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
