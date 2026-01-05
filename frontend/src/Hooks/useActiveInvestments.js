import { useQuery } from "@tanstack/react-query";
import { fetchActiveInvestments } from "../api/earnings";

export function useActiveInvestments() {
  const { data, isLoading } = useQuery({
    queryKey: ["active-investments"],
    queryFn: async () => {
      const res = await fetchActiveInvestments();
      return res.data.investments;
    },
  });

  return {
    investments: data || [],
    loading: isLoading,
  };
}
