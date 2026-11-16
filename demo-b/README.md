# Demo B – Claude connects to tools through MCP (supporting demo)

**Goal:** show *how* the model reaches outside itself (a document index and a todo list) through the Model Context Protocol,
and that its answers can be checked against known facts. Keep this short; MCP is a mechanism here, not our topic.

**Where it runs:** your own fork of https://github.com/southriver/MCP.

## Setup (once)

```powershell
git clone <YOUR-FORK-URL> mcp
cd mcp
node -v                 # must be 22.18 or newer
npm.cmd install
npm.cmd test            # runs the instructor's tests, no API key needed
```

## Connect the server to Claude Code

Do this in a normal terminal, **not** inside a Claude session. Everything after `--` is the server's own command.

```powershell
claude mcp add --transport stdio todo-docs -- node C:\path\to\mcp\index.ts
claude mcp list
```

`todo-docs` must be listed as connected. Inside a Claude session, `/mcp` also shows the status.

Do **not** run `npm start` (it launches the instructor's client, which needs an OpenAI API key and would create charges).
`npm run server` only starts the stdio server and is free, but you do not need it: Claude Code starts the server itself.

## Demo sequence (from the instructor's README, typed into Claude Code)

1. `What does the report say about the payment integration? Cite the report.`
2. `Find Sarah's outstanding action items. Include deadlines and page references.`
3. `Why do you think the security review is still pending?`
4. `Add Sarah's security review task to my todo list, including the source reference.`
5. `List todos.`
6. `Find every outstanding action item in the report. Review every chunk and include owner, deadline, and source. Mark missing fields as unspecified.`

Step 3 asks for an opinion ("why do you think"), but the report (page 7, Security review) does state the reason: the review is pending because replay-protection evidence has not been supplied. A good answer finds that passage, cites it, and separates what the document says from its own guesses instead of inventing other reasons.

## How we check the answer

The instructor's README contains an answer sheet with the expected pending commitments (the README says there are 12, with some decoys such as
completed work and suggestions without an owner). After step 6 compare Claude's list with it item by item and record the result below.
Do not show the answer sheet to Claude before the run.

| Run | Date | Items found correctly | Missed | Wrongly added | Notes |
|---|---|---|---|---|---|
| 1 | | /12 | | | |

## Talking points (30–60 seconds)

- MCP = a standard way (JSON-RPC over stdio or HTTP) for a model to call your tools; it is not REST.
- The tools here: `searchDocument`, `scanDocumentForTodos`, `addTodo`, `listTodos`.
- Search is keyword based (SQLite full-text), not embeddings; the instructor's README says so too.
- Security: text inside documents is untrusted data and must not be treated as instructions (the instructor's agent prompt states this).
