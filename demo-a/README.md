# Demo A – Claude Code builds a small REST API from a short spec

**Goal:** show the full loop of a coding model: plan → write → run → fix, starting from an empty `app/` folder.
**Where it runs:** this repository, on a branch (`demo-a` for rehearsals, `demo-a-live` for the presentation).

## Setup

```powershell
git checkout -b demo-a
claude
```

Before starting, run `/status` and check `$env:ANTHROPIC_API_KEY` (see the README cost safety check).

## The prompt (copy into Claude Code)

```text
Create a small REST API in the folder app/ using Node.js and Express. Use no native dependencies and store data in a JSON file under app/data/ (add app/data/ to .gitignore).
Resource: todos with id, title, completed (boolean) and createdAt.
Endpoints: GET /todos (optional ?completed=true|false), GET /todos/:id, POST /todos, PUT /todos/:id, DELETE /todos/:id.
Validate input and return proper status codes (201, 400, 404) with a clear error message.
Serve Swagger UI at /api-docs from an openapi.json that matches the real endpoints.
Separate the code into app/server.js for Express routes, HTTP responses, Swagger and startup; app/todoService.js for validation, filtering and Todo operations; and app/todoRepository.js for JSON file reading and writing.
Add tests with Node's built-in test runner (node:test) that use a temporary data file, and make "npm test" run them. Add "npm start" to run the server on port 3000.
First tell me your plan in a few bullets. Then build it, run the tests and the server yourself, fix any failure you cause, and finish with a short summary. Do not add features I did not ask for.
```

## Acceptance checklist (we verify it ourselves, we do not just trust the summary)

- [x] `npm test` passes (screenshot of the output)
- [x] `npm start` runs and `GET http://localhost:3000/todos` returns `[]`
- [x] `POST /todos` with a title returns 201; without a title returns 400 with a clear message
- [x] `GET /todos/999` returns 404
- [x] `/api-docs` shows Swagger UI and the documented endpoints match the real ones
- [x] Routes in `app/server.js` call `app/todoService.js`, and the service uses `app/todoRepository.js` for file access (check the `require` lines and that routes do no file I/O)
- [x] `app/data/` is git-ignored
- [x] No unrequested features or extra dependencies (check `package.json` and `git diff --stat`)

## Notes

- If the run is long, show the plan and the first files live, then continue with the prepared recording for the test and Swagger part and say so out loud.
- When Demo A is finished and checked, commit it on `demo-a` and push, so Demo B can start from the same code.
- Record every rehearsal in `docs/rehearsal-log.md` (tries, duration, problems).
