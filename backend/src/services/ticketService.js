import Joi from 'joi';
import * as ticketModel from '../models/ticketModel.js';

// Validation schemas
const createTicketSchema = Joi.object({
  title: Joi.string().required().min(5).max(255),
  description: Joi.string().required().min(10).max(5000),
  contact_info: Joi.string().required().email(),
});

const updateTicketSchema = Joi.object({
  title: Joi.string().min(5).max(255),
  description: Joi.string().min(10).max(5000),
  contact_info: Joi.string().email(),
  status: Joi.string().valid('pending', 'accepted', 'resolved', 'rejected'),
});

// Service functions
export const getAllTickets = async (filters) => {
  const { status, sortBy } = filters;
  return ticketModel.getAllTickets(status, sortBy);
};

export const getTicketById = async (id) => {
  const ticket = await ticketModel.getTicketById(id);
  if (!ticket) {
    throw new Error('Ticket not found');
  }
  return ticket;
};

export const createTicket = async (data) => {
  const { error, value } = createTicketSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return ticketModel.createTicket(value.title, value.description, value.contact_info);
};

export const updateTicket = async (id, data) => {
  // Verify ticket exists
  const ticket = await ticketModel.getTicketById(id);
  if (!ticket) {
    throw new Error('Ticket not found');
  }

  const { error, value } = updateTicketSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }

  return ticketModel.updateTicket(id, value);
};
