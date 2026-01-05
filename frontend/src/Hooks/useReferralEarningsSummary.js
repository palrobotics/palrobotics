import { useQuery } from "@tanstack/react-query";
import api from "../api/api";

export function useReferralEarningsSummary() {
  const { data, isLoading } = useQuery({
    queryKey: ["referral-summary"],
    queryFn: async () => {
      const res = await api.get("/referrals/summary");
      return res.data;
    },
  });

  return {
    data,
    loading: isLoading,
  };
}
