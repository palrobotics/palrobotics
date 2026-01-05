import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "../services/plans.service";
import { useAuth } from "../Context/AuthContext";

export function usePlans() {
  const { isAuthenticated } = useAuth();

  const defaultPlans = [
    {
      id: "L1",
      name: "L1 Robot",
      price: 15000,
      durationDays: 30,
      dailyIncome: 3000,
      image: "/images/L1.jpg",
    },
    {
      id: "L2",
      name: "L2 Robot",
      price: 30000,
      durationDays: 30,
      dailyIncome: 6000,
      image: "/images/L2.jpg",
    },
    {
      id: "L3",
      name: "L3 Robot",
      price: 50000,
      durationDays: 30,
      dailyIncome: 10000,
      image: "/images/L3.jpg",
    },
    {
      id: "V4",
      name: "V4 Robot",
      price: 80000,
      durationDays: 60,
      dailyIncome: 16000,
      image: "/images/V4.jpg",
    },
    {
      id: "V5",
      name: "V5 Robot",
      price: 120000,
      durationDays: 60,
      dailyIncome: 24000,
      image: "/images/V5.jpg",
    },
    {
      id: "V6",
      name: "V6 Robot",
      price: 150000,
      durationDays: 60,
      dailyIncome: 30000,
      image: "/images/V6.jpg",
    },
    {
      id: "LV7",
      name: "LV7 Robot",
      price: 300000,
      durationDays: 90,
      dailyIncome: 60000,
      image: "/images/LV7.jpg",
    },
    {
      id: "LV8",
      name: "LV8 Robot",
      price: 500000,
      durationDays: 90,
      dailyIncome: 100000,
      image: "/images/LV8.jpg",
    },
    {
      id: "LV9",
      name: "LV9 Robot",
      price: 1000000,
      durationDays: 90,
      dailyIncome: 200000,
      image: "/images/LV9.jpg",
    },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await fetchPlans();
      return res;
    },
    enabled: isAuthenticated,
  });

  return {
    plans: isAuthenticated ? data || [] : defaultPlans,
    loading: isAuthenticated ? isLoading : false,
  };
}
