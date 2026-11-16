# Demo script (read this before every rehearsal and before presenting)

**Assumption (to confirm):** total talk time about 15 minutes. Suggested split: 6 min slides, 5 min Demo A, 2 min Demo B, 2 min conclusion/questions.
If the real time is different, shorten Demo B first, then Demo A.

## 0. Pre-flight checklist (10 minutes before presenting)

- [ ] Laptop charged and plugged in, notifications off, font size in terminal large (zoom 150%+)
- [ ] Internet works (Claude Code needs it); phone hotspot ready as a spare
- [ ] `node -v` is 22.18 or newer
- [ ] Claude Code `/status`: login source is the Pro account. **Hide the e-mail on screen before projecting.**
- [ ] PowerShell: `$env:ANTHROPIC_API_KEY` prints nothing
- [ ] Usage: no limit warning in the last session; if you are close to the limit, **use the recording** for Demo A
- [ ] `apiNode` fork: branch `demo-a-live` freshly created from a clean `main`; `npm.cmd run dev` starts without errors, then stop it
- [ ] `mcp` fork: `claude mcp list` shows `todo-docs` connected
- [ ] Backup videos open and play (both clips), copy on the laptop and on a USB stick
- [ ] Slides open in presentation mode, GitHub link visible on slide 1
- [ ] This file open on the second screen or printed

## 1. Demo A (about 5 minutes)

Slide 9 is on screen. Switch to the terminal in the `apiNode` fork.

1. Say: "Claude Code is Sonnet running as an agent in our terminal. It can read files, edit them and run commands. I give it a real task on the instructor's Todo API."
2. Show the project quickly: `GET /todos` in Swagger or `curl.exe http://localhost:3000/todos`.
3. Start `claude`, paste the task prompt from `demo-a/README.md`.
4. While it works, narrate what you see: it **reads first**, then proposes a plan, then edits, then runs commands.
5. When it runs tests: "It runs the tests itself. If something fails it reads the error and fixes it."
6. Verify yourself (do not trust the summary): `npm.cmd test`, then one call with `?page=2&limit=2` and one invalid `?limit=1000` (400 expected). Open `/api-docs`.
7. Show `git diff --stat`. Say: "A human reviews this diff. The model is a fast assistant, the checks are ours."

If it is slow or stuck for more than 30–40 seconds, or a limit message appears: **switch to the recording** (see section 3).

## 2. Demo B (about 2 minutes)

Slide 10 is on screen. In the `mcp` fork terminal, start `claude`.

1. Say: "MCP is how the model reaches tools outside itself. It is JSON-RPC over stdio, not REST. The instructor's example server exposes document search and a todo list."
2. Type step 2 from `demo-b/README.md` (Sarah's outstanding action items with deadlines and page references).
3. Type step 3 (why is the security review pending?). The report says replay-protection evidence has not been supplied (page 7). Point out whether the answer cites that passage and keeps guesses separate from what the document says.
4. Optional if time allows: step 4 and 5 (add a todo with source, list todos).
5. Say how we checked it: the instructor's answer sheet, result recorded in our rehearsal log.

Do **not** run `npm start` here.

## 3. Backup plan

| Situation | Action |
|---|---|
| Claude does not answer for 30–40 s | Say "let me show the recording of the same run" and play `backup/demo-a_FINAL_*.mp4` (or demo-b). Always say it is a recording. |
| Usage limit message | Do not accept any API credit offer. Switch to the recording. |
| No internet | Phone hotspot. If it still fails, recording + screenshots. |
| `npm install`/server error | Show the recording; explain the error honestly if asked. |
| Projector/laptop problem | Present from the second laptop (the other Pro account must already be signed in and tested). |

## 4. Questions the instructor may ask (prepare short answers)

- **Why Sonnet and not Opus?** (Check pricing and positioning on the official page before answering.)
- **How do you know the generated code is correct?** Tests we run ourselves, the diff review, the acceptance checklist.
- **What can go wrong?** Wrong or invented answers, usage limits, prompt injection through tool/document text, secrets in code.
- **Is MCP the same as REST?** No: tool-oriented protocol for models (JSON-RPC), not resource-oriented HTTP endpoints.
- **Did you use the API?** No. We used Claude Code with our subscriptions; API code appears on a slide as a snippet and was not run.
- **What does it cost?** No additional charge for this project; the subscriptions already existed. Do not say "free".

## 5. Roles during the talk

| Part | Speaker |
|---|---|
| Slides 1–4, 6, 13 | Yasmin |
| Slides 5, 7, 8 | Ceren |
| Demo A | Ceren types, Yasmin narrates the checklist (or the other way round, decide in rehearsal) |
| Demo B | Ceren |
| Slides 11, 12, 14 | both |

## 6. Rehearsal schedule

| Date | What |
|---|---|
| 17 Nov | Environment checks on both laptops; Demo B first run; Demo A dry run on branch `demo-a` |
| 18–19 Nov | Demos stable; write the observed results into `docs/rehearsal-log.md` |
| 22–23 Nov | Rehearsal with recording (take 1) |
| 24 Nov | Timed full run, final recording, upload to Moodle |
| 25 Nov | Buffer day, light rehearsal only (protect the usage limit) |
| 26 Nov | Presentation |
