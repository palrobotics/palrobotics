import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "../api/transactions.api";

export function useTransactions(type) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["transactions", type],
    queryFn: () => fetchTransactions(type),
  });

  return {
    transactions: data || [],
    loading: isLoading,
    refetch,
  };
}
