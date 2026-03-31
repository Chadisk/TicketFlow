# TicketFlow Architecture

## System Overview

TicketFlow is a full-stack web application following a layered architecture pattern with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser                              │
├─────────────────────────────────────────────────────────────┤
│                   Presentation Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React SPA (Vite + Tailwind + shadcn)         │   │
│  │  Dashboard | Forms | Kanban | Components | Hooks    │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
                              ↕ HTTP/REST
├─────────────────────────────────────────────────────────────┤
│                    API Gateway / Server                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Express.js RESTful API (Node.js)             │   │
│  │  Routes | Middleware | Error Handling | CORS        │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                   Application Layer                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │    Services & Business Logic                         │   │
│  │  ├── ticketService.js (validation, logic)           │   │
│  │  ├── Joi Validation Schemas                          │   │
│  │  └── Error Handling                                  │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                   Data Access Layer                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │    Models & Database Queries                         │   │
│  │  ├── ticketModel.js (SQL queries)                   │   │
│  │  ├── Connection Pooling (pg)                         │   │
│  │  └── Parameterized Queries                           │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
                              ↕ SQL
├─────────────────────────────────────────────────────────────┤
│                    PostgreSQL Database                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  tickets table | Migrations | Indexes | Schemas      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Architecture Layers

### 1. Presentation Layer (Frontend)

**Technology:** React 18 + Vite + Tailwind CSS + shadcn/ui

**Responsibilities:**
- User interface rendering
- Form validation and submission
- State management
- API communication
- User interactions (drag-and-drop)

**Key Components:**
```
frontend/src/
├── pages/
│   └── Dashboard.jsx          # Main application page
├── components/
│   ├── TicketForm.jsx         # Create/Edit form
│   ├── TicketKanban.jsx       # Kanban Board container
│   ├── TicketCard.jsx         # Individual ticket card
│   ├── Button.jsx             # Reusable button
│   ├── Card.jsx               # Reusable card
│   └── Input.jsx              # Form inputs
├── hooks/
│   └── useTickets.js          # Custom React hook
├── services/
│   └── api.js                 # Axios instance
└── App.jsx                    # Root component
```

**Data Flow:**
```
User Action → Component → Hook (useTickets) → API Service → HTTP Request → Backend
```

---

### 2. Application Layer (API)

**Technology:** Express.js + Node.js

**Responsibilities:**
- Request routing
- Input validation
- Business logic execution
- Error handling
- Response formatting

**Key Files:**
```
backend/src/
├── app.js                     # Express app setup
├── server.js                  # Server entry point
├── routes/
│   └── tickets.js             # Route handlers
└── services/
    └── ticketService.js       # Business logic & validation
```

**Request Flow:**
```
HTTP Request → Router → Validation → Service Logic → Data Access → Response
```

**Validation:**
- All inputs validated using Joi schemas
- Type checking
- Length constraints
- Format validation (email)
- Status enum validation

---

### 3. Data Access Layer (Persistence)

**Technology:** PostgreSQL + pg (Node.js driver)

**Responsibilities:**
- Database connection management
- Query execution
- Data persistence
- Migrations management

**Key Files:**
```
backend/
├── src/
│   ├── db.js                  # PostgreSQL connection pool
│   └── models/
│       └── ticketModel.js     # Database queries
├── database/
│   ├── migrations/
│   │   └── 001_create_tickets.sql
│   ├── migrate.js             # Migration runner
│   └── migrate-down.js        # Rollback script
```

**Database Schema:**
```sql
tickets
├── id (PK, SERIAL)
├── title (VARCHAR 255)
├── description (TEXT)
├── contact_info (VARCHAR 255)
├── status (VARCHAR 50, CHECK)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── created_by_id (INT, FK - future)
└── assigned_to_id (INT, FK - future)
```

**Indexes:**
- `idx_tickets_status` - Fast status filtering
- `idx_tickets_updated_at` - Fast sorting by latest update
- `idx_tickets_created_at` - Fast sorting by creation date

---

## Request/Response Lifecycle

### Create Ticket Flow

```
1. User submits form
   └─→ Frontend: TicketForm component

2. Request validation (Frontend)
   └─→ Form field validation rules

3. API request
   └─→ POST /api/tickets
       - Headers: Content-Type: application/json
       - Body: {title, description, contact_info}

4. Request received (Backend)
   └─→ Express router: routes/tickets.js

5. Input validation (Backend)
   └─→ Joi schema validation
   └─→ Returns 400 if invalid

6. Business logic (Backend)
   └─→ ticketService.createTicket()
   └─→ Generate timestamps
   └─→ Set default status to 'pending'

7. Database write (Backend)
   └─→ ticketModel.createTicket()
   └─→ Parameterized SQL query
   └─→ Returns created ticket

8. Response to client
   └─→ HTTP 201 Created
   └─→ JSON with ticket data

9. Frontend update
   └─→ useTickets hook updates state
   └─→ Dashboard re-renders
   └─→ New ticket appears in Kanban board
```

### Update Ticket Status Flow (Kanban Drag-and-Drop)

```
1. User drags ticket card
   └─→ TicketKanban component handles drag events

2. Drop on column
   └─→ onUpdateTicket handler triggered
   └─→ New status determined

3. API request
   └─→ PATCH /api/tickets/:id
   └─→ Body: {status: "resolved"}

4. Validation
   └─→ Ticket exists?
   └─→ Status is valid?

5. Update record
   └─→ ticketModel.updateTicket()
   └─→ Set updated_at to current time

6. Response
   └─→ HTTP 200 OK
   └─→ Updated ticket data

7. UI refresh
   └─→ useTickets hook updates state
   └─→ Kanban board re-renders
   └─→ Ticket moves to correct column
```

---

## Component Decomposition

### Frontend Components

**Smart Components (Container):**
- `Dashboard.jsx` - Manages app state and API calls

**Presentational Components:**
- `TicketForm.jsx` - Reusable form component
- `TicketKanban.jsx` - Kanban board container
- `TicketCard.jsx` - Individual ticket display
- `Button.jsx` - Reusable button
- `Card.jsx` - Reusable card container
- `Input.jsx` - Form input components

**Custom Hooks:**
- `useTickets()` - Encapsulates ticket API logic

**Pattern: Composition over Inheritance**
```jsx
<Dashboard>
  ├─ TicketForm (when creating)
  └─ TicketKanban
     ├─ Status Column (x4)
     └─ TicketCard (x many)
```

---

## Security Architecture

### Input Validation
```javascript
// Frontend: Client-side validation
- Email format validation
- Text length checks
- Required field validation

// Backend: Server-side validation (Primary)
- Joi schema validation for all inputs
- Type checking
- Allowed values (enum for status)
```

### Database Security
```javascript
// Parameterized Queries
const result = await pool.query(
  'SELECT * FROM tickets WHERE id = $1',
  [id]  // Parameter binding - prevents SQL injection
);
```

### Error Handling
```javascript
// Don't expose internal details
if (error) {
  res.status(500).json({ error: 'Database error' });
  // Never: error.message, stack trace, etc.
}
```

### CORS Configuration
```javascript
app.use(cors());  // Allow cross-origin requests from frontend
```

---

## Scalability Considerations

### Current Implementation
- Single PostgreSQL instance
- Connection pooling with pg
- Indexed queries for fast lookups

### Future Enhancements
- Database replication
- Read replicas for scaling queries
- Caching layer (Redis)
- Message queue (Bull, RabbitMQ) for async tasks
- Microservices architecture

---

## Error Handling Strategy

### Backend Error Flow
```
Request
  ↓
Validation Error? → Return 400 + error message
  ↓ No
Execute Logic
  ↓
Logic Error? → Return 400 + error message
  ↓ No
DB Error? → Return 500 + generic message
  ↓ No
Success → Return 200/201 + data
```

### Frontend Error Handling
```javascript
try {
  const ticket = await createTicket(data);
  // Success
} catch (error) {
  // Display user-friendly error message
  alert(`Error: ${error.response?.data?.error || error.message}`);
}
```

---

## Testing Architecture

### Backend Tests (Jest + Supertest)
```
__tests__/
└── tickets.test.js
    ├── GET /api/tickets
    ├── GET /api/tickets/:id
    ├── POST /api/tickets (success + validation)
    ├── PATCH /api/tickets/:id
    └── GET /health
```

### Test Pyramid
```
    △
   /E2E Tests\       (Selenium, Cypress)
  /Integration Tests\ (API + Database)
 /Unit Tests\        (Services, Models)
/_____________\
 Test Coverage
```

---

## Deployment Architecture

### Docker Containerization

```
├── Backend Container
│   ├── Node.js Runtime
│   ├── Express App
│   └── Port 5000
├── Frontend Container
│   ├── Node.js Runtime
│   ├── Vite Dev/Production Server
│   └── Port 3000
└── PostgreSQL Container
    ├── Database Engine
    └── Port 5432
```

### Docker Compose Services
```yaml
postgres:
  - Image: postgres:15-alpine
  - Persistent volume for data
  - Health checks

backend:
  - Build from Dockerfile
  - Depends on postgres
  - Watches src directory

frontend:
  - Build from Dockerfile
  - Depends on backend
  - Watches src directory
```

---

## Development Workflow

### Local Development
```
1. docker-compose up
   ├─ PostgreSQL starts
   ├─ Backend starts (nodemon watches files)
   ├─ Frontend starts (Vite HMR enabled)
   └─ Postgres waits for health check

2. Developer edits code
   └─ HMR refreshes browser (frontend)
   └─ Nodemon restarts server (backend)

3. API requests flow:
   Frontend (3000) → Backend (5000) → Database
```

### CI/CD Pipeline (Future)
```
Push to GitHub
  ↓
Run tests
  ↓
Build Docker images
  ↓
Push to registry
  ↓
Deploy to production
```

---

## Data Flow Diagrams

### Create Ticket
```
┌──────────────┐
│   TicketForm │ (React Component)
└──────┬───────┘
       │ handleSubmit()
       ↓
┌──────────────────────────┐
│  useTickets.createTicket │ (Custom Hook)
└──────┬───────────────────┘
       │ await api.post()
       ↓
┌──────────────────────────┐
│   Axios Instance         │ (HTTP Client)
└──────┬───────────────────┘
       │ HTTP POST
       ↓
       🌐 Network
       ↓
┌──────────────────────────┐
│   Express Router         │ (POST /tickets)
└──────┬───────────────────┘
       │ route handler
       ↓
┌──────────────────────────┐
│  ticketService.validate  │ (Joi Validation)
└──────┬───────────────────┘
       │ valid?
       ↓
┌──────────────────────────┐
│  ticketModel.createTicket│ (SQL INSERT)
└──────┬───────────────────┘
       │ INSERT
       ↓
┌──────────────────────────┐
│  PostgreSQL              │ (Database)
└──────┬───────────────────┘
       │ Response
       ↓
   Return: Ticket Object
```

---

## Performance Optimization

### Frontend
- Vite code splitting
- Lazy loading components
- React memo for expensive renders
- Optimized Tailwind CSS (production build)

### Backend
- Connection pooling (pg)
- Database indexes on frequent queries
- Parameterized queries (no string concatenation)
- Proper response status codes

### Database
- Indexes on status, created_at, updated_at
- Efficient query structure
- Pagination ready (for future)

---

## Monitoring & Logging (Future)

**Recommended additions:**
- Winston for logging
- Sentry for error tracking
- DataDog or New Relic for APM
- ELK stack for log aggregation

---

## Version History

- **v1.0.0** (Current)
  - Basic ticket CRUD
  - Kanban board
  - REST API
  - PostgreSQL storage

- **v2.0.0** (Planned)
  - User authentication
  - Pagination
  - WebSocket real-time updates
  - Activity history
  - Assignee assignment
  - Comments/notes system

- **v3.0.0** (Future)
  - Microservices architecture
  - Advanced reporting
  - Integration with external services
  - AI-powered ticket classification

---

For more details, see the main [README.md](./README.md) and [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
