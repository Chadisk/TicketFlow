# TicketFlow

TicketFlow is a full-stack helpdesk ticket management system built with Node.js, Express, PostgreSQL, React, Vite, Docker, and Swagger. The project is structured like a realistic job-application submission: it includes a working backend API, a polished frontend dashboard, database migrations, Docker Compose, and automated tests.

<img src="https://github.com/user-attachments/assets/d3aebd10-ae85-4a05-a184-2847f4f1b025" alt="TicketFlow dashboard screenshot">

## 1. Prerequisites

Install these tools before running the project:

- Node.js 18 or newer
- npm, which is included with Node.js
- Docker Desktop
- Docker Compose

### Install Node.js on Windows

The simplest option is to download the current LTS release from the official site:

```text
https://nodejs.org/
```

If you prefer `winget`, you can install Node.js LTS with:

```powershell
winget install OpenJS.NodeJS.LTS
```

After installation, close and reopen PowerShell, then verify the installation:

```powershell
node -v
npm -v
```

## 2. Project Setup

Open a terminal in the repository root, then install dependencies.

### Backend setup

```powershell
cd backend
npm install
copy .env.example .env
```

To load sample ticket cards manually after migrations, run:

```powershell
cd backend
npm run seed
```

Before running `npm run seed`, make sure PostgreSQL is already running and the database schema has been created with `npm run migrate`. The seed script connects to `DB_HOST` and inserts rows into the `tickets` table, so it will fail if the database is offline or the migration has not been applied yet.

The backend `.env` file uses these values by default:

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ticketflow
DB_USER=postgres
DB_PASSWORD=postgres
```

### Frontend setup

```powershell
cd frontend
npm install
```

## 3. Run the Project

### Run with Docker

This starts PostgreSQL, the backend API, and the frontend together:

```powershell
docker compose up --build
```

Open these URLs in your browser:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Swagger UI: http://localhost:5000/api-docs

On first run, the backend seeds sample ticket cards so the dashboard shows realistic data immediately.

### Run locally without Docker

Backend:

```powershell
cd backend
npm run migrate
npm run dev
```

Frontend:

```powershell
cd frontend
npm run dev
```

## 4. Run Tests

### Backend tests

```powershell
cd backend
npm test
```

### Watch mode

```powershell
cd backend
npm run test:watch
```

If you run tests inside Docker, use:

```powershell
docker compose exec backend npm test
```

## 5. API Overview

Base URL:

```text
http://localhost:5000/api
```

Endpoints:

- `GET /tickets` - list tickets with optional filtering and sorting.
- `GET /tickets/:id` - fetch a single ticket.
- `POST /tickets` - create a new ticket.
- `PATCH /tickets/:id` - update a ticket.
- `GET /health` - health check.

Query parameters for `GET /tickets`:

- `status` - filter by `pending`, `accepted`, `resolved`, or `rejected`
- `sortBy` - sort by ticket date fields supported by the API

Swagger UI is generated from the backend routes and is available at `/api-docs`.

## 6. Architecture

TicketFlow uses a layered backend and a component-based frontend.

### Backend

- `backend/src/app.js` creates the Express app, enables CORS and JSON parsing, and mounts Swagger UI.
- `backend/src/server.js` starts the HTTP server.
- `backend/src/routes/tickets.js` handles request and response flow for ticket endpoints.
- `backend/src/services/ticketService.js` contains validation and business rules.
- `backend/src/models/ticketModel.js` contains PostgreSQL queries.
- `backend/database/migrations/001_create_tickets.sql` creates the schema and indexes.

### Frontend

- `frontend/src/App.jsx` manages theme and language state.
- `frontend/src/pages/Dashboard.jsx` composes the dashboard.
- `frontend/src/components/` contains reusable UI and ticket UI components.
- `frontend/src/hooks/useTickets.js` handles API calls and ticket state.
- `frontend/src/services/api.js` configures the API client.

### Data flow

1. The user creates, updates, filters, or drags tickets in the dashboard.
2. The frontend sends requests to the backend API.
3. The backend validates the payload and persists data in PostgreSQL.
4. The frontend renders the latest ticket state and kanban board.

## 7. Testing Notes

The backend test suite includes 5 realistic API cases covering:

- list tickets
- filter tickets
- get a single ticket
- create a ticket
- update a ticket

## 8. Project Structure

```text
TicketFlow/
├── backend/
│   ├── src/
│   ├── database/
│   ├── __tests__/
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── docker-compose.yml
└── README.md
```
