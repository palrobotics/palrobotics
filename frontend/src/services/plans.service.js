import api from "../api/api";

export async function fetchPlans() {
  const res = await api.get("/api/plans");
  return res.data;
}
