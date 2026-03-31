import { useState, useEffect } from 'react';
import { ticketService } from '../services/api.js';

export const useTickets = (status, sortBy) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ticketService.getAllTickets(status, sortBy);
      setTickets(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [status, sortBy]);

  const createTicket = async (data) => {
    try {
      const response = await ticketService.createTicket(data);
      setTickets((currentTickets) => [response.data, ...currentTickets]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateTicket = async (id, data) => {
    try {
      const response = await ticketService.updateTicket(id, data);
      setTickets((currentTickets) => currentTickets.map((ticket) => (ticket.id === id ? response.data : ticket)));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return { tickets, loading, error, createTicket, updateTicket, refetch: fetchTickets };
};
