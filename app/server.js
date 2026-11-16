const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');

const DEFAULT_DATA_FILE = path.join(__dirname, 'data', 'todos.json');

function createApp(dataFile = process.env.DATA_FILE || DEFAULT_DATA_FILE) {
  function load() {
    try {
      return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (err) {
      if (err.code === 'ENOENT') return [];
      throw err;
    }
  }

  function save(todos) {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(todos, null, 2));
  }

  function validate(body, { partial }) {
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      return 'Request body must be a JSON object';
    }
    const { title, completed } = body;
    if (!partial || title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return 'title is required and must be a non-empty string';
      }
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
      return 'completed must be a boolean';
    }
    return null;
  }

  const app = express();
  app.use(express.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));

  app.get('/todos', (req, res) => {
    let todos = load();
    const { completed } = req.query;
    if (completed !== undefined) {
      if (completed !== 'true' && completed !== 'false') {
        return res.status(400).json({ error: 'completed must be "true" or "false"' });
      }
      todos = todos.filter((t) => t.completed === (completed === 'true'));
    }
    res.json(todos);
  });

  app.get('/todos/:id', (req, res) => {
    const todo = load().find((t) => String(t.id) === req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  });

  app.post('/todos', (req, res) => {
    const error = validate(req.body, { partial: false });
    if (error) return res.status(400).json({ error });
    const todos = load();
    const todo = {
      id: todos.reduce((max, t) => Math.max(max, t.id), 0) + 1,
      title: req.body.title.trim(),
      completed: req.body.completed ?? false,
      createdAt: new Date().toISOString(),
    };
    todos.push(todo);
    save(todos);
    res.status(201).json(todo);
  });

  app.put('/todos/:id', (req, res) => {
    const todos = load();
    const todo = todos.find((t) => String(t.id) === req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    const error = validate(req.body, { partial: true });
    if (error) return res.status(400).json({ error });
    if (req.body.title !== undefined) todo.title = req.body.title.trim();
    if (req.body.completed !== undefined) todo.completed = req.body.completed;
    save(todos);
    res.json(todo);
  });

  app.delete('/todos/:id', (req, res) => {
    const todos = load();
    const index = todos.findIndex((t) => String(t.id) === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Todo not found' });
    todos.splice(index, 1);
    save(todos);
    res.status(204).end();
  });

  // Malformed JSON and other errors
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

if (require.main === module) {
  const port = 3000;
  createApp().listen(port, () => console.log(`Todo API listening on http://localhost:${port}`));
}

module.exports = { createApp };
