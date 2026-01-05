import { auth } from "../Firebase";

export async function initiateMobileMoney({ amount, method, type, planId }) {
  const user = auth.currentUser;
  const token = await user.getIdToken();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const res = await fetch(`${BASE_URL}/secure/mobile-money/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount: Number(amount),
      method: String(method),
      type: String(type),
      planId: planId != null ? String(planId) : undefined,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
