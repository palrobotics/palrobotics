import api from "../api/api";

// Deposit money to wallet via mobile money
export async function depositMobileMoney({
  amount,
  method,
  phone,
  transactionId,
}) {
  const res = await api.post("/mobile-money/deposit", {
    amount: Number(amount),
    method: String(method),
    phone: String(phone),
    transactionId: String(transactionId),
  });

  return res.data; // { reference }
}

// Invest via mobile money (no wallet math here)
export async function investWithMobileMoney({
  planId,
  method,
  phone,
  transactionId,
}) {
  const res = await api.post("/mobile-money/invest", {
    planId: String(planId),
    method: String(method),
    phone: String(phone),
    transactionId: String(transactionId),
  });

  return res.data; // { reference }
}
