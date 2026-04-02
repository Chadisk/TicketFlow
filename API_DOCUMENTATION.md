# TicketFlow API Documentation

## Overview

The TicketFlow API is a RESTful service that manages helpdesk support tickets. All endpoints return JSON responses and use standard HTTP methods.

**Base URL:** `http://localhost:5000/api`  
**API Version:** 1.0.0  
**Interactive Docs:** `http://localhost:5000/api-docs`

---

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PATCH request |
| 201 | Created | Successful POST request |
| 400 | Bad Request | Invalid input data |
| 404 | Not Found | Ticket ID does not exist |
| 500 | Server Error | Database or server error |

---

## Endpoints

### 1. List All Tickets

```http
GET /tickets
```

**Description:** Retrieve all tickets with optional filtering and sorting.

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `status` | string | Filter by ticket status | pending, accepted, resolved, rejected |
| `sortBy` | string | Sort field | created, updated (default: updated) |

**Example Requests:**

```bash
# Get all tickets
curl http://localhost:5000/api/tickets

# Get pending tickets sorted by creation date
curl "http://localhost:5000/api/tickets?status=pending&sortBy=created"

# Get resolved tickets
curl "http://localhost:5000/api/tickets?status=resolved"
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "title": "Login button not working",
    "description": "The login button on the homepage does not respond to clicks in Firefox",
    "contact_info": "user@example.com",
    "status": "pending",
    "created_at": "2026-04-01T10:00:00.000Z",
    "updated_at": "2026-04-01T10:00:00.000Z"
  },
  {
    "id": 2,
    "title": "Payment gateway timeout",
    "description": "Stripe integration returns timeout errors on checkout",
    "contact_info": "support@client.com",
    "status": "accepted",
    "created_at": "2026-04-01T09:30:00.000Z",
    "updated_at": "2026-04-01T14:20:00.000Z"
  }
]
```

**Error Response (500):**

```json
{
  "error": "Database connection failed"
}
```

---

### 2. Get Single Ticket

```http
GET /tickets/:id
```

**Description:** Retrieve details of a specific ticket by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | The ticket ID |

**Example Request:**

```bash
curl http://localhost:5000/api/tickets/1
```

**Response (200 OK):**

```json
{
  "id": 1,
  "title": "Login button not working",
  "description": "The login button on the homepage does not respond to clicks in Firefox",
  "contact_info": "user@example.com",
  "status": "pending",
  "created_at": "2026-04-01T10:00:00.000Z",
  "updated_at": "2026-04-01T10:00:00.000Z"
}
```

**Error Response (404 Not Found):**

```json
{
  "error": "Ticket not found"
}
```

---

### 3. Create Ticket

```http
POST /tickets
```

**Description:** Create a new support ticket.

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `title` | string | Yes | Ticket title | 5-255 characters |
| `description` | string | Yes | Detailed ticket description | 10-5000 characters |
| `contact_info` | string | Yes | Email address of the reporter | Valid email format |

**Example Request:**

```bash
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dashboard loading slowly",
    "description": "The admin dashboard takes more than 30 seconds to load. This happens consistently across Chrome and Firefox browsers. The network tab shows multiple 400 errors from the analytics endpoint.",
    "contact_info": "admin@company.com"
  }'
```

**Response (201 Created):**

```json
{
  "id": 3,
  "title": "Dashboard loading slowly",
  "description": "The admin dashboard takes more than 30 seconds to load...",
  "contact_info": "admin@company.com",
  "status": "pending",
  "created_at": "2026-04-01T15:45:00.000Z",
  "updated_at": "2026-04-01T15:45:00.000Z"
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "\"title\" length must be at least 5 characters long"
}
```

**Other Validation Errors:**

- Title too short (< 5 chars)
- Title too long (> 255 chars)
- Description too short (< 10 chars)
- Description too long (> 5000 chars)
- Invalid email format

---

### 4. Update Ticket

```http
PATCH /tickets/:id
```

**Description:** Update ticket information or status. Only provided fields will be updated.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | The ticket ID |

**Request Headers:**

```
Content-Type: application/json
```

**Request Body (all optional):**

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `title` | string | Updated title | 5-255 characters |
| `description` | string | Updated description | 10-5000 characters |
| `contact_info` | string | Updated email | Valid email format |
| `status` | string | New status | pending, accepted, resolved, rejected |

**Example Requests:**

```bash
# Update only the status
curl -X PATCH http://localhost:5000/api/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved"
  }'

# Update description and status
curl -X PATCH http://localhost:5000/api/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Fixed in version 2.1.0",
    "status": "resolved"
  }'

# Update all fields
curl -X PATCH http://localhost:5000/api/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "description": "Updated description with more details",
    "contact_info": "newemail@example.com",
    "status": "accepted"
  }'
```

**Response (200 OK):**

```json
{
  "id": 1,
  "title": "Login button not working",
  "description": "Fixed in version 2.1.0",
  "contact_info": "user@example.com",
  "status": "resolved",
  "created_at": "2026-04-01T10:00:00.000Z",
  "updated_at": "2026-04-01T16:30:00.000Z"
}
```

**Error Response (404 Not Found):**

```json
{
  "error": "Ticket not found"
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "\"status\" must be one of [pending, accepted, resolved, rejected]"
}
```

---

### 5. Health Check

```http
GET /health
```

**Description:** Simple health check endpoint to verify API is responding.

**Example Request:**

```bash
curl http://localhost:5000/health
```

**Response (200 OK):**

```json
{
  "status": "ok"
}
```

---

## Status Workflow

Tickets can have one of four statuses:

```
pending ──→ accepted ──→ resolved
       ╲            ╱
        ╲──→ rejected
```

- **pending**: Freshly created, awaiting review
- **accepted**: Acknowledged and being worked on
- **resolved**: Completed and closed
- **rejected**: Closed without resolution

**Transitions:**
- Any status can transition to any other status
- A resolved ticket can be reopened to any other status

---

## Data Types

### Ticket Object

```typescript
interface Ticket {
  id: number;                    // Unique identifier
  title: string;                 // 5-255 characters
  description: string;           // 10-5000 characters
  contact_info: string;          // Valid email address
  status: 'pending' | 'accepted' | 'resolved' | 'rejected';
  created_at: string;           // ISO 8601 timestamp
  updated_at: string;           // ISO 8601 timestamp
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. This may be added in future versions.

---

## Pagination

Currently, all endpoints return complete result sets without pagination. For large datasets, pagination will be implemented in v2.0.

---

## Timestamps

All timestamps are in **ISO 8601 format** with UTC timezone:
```
2026-04-01T15:45:00.000Z
```

To convert to your local timezone, use your language's DateTime library:

```javascript
// JavaScript
const date = new Date('2026-04-01T15:45:00.000Z');
console.log(date.toLocaleString());
```

---

## Common Use Cases

### Create and Resolve a Ticket

```bash
# 1. Create ticket
TICKET_ID=$(curl -s -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Feature request",
    "description": "Add dark mode support to the application",
    "contact_info": "user@example.com"
  }' | jq '.id')

# 2. Mark as accepted
curl -X PATCH http://localhost:5000/api/tickets/$TICKET_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "accepted"}'

# 3. Mark as resolved
curl -X PATCH http://localhost:5000/api/tickets/$TICKET_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved"}'
```

### Filter Tickets by Status

```bash
# Get all pending tickets
curl "http://localhost:5000/api/tickets?status=pending"

# Get all resolved tickets
curl "http://localhost:5000/api/tickets?status=resolved"
```

---

## API Versioning

Current API Version: **1.0.0**

The API is accessed at `/api/`. Future versions will maintain backward compatibility or provide migration guides.

---

## Interactive Documentation

Swagger UI provides interactive API documentation:

**URL:** `http://localhost:5000/api-docs`

Features:
- Try requests directly in the browser
- See all available endpoints
- View request/response schemas
- Filter by operation type

---

## SDK/Client Libraries

To integrate TicketFlow API in your application:

### JavaScript/Node.js

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Get all tickets
const tickets = await api.get('/tickets?status=pending');

// Create ticket
const newTicket = await api.post('/tickets', {
  title: 'Bug report',
  description: 'Application crashes on startup',
  contact_info: 'user@example.com'
});
```

### Python

```python
import requests

BASE_URL = 'http://localhost:5000/api'

# Get all tickets
response = requests.get(f'{BASE_URL}/tickets?status=pending')
tickets = response.json()

# Create ticket
new_ticket = requests.post(f'{BASE_URL}/tickets', json={
    'title': 'Bug report',
    'description': 'Application crashes on startup',
    'contact_info': 'user@example.com'
})
```

---

## Support

For API issues or questions, refer to:
- GitHub Issues: `https://github.com/Chadisk/TicketFlow/issues`
- Documentation: `/api-docs`
- Main README: `./README.md`
