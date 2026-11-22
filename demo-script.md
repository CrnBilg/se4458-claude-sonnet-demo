# Demo script (read this before every rehearsal and before presenting)

**Assumption (to confirm):** total talk time about 15 minutes. Suggested split: 6 min slides, 5 min Demo A, 3 min Demo B, 1 min conclusion/questions.
If the real time is different, shorten Demo B first, then Demo A.

## 0. Pre-flight checklist (10 minutes before presenting)

- [ ] Laptop charged and plugged in, notifications off, terminal font large (zoom 150%+)
- [ ] Internet works (Claude Code needs it); phone hotspot ready as a spare
- [ ] `node -v` is 22.18 or newer
- [ ] Claude Code `/status`: login source is the Pro account. **Hide the e-mail on screen before projecting.**
- [ ] PowerShell: `$env:ANTHROPIC_API_KEY` prints nothing
- [ ] Usage: no limit warning in the last session; if you are close to the limit, **use the recording**
- [ ] Demo A: you are on `demo-a-live` (see "Branch rules" below), `git status` is clean and the `app/` folder does **not** exist
- [ ] Demo B: branch `demo-b-live` is checked out and `cd app && npm install` has been run once (`npm test` shows 10 passing before the demo)
- [ ] Backup videos open and play (both clips), copy on the laptop and on a USB stick
- [ ] Slides open in presentation mode, GitHub link visible on slide 1
- [ ] This file open on the second screen or printed

## Branch rules (which branch for which demo)

`main` now contains Yasmin's finished Demo A code in `app/` (merged with PR #1 on 19 Nov). Demo A must start from an empty repo, so **do not start Demo A from `main`.**

| Branch | What it is | Use |
|---|---|---|
| `main` | Documents plus the finished Demo A code | Reading, README, GitHub link on slide 1. Do **not** run Demo A here. |
| `demo-a-live` | Created from commit `4e0b2c7` (the last `main` commit without `app/`) | **Live Demo A.** Claude builds `app/` from scratch. |
| `demo-a` | Yasmin's rehearsal result (same code as in `main`) | Evidence for the rehearsal log; reference only. |
| `demo-b-live` | Finished Demo A code plus the Demo B change (pagination, priority) | Demo B. Checked out ready, or replay the prompt from `demo-b/README.md` on a branch created from `demo-a`. |

Create `demo-a-live` once on the presenting laptop and recreate it before each rehearsal (it must have no `app/`):

```powershell
git checkout main
git branch -D demo-a-live        # only if it exists from an earlier rehearsal
git checkout -b demo-a-live 4e0b2c7
git status                        # clean, and the app/ folder must not exist
```

Never push `demo-a-live`. After a rehearsal, switch back with `git checkout main`; the new `app/` stays on `demo-a-live` only.

## 1. Demo A (about 5 minutes): build from a short spec

Slide 9 is on screen. Switch to the terminal in the repo folder.

1. Say: "Claude Code is Sonnet running as an agent in our terminal. It can read files, edit them and run commands. I give it a short specification of a small REST API."
2. Start `claude`, paste the Demo A prompt from `demo-a/README.md`.
3. Narrate what you see: it **plans first**, then creates files, then installs and runs things.
4. When it runs the tests: "It runs the tests itself. If something fails it reads the error and fixes it."
5. Verify yourself (do not trust the summary): `npm test`, `npm start`, one `POST /todos` with and without a title, open `/api-docs`.
6. Show `git diff --stat` / the file list and say: "A human reviews this. The model is a fast assistant, the checks are ours."

The real run time varies between about one and seven minutes (Yasmin's rehearsal took about 7 min 7 sec, Ceren's on 22 Nov about 1 min 4 sec by Claude's own timer). If Claude is fast, we stay live. If it is stuck for more than 30–40 seconds, or a limit message appears: **switch to the recording** (section 3) and say out loud that it is a recording.

## 2. Demo B (about 3 minutes): change request on existing code

Slide 10 is on screen. Switch to branch `demo-b-live` (the finished Demo A code).

1. Say: "Now a change request on code that already exists: pagination and a new field, without breaking old data."
2. Start `claude`, paste the Demo B prompt from `demo-b/README.md`.
3. Point out that it **reads the existing code first** and keeps tests, Swagger and README consistent.
4. Verify: `npm test` (note the old-format record test), `GET /todos?page=1&limit=2`, `GET /todos?limit=1000` (400), Swagger.
5. Show `git diff --stat`: only the expected files changed.

## 3. Backup plan

| Situation | Action |
|---|---|
| Claude does not answer for 30–40 s | Say "let me show the recording of the same run" and play `backup/demo-a_FINAL_*.mp4` (or demo-b). Always say it is a recording. |
| Usage limit message | Do not accept any API credit offer. Switch to the recording. |
| No internet | Phone hotspot. If it still fails, recording + screenshots. |
| `npm install` or server error | Show the recording; explain the error honestly if asked. |
| Projector/laptop problem | Present from the second laptop (the other Pro account must already be signed in and tested). |

## 4. Questions the instructor may ask (prepare short answers)

- **Why Sonnet and not Opus?** (Check pricing and positioning on the official page before answering.)
- **How do you know the generated code is correct?** Tests we run ourselves, the diff review, the acceptance checklists.
- **What can go wrong?** Wrong or invented code, usage limits, unrequested changes, secrets in code, prompt injection through tool or document text.
- **Did you use the API?** No. We used Claude Code with our subscriptions; API code appears on a slide as a snippet and was not run.
- **What does it cost?** No additional charge for this project; the subscriptions already existed. Do not say "free".
- **Why did you not use the class example repositories?** Our own small app makes the demo independent and shows both writing and changing code in one place.

## 5. Roles during the talk

| Part | Speaker |
|---|---|
| Slides 1–4, 6, 13 | Yasmin |
| Slides 5, 7, 8 | Ceren |
| Demo A | Ceren types, Yasmin narrates the checklist (or the other way round, decide in rehearsal) |
| Demo B | Yasmin types, Ceren narrates (swap roles from Demo A) |
| Slides 11, 12, 14 | both |

## 6. Rehearsal schedule

| Date | What |
|---|---|
| 16 Nov | Environment checks on both laptops (Node, Git, Claude Code login, cost check) |
| 17 Nov | Yasmin: Demo A rehearsal on branch `demo-a`, pushes the result |
| 18 Nov | Ceren: Demo B rehearsal starting from Yasmin's `demo-a` result |
| 19 Nov | Both: fix problems, write results into `docs/rehearsal-log.md` |
| 22–23 Nov | Rehearsal with recording (take 1) |
| 24 Nov | Timed full run, final recording, upload to Moodle |
| 25 Nov | Buffer day, light rehearsal only (protect the usage limit) |
| 26 Nov | Presentation |
