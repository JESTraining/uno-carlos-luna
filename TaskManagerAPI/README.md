# TaskManagerAPI

ASP.NET Core 8 Web API for the Task Manager application. Tasks are stored in memory and exposed through a REST API with a consistent response envelope.

## Tech stack

- .NET 8
- ASP.NET Core Web API
- Swagger (development)
- xUnit, Moq, AutoFixture (tests)

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

## Getting started

From the `TaskManagerAPI` folder:

```bash
dotnet restore
dotnet run --project TaskManagerAPI/TaskManagerAPI.csproj
```

The API starts at `http://localhost:5200`.

In development, Swagger UI is available at:

```
http://localhost:5200/swagger
```

## API endpoints

Base path: `/api/tasks`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks |
| `POST` | `/api/tasks` | Create a task |
| `DELETE` | `/api/tasks/{id}` | Delete a task |
| `PATCH` | `/api/tasks/{id}/toggle` | Toggle task completion |

### Request and response examples

**Create task**

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Buy milk"
}
```

**Success response**

```json
{
  "success": true,
  "message": "Task created successfully.",
  "data": {
    "id": 1,
    "title": "Buy milk",
    "isComplete": false
  },
  "errors": null
}
```

**Validation error**

```json
{
  "success": false,
  "message": "One or more validation errors occurred.",
  "data": null,
  "errors": ["Title is required."]
}
```

### Task model

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | Unique task identifier |
| `title` | `string` | Task title (1–500 characters) |
| `isComplete` | `bool` | Completion status |

## Project structure

```
TaskManagerAPI/
├── TaskManagerAPI/
│   ├── Controllers/        # HTTP endpoints
│   ├── Services/           # Business logic
│   ├── Repositories/       # In-memory data access
│   ├── Models/             # Domain entities
│   ├── Responses/          # ApiResponse wrapper
│   ├── Middleware/         # Global exception handling
│   └── Program.cs          # App startup and DI
└── TaskManagerAPI.Tests/   # Unit tests
```

## Architecture

The API follows a layered structure:

- **Controllers** handle HTTP requests and responses only
- **Services** contain business rules and validation
- **Repositories** manage in-memory storage

Dependency injection is configured in `Program.cs`. Data is held in a singleton `InMemoryTaskRepository`, so tasks persist until the process restarts.

## CORS

CORS is enabled for the Angular dev server and Docker web container:

- `http://localhost:4200`
- `http://localhost:8080`

## Running tests

From the `TaskManagerAPI` folder:

```bash
dotnet test
```

## Docker

Build and run the API container from the repo root:

```bash
docker compose up api --build
```

The API listens on port `8080` inside the Docker network. When running the full stack with `docker compose up`, the web container proxies `/api` requests to this service.

Rebuild after code changes:

```bash
docker compose up --build
```

Then open `http://localhost:8080`.

## Configuration

| Environment | URL | Notes |
|-------------|-----|-------|
| Local development | `http://localhost:5200` | Swagger enabled |
| Docker production | `http://api:8080` | Used by nginx proxy in the UI container |

Settings files:

- `TaskManagerAPI/appsettings.json`
- `TaskManagerAPI/appsettings.Development.json`

## Related projects

- [TaskManagerUI](../TaskManagerUI/README.md) — Angular frontend
- [Root README](../README.md) — Full stack overview and demo
