# Installation & Setup Guide for TicketFlow

## Prerequisites

### System Requirements
- **Node.js 18.x or higher** ([Download](https://nodejs.org/))
- **PostgreSQL 15+** ([Download](https://www.postgresql.org/download/))
- **Docker & Docker Compose** (optional, for containerized setup)

---

## Step 1: Install Node.js

### Windows
1. Download the LTS version from https://nodejs.org/
2. Run the installer and follow the setup wizard
3. Ensure "Add to PATH" is checked
4. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

### macOS
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## Step 2: Install PostgreSQL

### Windows
1. Download from https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password for the `postgres` user
4. Default port: 5432

### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Linux
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

**Verify PostgreSQL:**
```bash
psql --version
```

---

## Step 3: Clone or Setup the Project

```bash
cd TicketFlow
```

---

## Option A: Automated Setup

### Windows
```powershell
.\setup.bat
```

### macOS/Linux
```bash
chmod +x setup.sh
./setup.sh
```

---

## Option B: Manual Setup

### Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# (Use your favorite editor to update DB_USER, DB_PASSWORD, etc.)

# Install dependencies
npm install

# Verify backend starts
npm run dev
# Should output: "Server running on http://localhost:5000"
# Press Ctrl+C to stop
```

### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# In the psql prompt, run:
CREATE DATABASE ticketflow;

# Exit psql
\q
```

### Run Database Migrations

```bash
# From the backend directory
npm run migrate

# Should output: "All migrations completed successfully"
```

### Seed Sample Data

```bash
# From the backend directory, after migrations succeed
npm run seed

# Should output a message like: "Seeded sample tickets" or
# "Seed skipped: sample tickets already exist"
```

Make sure PostgreSQL is running before you run `npm run migrate` or `npm run seed`. The seed script connects to the database defined in `backend/.env` and inserts rows into the `tickets` table, so it will fail if the database is offline or the migration has not been applied yet.

### Frontend Setup

```bash
cd frontend

# Copy environment file (optional, already configured)
cp .env.example .env || echo "VITE_API_URL=http://localhost:5000/api" > .env

# Install dependencies
npm install

# Verify frontend starts
npm run dev
# Should output: "Local: http://localhost:3000"
# Press Ctrl+C to stop
```

---

## Step 4: Configuration Files

### Backend `.env` File
Location: `backend/.env`

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ticketflow
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

### Frontend `.env` File
Location: `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Step 5: Running the Application

### Option 1: Using Docker Compose (Recommended)

```bash
# From the root TicketFlow directory
docker compose up --build

# Access the app:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# API Docs: http://localhost:5000/api-docs
```

When you use Docker Compose, the PostgreSQL container starts first and the backend container runs migrations and seeding automatically before launching the API.

### Option 2: Running Locally

#### Terminal 1 - Backend
```bash
cd backend
npm run migrate
npm run seed
npm run dev

# Output should show:
# Server running on http://localhost:5000
# API docs available at http://localhost:5000/api-docs
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev

# Output should show:
# Local: http://localhost:3000
```

#### Terminal 3 - Database (if not running as a service)
```bash
# macOS
brew services start postgresql

# Linux
sudo service postgresql start

# Windows - PostgreSQL should auto-start
```

If you see an error like ECONNREFUSED on port 5432, PostgreSQL is not running or is listening on a different host/port than the values in backend/.env.

---

## Step 6: Verify Everything Works

### Test Backend
```bash
# In a new terminal
curl http://localhost:5000/health

# Should return:
# {"status":"ok"}
```

### Test API
```bash
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Ticket",
    "description": "This is a test ticket description",
    "contact_info": "test@example.com"
  }'
```

### Access the Application
- **Frontend:** http://localhost:3000
- **API Documentation:** http://localhost:5000/api-docs

---

## Troubleshooting

### Issue: "npm: command not found"
**Solution:** Node.js is not installed or not in PATH
- Download from https://nodejs.org/
- On macOS/Linux: run `which node`
- On Windows: check System Environment Variables

### Issue: "connect ECONNREFUSED 127.0.0.1:5432"
**Solution:** PostgreSQL is not running
- Windows: Start PostgreSQL from Services
- macOS: `brew services start postgresql`
- Linux: `sudo service postgresql start`

### Issue: "database does not exist"
**Solution:** Run database migrations
```bash
cd backend
npm run migrate
```

### Issue: "CORS error" from Frontend
**Solution:** Ensure backend is running on port 5000 and VITE_API_URL is set correctly

### Issue: "Port already in use"
**Solution:** Modify `docker-compose.yml` or kill the process using the port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: "Bind for 0.0.0.0:5432 failed: port is already allocated"
**Solution:** Stop the PostgreSQL service or container that is already using port 5432, then start Docker Compose again.
```bash
# If you previously started the local container
docker stop ticketflow-db

# Or stop any other PostgreSQL process using 5432 before rerunning:
docker compose up --build
```

### Issue: Migrations fail
**Solution:** 
1. Ensure database exists: `createdb -U postgres ticketflow`
2. Check DB credentials in `.env`
3. Drop and recreate if needed: `npm run migrate:down && npm run migrate`

---

## Common Commands

### Backend
```bash
npm run dev          # Start development server
npm run start        # Start production server
npm test             # Run tests
npm run migrate      # Run database migrations
npm run migrate:down # Drop tables
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
```

### Docker
```bash
docker compose up --build            # Start all services
docker compose up -d --build         # Start in background
docker compose down                  # Stop all services
docker compose logs -f backend       # View backend logs
docker compose logs -f frontend      # View frontend logs
docker compose build --no-cache      # Rebuild images
```

---

## Next Steps

1. Start the application (Docker or local)
2. Create a ticket at http://localhost:3000
3. View API documentation at http://localhost:5000/api-docs
4. Run tests: `npm test` (in backend/frontend directories)

Enjoy using TicketFlow! 🎫
