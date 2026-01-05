import { useQuery } from "@tanstack/react-query";
import { fetchEarningsSummary } from "../api/earnings";

export function useEarningsSummary() {
  const { data, isLoading } = useQuery({
    queryKey: ["earnings-summary"],
    queryFn: async () => {
      const res = await fetchEarningsSummary();
      return res.data;
    },
  });

  return {
    data,
    loading: isLoading,
  };
}
