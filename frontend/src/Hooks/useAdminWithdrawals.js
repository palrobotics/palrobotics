import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../api/adminApi";

export function useAdminWithdrawals() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: async () => {
      const res = await adminApi.getPendingWithdrawals();
      return res.data.withdrawals;
    },
  });

  return {
    withdrawals: data || [],
    loading: isLoading,
    error,
    refresh: refetch,
  };
}
