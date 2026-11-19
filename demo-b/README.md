# Demo B – Claude Code changes existing code (change request)

**Goal:** show that the model can understand code it did not just write: read, plan a change, edit several files consistently, and keep the tests and the documentation in sync.
**Starting point:** the finished result of Demo A (branch `demo-a`, or the commit tagged by the team as the baseline).

## Setup

```powershell
git checkout demo-a
git checkout -b demo-b
claude
```

Check `/status` and `$env:ANTHROPIC_API_KEY` first (see the README cost safety check).

## The prompt (copy into Claude Code)

```text
In the app/ folder, add these changes to the existing Todo API:
1. Pagination for GET /todos: query params page (default 1) and limit (default 10, max 50). Keep the response as an array, add the X-Total-Count header. Return 400 with a clear message for invalid values.
2. A new optional field "priority" (low | normal | high, default normal) on create, update and read. The existing data file may contain todos without priority; treat them as "normal" and do not delete or rewrite existing data.
3. Optional filter GET /todos?priority=high (works together with ?completed= and pagination).
4. Update openapi.json so Swagger shows the new parameters, header and field.
5. Add or update tests for the new behaviour, including an old-format record without priority.
6. Add a short app/README.md that lists the real routes and query parameters.
First read the code and tell me your plan in a few bullets, then implement, run the tests and the server yourself, fix any failure you cause, and finish with a short summary. Do not change anything unrelated.
```

## Acceptance checklist

- [x] `npm test` passes, including the old-format record test
- [x] `GET /todos?page=2&limit=2` returns the right slice and `X-Total-Count`
- [x] `GET /todos?limit=1000` returns 400 with a clear message
- [x] Creating with `priority: "high"` works; an invalid priority returns 400
- [x] `GET /todos?priority=high&completed=false` filters correctly
- [x] Swagger (`/api-docs`) shows the new parameters and field
- [x] `app/README.md` routes match the code
- [ ] `git diff --stat` was read by a human; only expected files changed

## Why this connects to the course

Pagination, backward-compatible data changes, OpenAPI documentation and tests are topics of the API Design lecture.
The point of the demo is not that the model writes code, but that **we can verify** what it wrote with tests and a diff.

## Notes

- Live time budget: about 3–4 minutes; use the recording for the long parts and say so.
- Record every rehearsal in `docs/rehearsal-log.md`.
