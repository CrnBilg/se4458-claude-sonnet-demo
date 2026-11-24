class ValidationError extends Error {}
class NotFoundError extends Error {
  constructor(message = 'Todo not found') {
    super(message);
  }
}

const PRIORITIES = ['low', 'normal', 'high'];
const DEFAULT_PRIORITY = 'normal';
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// Old records may lack priority; present them as "normal" without touching stored data.
const withPriority = (t) => ({ ...t, priority: t.priority ?? DEFAULT_PRIORITY });

function parsePositiveInt(value, name, fallback, max) {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^\d+$/.test(value) || Number(value) < 1) {
    throw new ValidationError(`${name} must be a positive integer`);
  }
  const n = Number(value);
  if (max !== undefined && n > max) {
    throw new ValidationError(`${name} must be between 1 and ${max}`);
  }
  return n;
}

function validate(body, { partial }) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object';
  }
  const { title, completed, priority } = body;
  if (!partial || title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return 'title is required and must be a non-empty string';
    }
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return 'completed must be a boolean';
  }
  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    return `priority must be one of: ${PRIORITIES.join(', ')}`;
  }
  return null;
}

function createTodoService(repository) {
  const matchesId = (id) => (t) => String(t.id) === id;

  function list({ completed, priority, page, limit } = {}) {
    const pageNum = parsePositiveInt(page, 'page', 1);
    const limitNum = parsePositiveInt(limit, 'limit', DEFAULT_LIMIT, MAX_LIMIT);
    let todos = repository.load().map(withPriority);
    if (completed !== undefined) {
      if (completed !== 'true' && completed !== 'false') {
        throw new ValidationError('completed must be "true" or "false"');
      }
      todos = todos.filter((t) => t.completed === (completed === 'true'));
    }
    if (priority !== undefined) {
      if (!PRIORITIES.includes(priority)) {
        throw new ValidationError(`priority must be one of: ${PRIORITIES.join(', ')}`);
      }
      todos = todos.filter((t) => t.priority === priority);
    }
    const start = (pageNum - 1) * limitNum;
    return { items: todos.slice(start, start + limitNum), total: todos.length };
  }

  function get(id) {
    const todo = repository.load().find(matchesId(id));
    if (!todo) throw new NotFoundError();
    return withPriority(todo);
  }

  function create(body) {
    const error = validate(body, { partial: false });
    if (error) throw new ValidationError(error);
    const todos = repository.load();
    const todo = {
      id: todos.reduce((max, t) => Math.max(max, t.id), 0) + 1,
      title: body.title.trim(),
      completed: body.completed ?? false,
      priority: body.priority ?? DEFAULT_PRIORITY,
      createdAt: new Date().toISOString(),
    };
    todos.push(todo);
    repository.save(todos);
    return todo;
  }

  function update(id, body) {
    const todos = repository.load();
    const todo = todos.find(matchesId(id));
    if (!todo) throw new NotFoundError();
    const error = validate(body, { partial: true });
    if (error) throw new ValidationError(error);
    if (body.title !== undefined) todo.title = body.title.trim();
    if (body.completed !== undefined) todo.completed = body.completed;
    if (body.priority !== undefined) todo.priority = body.priority;
    repository.save(todos);
    return withPriority(todo);
  }

  function remove(id) {
    const todos = repository.load();
    const index = todos.findIndex(matchesId(id));
    if (index === -1) throw new NotFoundError();
    todos.splice(index, 1);
    repository.save(todos);
  }

  return { list, get, create, update, remove };
}

module.exports = { createTodoService, ValidationError, NotFoundError };
