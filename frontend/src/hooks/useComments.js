import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../lib/api';
import toast from 'react-hot-toast';

// Query keys
export const commentKeys = {
  all: ['comments'],
  byTicket: (ticketId) => [...commentKeys.all, 'ticket', ticketId],
};

// Get comments for a ticket
export const useComments = (ticketId, params = {}) => {
  return useQuery({
    queryKey: [...commentKeys.byTicket(ticketId), params],
    queryFn: async () => {
      const response = await commentsApi.getByTicketId(ticketId, params);
      return response.data;
    },
    enabled: !!ticketId,
  });
};

// Create comment
export const useCreateComment = (ticketId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await commentsApi.create(ticketId, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byTicket(ticketId) });
      toast.success('Comment added successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
