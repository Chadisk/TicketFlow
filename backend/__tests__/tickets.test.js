import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db.js';

describe('Tickets API', () => {
  const payrollIssue = {
    title: 'Employee cannot access payroll portal',
    description: 'A finance employee gets a 403 error after signing in to the payroll portal from Chrome.',
    contact_info: 'it-support@company.com',
  };

  const printerIssue = {
    title: 'Office printer is offline',
    description: 'Users on the third floor cannot print documents because the shared printer is showing offline.',
    contact_info: 'helpdesk@company.com',
  };

  let createdPayrollTicket;
  let createdPrinterTicket;

  beforeAll(async () => {
    await pool.query('TRUNCATE TABLE tickets RESTART IDENTITY CASCADE');

    const payrollRes = await request(app).post('/api/tickets').send(payrollIssue);
    const printerRes = await request(app).post('/api/tickets').send(printerIssue);

    createdPayrollTicket = payrollRes.body;
    createdPrinterTicket = printerRes.body;
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('GET /api/tickets', () => {
    it('returns the support tickets as a list with real ticket fields', async () => {
      const res = await request(app).get('/api/tickets');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);

      const createdIds = res.body.map((ticket) => ticket.id);
      expect(createdIds).toEqual(expect.arrayContaining([createdPayrollTicket.id, createdPrinterTicket.id]));

      expect(res.body[0]).toEqual(expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        description: expect.any(String),
        contact_info: expect.any(String),
        status: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }));
    });

    it('filters tickets by status', async () => {
      const res = await request(app).get('/api/tickets?status=pending');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      expect(res.body.every((ticket) => ticket.status === 'pending')).toBe(true);
      expect(res.body.map((ticket) => ticket.id)).toEqual(expect.arrayContaining([createdPayrollTicket.id, createdPrinterTicket.id]));
    });

    it('sorts tickets by creation time when requested', async () => {
      const res = await request(app).get('/api/tickets?sortBy=created');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].id).toBe(createdPrinterTicket.id);
      expect(res.body[1].id).toBe(createdPayrollTicket.id);
    });
  });

  describe('GET /api/tickets/:id', () => {
    it('returns a single ticket with the expected support request details', async () => {
      const res = await request(app).get(`/api/tickets/${createdPayrollTicket.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.objectContaining({
        id: createdPayrollTicket.id,
        title: payrollIssue.title,
        description: payrollIssue.description,
        contact_info: payrollIssue.contact_info,
        status: 'pending',
      }));
    });

    it('returns 404 for a ticket that does not exist', async () => {
      const res = await request(app).get('/api/tickets/999999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual(expect.objectContaining({
        error: 'Ticket not found',
      }));
    });
  });

  describe('POST /api/tickets', () => {
    it('creates a new ticket from a realistic helpdesk request', async () => {
      const newTicket = {
        title: 'New hire cannot access email and calendar',
        description: 'A newly onboarded employee cannot log in to email or calendar after the account was provisioned this morning.',
        contact_info: 'hr-support@company.com',
      };

      const res = await request(app).post('/api/tickets').send(newTicket);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        title: newTicket.title,
        description: newTicket.description,
        contact_info: newTicket.contact_info,
        status: 'pending',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }));
    });

    it('rejects invalid ticket data', async () => {
      const res = await request(app).post('/api/tickets').send({
        title: 'Bad',
        description: 'Short',
        contact_info: 'not-an-email',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/title|description|contact_info|email/i);
    });
  });

  describe('PATCH /api/tickets/:id', () => {
    it('updates the ticket status like a real support workflow', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${createdPayrollTicket.id}`)
        .send({ status: 'resolved' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.objectContaining({
        id: createdPayrollTicket.id,
        status: 'resolved',
        title: payrollIssue.title,
      }));
    });

    it('rejects an invalid ticket status update', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${createdPayrollTicket.id}`)
        .send({ status: 'done' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/status/i);
    });
  });

});
