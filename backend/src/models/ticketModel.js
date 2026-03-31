import pool from '../db.js';

// Get all tickets with optional filters and sorting
export const getAllTickets = async (status, sortBy, sortOrder = 'DESC') => {
  let query = 'SELECT * FROM tickets WHERE 1=1';
  const values = [];

  if (status) {
    query += ' AND status = $' + (values.length + 1);
    values.push(status);
  }

  // Default sort by latest update
  const sortField = sortBy === 'created' ? 'created_at' : 'updated_at';
  query += ` ORDER BY ${sortField} ${sortOrder}`;

  const result = await pool.query(query, values);
  return result.rows;
};

// Get single ticket by ID
export const getTicketById = async (id) => {
  const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [id]);
  return result.rows[0];
};

// Create new ticket
export const createTicket = async (title, description, contact_info) => {
  const now = new Date().toISOString();
  const result = await pool.query(
    `INSERT INTO tickets (title, description, contact_info, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, description, contact_info, 'pending', now, now]
  );
  return result.rows[0];
};

// Update ticket
export const updateTicket = async (id, updateData) => {
  const { title, description, contact_info, status } = updateData;
  const now = new Date().toISOString();

  const allowedFields = [];
  const values = [];
  let paramCount = 1;

  if (title !== undefined) {
    allowedFields.push(`title = $${paramCount++}`);
    values.push(title);
  }
  if (description !== undefined) {
    allowedFields.push(`description = $${paramCount++}`);
    values.push(description);
  }
  if (contact_info !== undefined) {
    allowedFields.push(`contact_info = $${paramCount++}`);
    values.push(contact_info);
  }
  if (status !== undefined) {
    allowedFields.push(`status = $${paramCount++}`);
    values.push(status);
  }

  if (allowedFields.length === 0) {
    return getTicketById(id);
  }

  allowedFields.push(`updated_at = $${paramCount++}`);
  values.push(now);
  values.push(id);

  const query = `UPDATE tickets SET ${allowedFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows[0];
};
