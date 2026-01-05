import { useQuery } from "@tanstack/react-query";
import { fetchEarningsChart } from "../api/earnings";

export function useEarningsChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["earnings-chart"],
    queryFn: async () => {
      const res = await fetchEarningsChart();
      return res.data.chartData || [];
    },
  });

  return {
    data: data || [],
    loading: isLoading,
  };
}
