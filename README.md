# TicketFlow - Full-Stack Helpdesk Ticket Management System

A modern, scalable helpdesk support ticket management application built with Node.js + Express, PostgreSQL, and React + Vite.

## 🎯 Features

✅ **Ticket Management**
- Create tickets with title, description, and contact information
- Update ticket information and status (pending, accepted, resolved, rejected)
- List and sort tickets by status, latest update, and creation date
- Filter tickets by status
- Kanban board UI for visual workflow management
- Drag-and-drop to update ticket status

✅ **API Features**
- RESTful API with comprehensive endpoints
- Input validation with Joi
- Swagger API documentation
- CORS enabled
- Error handling middleware

✅ **Frontend**
- SPA built with React + Vite
- Responsive design with Tailwind CSS
- Shadcn/ui component library
- Real-time form validation
- Axios for API integration

✅ **Database**
- PostgreSQL with migrations
- Proper indexing for performance
- Timestamps for created and updated records

✅ **Testing & Documentation**
- Jest unit tests for API endpoints
- Swagger OpenAPI documentation
- Comprehensive API docs at `/api-docs`

✅ **Containerization**
- Docker multi-stage builds
- docker-compose for local development
- PostgreSQL service included

---

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL
- Joi (validation)
- Jest + Supertest (testing)
- Swagger/OpenAPI

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Shadcn/ui components
- Axios

**DevOps:**
- Docker & Docker Compose
- Node.js 18 Alpine

---

## 📋 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)

---

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repo-url>
cd TicketFlow

# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up

# The application will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
# - API Docs: http://localhost:5000/api-docs
```

### Option 2: Local Development Setup

#### Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Run database migrations
npm run migrate

# Start development server
npm run dev

# Server runs on http://localhost:5000
# API docs available at http://localhost:5000/api-docs
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Application runs on http://localhost:3000
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### List Tickets
```
GET /tickets?status=pending&sortBy=updated
```
**Query Parameters:**
- `status` (optional): Filter by status (pending, accepted, resolved, rejected)
- `sortBy` (optional): Sort field (created, updated)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Bug in login form",
    "description": "Users cannot reset password",
    "contact_info": "user@example.com",
    "status": "pending",
    "created_at": "2026-04-01T10:00:00Z",
    "updated_at": "2026-04-01T10:00:00Z"
  }
]
```

#### Get Single Ticket
```
GET /tickets/:id
```

#### Create Ticket
```
POST /tickets
Content-Type: application/json

{
  "title": "Issue with payment processing",
  "description": "Payment gateway returns error when processing credit cards",
  "contact_info": "support@company.com"
}
```

#### Update Ticket
```
PATCH /tickets/:id
Content-Type: application/json

{
  "status": "resolved",
  "title": "Updated title (optional)",
  "description": "Updated description (optional)"
}
```

**Status Values:** `pending`, `accepted`, `resolved`, `rejected`

#### Health Check
```
GET /health
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run with coverage
npm test -- --coverage
```

**Test Files:**
- `__tests__/tickets.test.js` - API endpoint tests

---

## 🗄️ Database Schema

### Tickets Table

```sql
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  contact_info VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  created_by_id INT,
  assigned_to_id INT
);
```

**Indexes:**
- `idx_tickets_status` - For filtering by status
- `idx_tickets_updated_at` - For sorting by latest update
- `idx_tickets_created_at` - For sorting by creation date

---

## 📁 Project Structure

```
TicketFlow/
├── backend/
│   ├── src/
│   │   ├── app.js              # Express app setup
│   │   ├── server.js           # Server entry point
│   │   ├── db.js               # PostgreSQL connection
│   │   ├── routes/
│   │   │   └── tickets.js       # Ticket endpoints
│   │   ├── services/
│   │   │   └── ticketService.js # Business logic
│   │   └── models/
│   │       └── ticketModel.js   # Database queries
│   ├── database/
│   │   ├── migrations/
│   │   │   └── 001_create_tickets.sql
│   │   ├── migrate.js
│   │   └── migrate-down.js
│   ├── __tests__/
│   │   └── tickets.test.js      # Jest tests
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx             # React entry point
│   │   ├── App.jsx              # Main app component
│   │   ├── index.css            # Tailwind styles
│   │   ├── pages/
│   │   │   └── Dashboard.jsx     # Main dashboard page
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── TicketForm.jsx    # Create/Edit form
│   │   │   ├── TicketCard.jsx    # Individual ticket
│   │   │   └── TicketKanban.jsx  # Kanban board
│   │   ├── services/
│   │   │   └── api.js            # Axios configuration
│   │   └── hooks/
│   │       └── useTickets.js      # Custom React hook
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile
│   ├── package.json
│   └── .gitignore
│
├── docker-compose.yml           # Docker Compose config
└── README.md                    # This file
```

---

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ticketflow
DB_USER=postgres
DB_PASSWORD=postgres
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```
VITE_API_URL=http://localhost:5000/api
```

---

## 🐳 Docker Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Remove volumes (warning: deletes database data)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache
```

---

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Kanban Board**: Drag-and-drop ticket status updates
- **Color-Coded Status**: Visual indication of ticket status
- **Form Validation**: Real-time feedback on form inputs
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during API calls

---

## 📈 Performance Optimizations

- Database indexing on frequently queried fields
- Vite for optimized frontend bundling
- Docker multi-stage builds for smaller images
- Connection pooling with pg
- Lazy loading in React components

---

## 🔐 Security Considerations

- Input validation with Joi
- CORS enabled with proper configuration
- SQL injection protection via parameterized queries
- Environment variables for sensitive data
- Error messages don't expose sensitive information

---

## 🚢 Deployment

### Deploy to Production

1. **Build Docker images:**
   ```bash
   docker-compose build
   ```

2. **Push to registry:**
   ```bash
   docker tag ticketflow-backend:latest your-registry/ticketflow-backend:latest
   docker push your-registry/ticketflow-backend:latest
   ```

3. **Deploy with your favorite orchestration tool** (Kubernetes, AWS ECS, etc.)

---

## 📝 License

MIT

---

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## ❓ Troubleshooting

### Port Already in Use

If ports 3000, 5000, or 5432 are already in use, modify `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Change to different port
```

### Database Connection Error

1. Ensure PostgreSQL is running: `docker-compose ps`
2. Check database credentials in `.env`
3. Run migrations: `npm run migrate`

### API Not Responding

1. Check if backend is running: `http://localhost:5000/health`
2. Check API documentation: `http://localhost:5000/api-docs`
3. View backend logs: `docker-compose logs backend`

---

## 📞 Support

For issues or questions, please open a GitHub issue or contact the development team.
