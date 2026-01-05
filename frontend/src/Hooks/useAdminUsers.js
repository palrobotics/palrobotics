import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminUsers,
  blockAdminUser,
  unblockAdminUser,
} from "../api/adminUsers.api";

export function useAdminUsers() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetchAdminUsers();
      return res.data.users;
    },
  });

  const blockMutation = useMutation({
    mutationFn: blockAdminUser,
    onSuccess: () => queryClient.invalidateQueries(["admin-users"]),
  });

  const unblockMutation = useMutation({
    mutationFn: unblockAdminUser,
    onSuccess: () => queryClient.invalidateQueries(["admin-users"]),
  });

  return {
    users: data || [],
    loading: isLoading,
    actionLoading: blockMutation.isPending || unblockMutation.isPending,
    blockUser: blockMutation.mutateAsync,
    unblockUser: unblockMutation.mutateAsync,
    refresh: () => queryClient.invalidateQueries(["admin-users"]),
  };
}
