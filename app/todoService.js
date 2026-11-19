class ValidationError extends Error {}
class NotFoundError extends Error {
  constructor(message = 'Todo not found') {
    super(message);
  }
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

function createTodoService(repository) {
  const matchesId = (id) => (t) => String(t.id) === id;

  function list({ completed } = {}) {
    let todos = repository.load();
    if (completed !== undefined) {
      if (completed !== 'true' && completed !== 'false') {
        throw new ValidationError('completed must be "true" or "false"');
      }
      todos = todos.filter((t) => t.completed === (completed === 'true'));
    }
    return todos;
  }

  function get(id) {
    const todo = repository.load().find(matchesId(id));
    if (!todo) throw new NotFoundError();
    return todo;
  }

  function create(body) {
    const error = validate(body, { partial: false });
    if (error) throw new ValidationError(error);
    const todos = repository.load();
    const todo = {
      id: todos.reduce((max, t) => Math.max(max, t.id), 0) + 1,
      title: body.title.trim(),
      completed: body.completed ?? false,
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
    repository.save(todos);
    return todo;
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
