import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../Context/AuthContext";
import { fetchWallet } from "../Firebase/firestoreService";

export function useWallet() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["wallet", user?.uid],
    queryFn: () => fetchWallet(user.uid),
    enabled: !!user,
  });

  return {
    wallet: data || null,
    loading: isLoading,
  };
}
