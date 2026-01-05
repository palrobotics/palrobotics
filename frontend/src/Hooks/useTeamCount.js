import { useQuery } from "@tanstack/react-query";
import api from "../api/api";

export function useTeamCount() {
  const { data, isLoading } = useQuery({
    queryKey: ["team-count"],
    queryFn: async () => {
      const res = await api.get("/referrals/team_count");
      return res.data.count;
    },
  });

  return {
    count: data || 0,
    loading: isLoading,
  };
}
