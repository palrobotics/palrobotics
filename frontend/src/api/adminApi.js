import api from "./api"; // axios instance

export const adminApi = {
  getPendingWithdrawals: () => api.get("/admin/withdrawals/pending"),

  approveWithdrawal: (transactionId) =>
    api.post("/admin/withdrawals/approve", {
      transactionId: String(transactionId),
    }),

  rejectWithdrawal: (transactionId, reason) =>
    api.post("/admin/withdrawals/reject", {
      transactionId: String(transactionId),
      reason: String(reason),
    }),
};
