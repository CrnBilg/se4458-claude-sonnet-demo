const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createApp } = require('../server');

let server, base, tmpDir;

before(async () => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-test-'));
  const app = createApp(path.join(tmpDir, 'todos.json'));
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://localhost:${server.address().port}`;
});

after(() => {
  server.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

const json = (method, url, body) =>
  fetch(base + url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

test('GET /todos returns an empty list initially', async () => {
  const res = await fetch(base + '/todos');
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), []);
});

test('POST /todos creates a todo (201)', async () => {
  const res = await json('POST', '/todos', { title: 'Write tests' });
  assert.equal(res.status, 201);
  const todo = await res.json();
  assert.equal(todo.id, 1);
  assert.equal(todo.title, 'Write tests');
  assert.equal(todo.completed, false);
  assert.ok(!Number.isNaN(Date.parse(todo.createdAt)));
});

test('POST /todos without title returns 400', async () => {
  const res = await json('POST', '/todos', {});
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /title/);
});

test('POST /todos with invalid completed returns 400', async () => {
  const res = await json('POST', '/todos', { title: 'x', completed: 'yes' });
  assert.equal(res.status, 400);
});

test('POST /todos with malformed JSON returns 400', async () => {
  const res = await fetch(base + '/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{bad',
  });
  assert.equal(res.status, 400);
});

test('GET /todos/:id returns the todo, 404 if missing', async () => {
  const ok = await fetch(base + '/todos/1');
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).title, 'Write tests');
  const missing = await fetch(base + '/todos/999');
  assert.equal(missing.status, 404);
  assert.ok((await missing.json()).error);
});

test('GET /todos?completed filters and validates', async () => {
  await json('POST', '/todos', { title: 'Done one', completed: true });
  const done = await (await fetch(base + '/todos?completed=true')).json();
  assert.deepEqual(done.map((t) => t.title), ['Done one']);
  const open = await (await fetch(base + '/todos?completed=false')).json();
  assert.deepEqual(open.map((t) => t.title), ['Write tests']);
  const bad = await fetch(base + '/todos?completed=maybe');
  assert.equal(bad.status, 400);
});

test('PUT /todos/:id updates, validates, and 404s', async () => {
  const res = await json('PUT', '/todos/1', { completed: true });
  assert.equal(res.status, 200);
  const todo = await res.json();
  assert.equal(todo.completed, true);
  assert.equal(todo.title, 'Write tests');
  assert.equal((await json('PUT', '/todos/1', { title: '' })).status, 400);
  assert.equal((await json('PUT', '/todos/999', { title: 'x' })).status, 404);
});

test('DELETE /todos/:id removes the todo, 404 if missing', async () => {
  const res = await fetch(base + '/todos/1', { method: 'DELETE' });
  assert.equal(res.status, 204);
  assert.equal((await fetch(base + '/todos/1')).status, 404);
  assert.equal((await fetch(base + '/todos/1', { method: 'DELETE' })).status, 404);
});

test('/api-docs serves Swagger UI', async () => {
  const res = await fetch(base + '/api-docs/');
  assert.equal(res.status, 200);
  assert.match(await res.text(), /swagger/i);
});
