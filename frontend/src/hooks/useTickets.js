import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsApi } from '../lib/api';
import toast from 'react-hot-toast';

// Query keys
export const ticketKeys = {
  all: ['tickets'],
  lists: () => [...ticketKeys.all, 'list'],
  list: (filters) => [...ticketKeys.lists(), filters],
  details: () => [...ticketKeys.all, 'detail'],
  detail: (id) => [...ticketKeys.details(), id],
};

// Get all tickets
export const useTickets = (filters = {}) => {
  return useQuery({
    queryKey: ticketKeys.list(filters),
    queryFn: async () => {
      const response = await ticketsApi.getAll(filters);
      return response.data;
    },
  });
};

// Get single ticket
export const useTicket = (id) => {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: async () => {
      const response = await ticketsApi.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Create ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await ticketsApi.create(data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      toast.success('Ticket created successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// Update ticket
export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await ticketsApi.update(id, data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(data.id) });
      toast.success('Ticket updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// Delete ticket
export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await ticketsApi.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      toast.success('Ticket deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
