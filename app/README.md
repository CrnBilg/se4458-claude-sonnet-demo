# Todo API

Express API storing todos in a JSON file (`data/todos.json`, or `DATA_FILE`).

```
npm start      # http://localhost:3000
npm test
```

Swagger UI: `GET /api-docs`

## Routes

| Method | Path | Description |
| --- | --- | --- |
| GET | `/todos` | List todos (filtered, paginated) |
| GET | `/todos/:id` | Get one todo (404 if missing) |
| POST | `/todos` | Create a todo (201) |
| PUT | `/todos/:id` | Update a todo (partial body allowed) |
| DELETE | `/todos/:id` | Delete a todo (204) |

Todo fields: `id`, `title`, `completed` (boolean), `priority` (`low` \| `normal` \| `high`), `createdAt`.
`priority` is optional on create/update and defaults to `normal`. Records stored without a priority are returned as `normal`; the data file is not rewritten for them.

## `GET /todos` query parameters

| Param | Values | Default |
| --- | --- | --- |
| `completed` | `true` \| `false` | all |
| `priority` | `low` \| `normal` \| `high` | all |
| `page` | integer >= 1 | `1` |
| `limit` | integer 1-50 | `10` |

Filters and pagination combine, e.g. `/todos?priority=high&completed=false&page=2&limit=5`.
The response is an array; the `X-Total-Count` header holds the total number of matches before pagination.
Invalid values return `400` with `{ "error": "..." }`.
