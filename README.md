# TicketFlow

TicketFlow is a full-stack helpdesk ticket management system built as a job-application-ready project. It combines an Express API, PostgreSQL migrations, a React + Vite dashboard, Docker Compose, and Swagger documentation to demonstrate end-to-end product delivery.

## Setup

### Prerequisites

- Node.js 18+
- Docker and Docker Compose

### Docker Compose

```bash
docker compose up --build
```

This starts:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Swagger UI: http://localhost:5000/api-docs

### Local Development

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Run

Backend tests:

```bash
cd backend
npm test
```

Frontend build:

```bash
cd frontend
npm run build
```

Swagger UI is available once the backend is running at:

```text
http://localhost:5000/api-docs
```

## API Overview

Base URL:

```text
http://localhost:5000/api
```

Endpoints:

- `GET /tickets` - list tickets, with optional `status` and `sortBy` query parameters.
- `GET /tickets/:id` - fetch a single ticket by ID.
- `POST /tickets` - create a new ticket.
- `PATCH /tickets/:id` - update a ticket title, description, or status.
- `GET /health` - simple health check endpoint.

Supported ticket statuses:

- `pending`
- `accepted`
- `resolved`
- `rejected`

Swagger is generated from the route annotations in the backend and serves the live API contract at `/api-docs`.

## Architecture

TicketFlow uses a simple layered architecture in the backend and a component-based architecture in the frontend.

Backend flow:

- `src/routes/tickets.js` handles HTTP requests and response codes.
- `src/services/ticketService.js` contains validation and business rules.
- `src/models/ticketModel.js` runs PostgreSQL queries.
- `database/migrations/001_create_tickets.sql` defines the schema and indexes.
- `src/app.js` wires the Express app, CORS, JSON parsing, health check, and Swagger UI.
- `src/server.js` starts the HTTP server.

Frontend flow:

- `src/App.jsx` manages theme and language state.
- `src/pages/Dashboard.jsx` composes the main dashboard view.
- `src/components/*` provides reusable UI primitives and ticket-specific components.
- `src/hooks/useTickets.js` fetches and mutates tickets through the API client in `src/services/api.js`.

Data flow:

- Users create or update tickets from the dashboard.
- The frontend sends API requests to the backend.
- The backend validates input, persists data in PostgreSQL, and returns JSON.
- The dashboard renders the latest ticket state, filters, and kanban board.

## Testing

Backend test suite:

```bash
cd backend
npm test
```

Current coverage includes 5 realistic API cases covering list, filter, read, create, and update flows.

## Project Structure

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
