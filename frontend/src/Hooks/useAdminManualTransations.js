import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../api/adminApi";

export function useAdminPendingManualTxs() {
  const query = useQuery({
    queryKey: ["admin", "deposits", "manual", "pending"],
    queryFn: async () => {
      const res = await adminApi.getPendingManualTransactions();
      return res.data.transactions;
    },
  });

  return {
    transactions: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refresh: query.refetch,
  };
}
