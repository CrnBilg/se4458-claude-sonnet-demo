# Demo A – Claude Code works on the instructor's Todo API

**Goal:** show the full loop of a coding model: read → plan → edit → run → fix, on real course code.
**Where it runs:** your own fork of https://github.com/southriver/apiNode (not in this repo). This folder only holds the task and the checklist.

## Setup (once)

```powershell
git clone <YOUR-FORK-URL> apiNode
cd apiNode
git checkout -b demo-a
npm.cmd install
npm.cmd run dev
```

Check: `http://localhost:3000/api-docs` shows Swagger UI and `GET http://localhost:3000/todos` returns JSON.

> Not yet verified on Windows: the project depends on native SQLite packages (`sqlite3`, `better-sqlite3`).
> If `npm install` fails, note the error in `docs/rehearsal-log.md` **on day 1**, not on demo day.

## What is already in the project (so the demo does not re-do it)

Verified in the instructor's code: `GET /todos` with `?completed=`, `GET /todos/search?keyword=`, `GET/POST/PUT/PATCH/DELETE`,
DTO validation, Swagger at `/api-docs`, SQLite table `todos(id, title, completed, createdAt)`.
There is **no test suite** (`npm test` is a placeholder) and **no pagination** and **no priority field**.
The README mentions `/api/items` and a `src/` folder, but the code uses `/todos` and top-level folders, so the README is out of date.

## The task we give Claude Code (copy into the session)

```
You are working in a Node.js/Express/SQLite Todo API. First read index.js, services/, db/, dto/ and docs/openapi.json
and tell me your plan in a few bullet points. Then implement:

1. Pagination for GET /todos: query params page (default 1) and limit (default 10, max 50), response keeps the
   current array shape but adds X-Total-Count and Link headers. Validate bad values with a 400 and a clear message.
2. A new optional field "priority" (low | normal | high, default normal) on create, update and read.
   The database file may already exist, so add a safe migration (do not delete or recreate the table).
3. Update docs/openapi.json so Swagger shows the new parameters and field.
4. Add automated tests using Node's built-in test runner (node:test) for the new behaviour, use a temporary
   database so tests never touch todos.db, and make "npm test" run them.
5. Fix the README so the documented routes match the real ones.

Run the tests and the server yourself, fix any failure you cause, and finish with a short summary of what changed.
```

## Acceptance checklist (we verify this ourselves, we do not just trust the summary)

- [ ] `npm test` passes (screenshot of output)
- [ ] `GET /todos?page=2&limit=2` returns the right slice and the `X-Total-Count` header
- [ ] `GET /todos?limit=1000` returns 400 with a clear message
- [ ] Creating a todo with `priority: "high"` works; an invalid priority returns 400
- [ ] The existing `todos.db` still opens (the migration did not wipe data)
- [ ] Swagger UI at `/api-docs` shows the new parameters
- [ ] README routes match `index.js`
- [ ] `git diff --stat` reviewed by a human before the demo ends

## Why this connects to the course

Pagination, versioning-safe changes, OpenAPI documentation and testing are the same topics as the API Design lecture
(REST best practices, Swagger/OpenAPI, handling large data). The point of the demo is not that the model writes code,
but that **we can verify** what it wrote with tests and a diff.

## Time budget for the live demo

Target 4–5 minutes live. The full task can take longer. Plan: start the task live, show the plan and the first edits,
then switch to the prepared recording of the finished run for the test and Swagger part if time is short (say so out loud).

## Notes from rehearsals

Fill in `docs/rehearsal-log.md`: how many tries, what went wrong, how long it took.
