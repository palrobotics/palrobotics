import api from "../api/api";
export async function requestWithdrawal({
  amount,
  method,
  phoneNumber,
  accountName,
}) {
  try {
    // Defensive coercion to match backend expectations
    const payload = {
      amount: Number(amount),
      method: String(method),
      phoneNumber: String(phoneNumber),
      accountName: String(accountName),
    };

    const res = await api.post("/withdraw/request", payload);

    return res.data;
  } catch (err) {
    // Normalize error message
    const message =
      err.response?.data?.message || "Failed to submit withdrawal request";

    throw new Error(message);
  }
}
