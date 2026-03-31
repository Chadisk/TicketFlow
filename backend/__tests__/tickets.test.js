import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db.js';

describe('Tickets API', () => {
  describe('GET /api/tickets', () => {
    it('should return a list of tickets', async () => {
      const res = await request(app).get('/api/tickets');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should support status filter', async () => {
      const res = await request(app).get('/api/tickets?status=pending');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/tickets', () => {
    it('should create a new ticket', async () => {
      const newTicket = {
        title: 'Test Ticket Title',
        description: 'This is a test ticket description that is long enough',
        contact_info: 'test@example.com',
      };

      const res = await request(app).post('/api/tickets').send(newTicket);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe(newTicket.title);
      expect(res.body.status).toBe('pending');
    });

    it('should reject invalid ticket data', async () => {
      const invalidTicket = {
        title: 'Short',
        description: 'Too short',
      };

      const res = await request(app).post('/api/tickets').send(invalidTicket);
      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/tickets/:id', () => {
    it('should update ticket status', async () => {
      // First, create a ticket
      const newTicket = {
        title: 'Test Ticket for Update',
        description: 'This is a test ticket description that is long enough',
        contact_info: 'test@example.com',
      };

      const createRes = await request(app).post('/api/tickets').send(newTicket);
      const ticketId = createRes.body.id;

      // Then update it
      const updateRes = await request(app)
        .patch(`/api/tickets/${ticketId}`)
        .send({ status: 'resolved' });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.status).toBe('resolved');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});

  afterAll(async () => {
    await pool.end();
  });
