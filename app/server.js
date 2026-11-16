const express = require('express');
const path = require('node:path');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');
const { createTodoRepository } = require('./todoRepository');
const { createTodoService, ValidationError, NotFoundError } = require('./todoService');

const DEFAULT_DATA_FILE = path.join(__dirname, 'data', 'todos.json');

function createApp(dataFile = process.env.DATA_FILE || DEFAULT_DATA_FILE) {
  const service = createTodoService(createTodoRepository(dataFile));

  const app = express();
  app.use(express.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));

  app.get('/todos', (req, res) => {
    res.json(service.list({ completed: req.query.completed }));
  });

  app.get('/todos/:id', (req, res) => {
    res.json(service.get(req.params.id));
  });

  app.post('/todos', (req, res) => {
    res.status(201).json(service.create(req.body));
  });

  app.put('/todos/:id', (req, res) => {
    res.json(service.update(req.params.id, req.body));
  });

  app.delete('/todos/:id', (req, res) => {
    service.remove(req.params.id);
    res.status(204).end();
  });

  // Malformed JSON and other errors
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message });
    }
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
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
