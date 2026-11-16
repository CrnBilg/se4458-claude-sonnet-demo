# Slides

Put the final presentation here (`.pptx` and a `.pdf` copy). The **public GitHub link of this repository goes on slide 1**.

Assumption: about 15 minutes in total (to be confirmed; see `demo-script.md`). Adjust the number of slides if the time is different.

## Outline (14 slides)

| # | Slide | Owner | Notes |
|---|---|---|---|
| 1 | Title, team, GitHub link | both | link visible |
| 2 | Why Claude Sonnet? (motivation) | Yasmin | |
| 3 | What is it good for / not good for | Yasmin | include honest limits |
| 4 | Model family and benchmarks | Yasmin | official numbers only, mark "vendor-reported" |
| 5 | Architecture: model → agent loop (Claude Code) → tools | Ceren | diagram |
| 6 | Services: Claude Code, API/Agent SDK, tool use | Yasmin | API code shown as snippet, **not run** |
| 7 | How we verify generated code: tests, diff, checklists | Ceren | ties to API Design lecture (testing, Swagger/OpenAPI) |
| 8 | Demo architecture: repo, `app/`, branches, what runs where | Ceren | diagram |
| 9 | Demo A (live): build from a short spec | Ceren/Yasmin | |
| 10 | Demo B (live): change request on existing code | Yasmin/Ceren | |
| 11 | Evidence: test output, diff, checklist results | both | from rehearsal log |
| 12 | Pros, cons, risks (limits, wrong code, unrequested changes, prompt injection) | both | |
| 13 | Short comparison with alternatives | Yasmin | sources required |
| 14 | Conclusion, references, GitHub link | both | |

Structure follows the assignment PDF (why, what apps, what services, example app) and the style of the earlier student decks
(why → architecture → demo workflow with code → pros/cons → conclusion).
