# TaskManagerUI

Angular 17 single-page application for managing tasks. The UI connects to TaskManagerAPI to list, create, complete, and delete tasks.

## Tech stack

- Angular 17
- Standalone components
- Reactive forms
- Signals (`TaskStore`)
- Karma + Jasmine (unit tests)
- nginx (production Docker image)

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- TaskManagerAPI running locally for development (see [TaskManagerAPI/README.md](../TaskManagerAPI/README.md))

## Getting started

From the `TaskManagerUI` folder:

```bash
npm install
npm start
```

Open `http://localhost:4200`.

The dev environment calls the API at `http://localhost:5200/api` (see `src/environments/environment.ts`).

## Available scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the dev server on port 4200 |
| `npm run build` | Build the production bundle |
| `npm test` | Run unit tests (ChromeHeadless) |
| `npm run watch` | Build in watch mode |

## Features

- View incomplete and completed tasks in separate lists
- Add a new task with client-side validation
- Mark tasks complete or incomplete
- Delete tasks
- Display API and validation errors to the user

## Project structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/           # Task and API types
│   │   ├── mappers/          # API → domain mapping
│   │   └── repositories/     # TaskRepository interface
│   └── features/tasks/
│       ├── components/       # Task form, list, item, empty state
│       ├── data/             # HttpTaskRepository
│       ├── pages/            # Task manager page
│       └── services/         # TaskStore (state management)
├── environments/             # Dev and production API URLs
└── styles.css                # Global styles and design tokens
```

## Architecture

- **`HttpTaskRepository`** — HTTP client for API calls
- **`TaskStore`** — Signal-based state for tasks, loading, and errors
- **`TaskManagerPageComponent`** — Page container that wires the store to child components
- **Components** — Presentational UI for forms, lists, and task rows

Production builds use a relative API path (`/api`) so nginx can proxy requests to the backend container.

## Environment configuration

| Environment | File | `apiUrl` |
|-------------|------|----------|
| Development | `src/environments/environment.ts` | `http://localhost:5200/api` |
| Production | `src/environments/environment.production.ts` | `/api` |

## Running tests

```bash
npm test
```

Tests cover:

- Task mapper
- HTTP repository
- Task store
- Form validation and submission
- Task list, item, empty state, and page components

## Docker

Build and run the UI container from the repo root:

```bash
docker compose up web
```

The app is served at `http://localhost:8080`. nginx serves the Angular build and proxies `/api` to the API container.

Run the full stack:

```bash
docker compose up --build
```

Then open `http://localhost:8080`.

## Full stack setup

1. Start the API: `dotnet run --project TaskManagerAPI/TaskManagerAPI.csproj`
2. Start the UI: `npm start` (from this folder)
3. Open `http://localhost:4200`

Or use Docker Compose from the repository root for a single-command setup.
