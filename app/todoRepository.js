const fs = require('node:fs');
const path = require('node:path');

function createTodoRepository(dataFile) {
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

  return { load, save };
}

module.exports = { createTodoRepository };
