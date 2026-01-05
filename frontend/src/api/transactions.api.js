import api from "./api";

export async function fetchTransactions(type) {
  const res = await api.get("/transactions", {
    params: { type },
  });

  return res.data.transactions;
}

export async function fetchTransactionByReference(reference) {
  const res = await api.get(`/transactions/reference/${reference}`);
  return res.data.transaction;
}
