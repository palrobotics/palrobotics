import api from "../api/api";

export async function createUserProfileAndWallet(payload, token) {
  const body = {
    fullName: String(payload.fullName || ""),
    email: String(payload.email || ""),
    countryCode: String(payload.countryCode || ""),
    phone: String(payload.phone || ""),
    referralCode: payload.referralCode
      ? String(payload.referralCode)
      : undefined,
    referredBy: payload.referredBy ? String(payload.referredBy) : undefined,
  };

  // Manually override the Authorization header for this specific call
  const res = await api.post("/users/create", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
