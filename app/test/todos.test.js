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

// --- priority + pagination (separate app with a seeded, old-format data file) ---

test('priority, filters and pagination', async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-prio-'));
  const file = path.join(dir, 'todos.json');
  // Old-format records: no priority field.
  const legacy = [
    { id: 1, title: 'Legacy open', completed: false, createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 2, title: 'Legacy done', completed: true, createdAt: '2024-01-02T00:00:00.000Z' },
  ];
  fs.writeFileSync(file, JSON.stringify(legacy, null, 2));
  const srv = await new Promise((resolve) => {
    const s = createApp(file).listen(0, () => resolve(s));
  });
  const url = `http://localhost:${srv.address().port}`;
  const call = (method, p, body) =>
    fetch(url + p, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  t.after(() => {
    srv.close();
    fs.rmSync(dir, { recursive: true, force: true });
  });

  await t.test('old record reads as normal and the file is not rewritten by reads', async () => {
    const list = await (await call('GET', '/todos')).json();
    assert.deepEqual(list.map((x) => x.priority), ['normal', 'normal']);
    assert.equal((await (await call('GET', '/todos/1')).json()).priority, 'normal');
    assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')), legacy);
  });

  await t.test('create defaults to normal, accepts valid, rejects invalid priority', async () => {
    const def = await (await call('POST', '/todos', { title: 'Default' })).json();
    assert.equal(def.priority, 'normal');
    const hi = await call('POST', '/todos', { title: 'Urgent', priority: 'high' });
    assert.equal(hi.status, 201);
    assert.equal((await hi.json()).priority, 'high');
    await call('POST', '/todos', { title: 'Later', priority: 'low', completed: true });
    await call('POST', '/todos', { title: 'Urgent done', priority: 'high', completed: true });
    const bad = await call('POST', '/todos', { title: 'x', priority: 'urgent' });
    assert.equal(bad.status, 400);
    assert.match((await bad.json()).error, /priority/);
  });

  await t.test('update priority, validate, and leave other legacy records untouched', async () => {
    const res = await call('PUT', '/todos/1', { priority: 'low' });
    assert.equal(res.status, 200);
    assert.equal((await res.json()).priority, 'low');
    assert.equal((await call('PUT', '/todos/1', { priority: 'nope' })).status, 400);
    const stored = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.deepEqual(stored[1], legacy[1]); // still has no priority field
    assert.equal(stored.length, 6);
  });

  await t.test('filter by priority, alone and with completed + pagination', async () => {
    const high = await (await call('GET', '/todos?priority=high')).json();
    assert.deepEqual(high.map((x) => x.title), ['Urgent', 'Urgent done']);
    const normal = await (await call('GET', '/todos?priority=normal')).json();
    assert.deepEqual(normal.map((x) => x.title), ['Legacy done', 'Default']);
    const highDone = await call('GET', '/todos?priority=high&completed=true');
    assert.deepEqual((await highDone.json()).map((x) => x.title), ['Urgent done']);
    const paged = await call('GET', '/todos?priority=high&limit=1&page=2');
    assert.equal(paged.headers.get('x-total-count'), '2');
    assert.deepEqual((await paged.json()).map((x) => x.title), ['Urgent done']);
    assert.equal((await call('GET', '/todos?priority=urgent')).status, 400);
  });

  await t.test('pagination defaults, X-Total-Count, and out-of-range pages', async () => {
    const all = await call('GET', '/todos');
    assert.equal(all.headers.get('x-total-count'), '6');
    assert.equal((await all.json()).length, 6);
    const p1 = await call('GET', '/todos?limit=4');
    assert.deepEqual((await p1.json()).map((x) => x.id), [1, 2, 3, 4]);
    const p2 = await call('GET', '/todos?limit=4&page=2');
    assert.deepEqual((await p2.json()).map((x) => x.id), [5, 6]);
    const empty = await call('GET', '/todos?page=9');
    assert.equal(empty.status, 200);
    assert.deepEqual(await empty.json(), []);
    assert.equal(empty.headers.get('x-total-count'), '6');
  });

  await t.test('invalid page/limit return 400 with a clear message', async () => {
    for (const q of ['page=0', 'page=-1', 'page=abc', 'page=1.5', 'limit=0', 'limit=51', 'limit=x', 'limit=', 'page=1&page=2']) {
      const res = await call('GET', `/todos?${q}`);
      assert.equal(res.status, 400, q);
      assert.match((await res.json()).error, /page|limit/, q);
    }
    assert.equal((await call('GET', '/todos?limit=50')).status, 200);
  });
});
