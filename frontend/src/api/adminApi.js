import api from "./api"; // axios instance

export const adminApi = {
  getPendingWithdrawals: () => api.get("/admin/withdrawals/pending"),
  getPendingManualTransactions: () => api.get("/admin/deposits/pending"),

  approveWithdrawal: (transactionId) =>
    api.post("/admin/withdrawals/approve", {
      transactionId: String(transactionId),
    }),

  rejectWithdrawal: (transactionId, reason) =>
    api.post("/admin/withdrawals/reject", {
      transactionId: String(transactionId),
      reason: String(reason),
    }),
  rejectManualTransaction: (transactionId, reason) =>
    api.post("/admin/deposits/reject_manual", {
      transactionId: String(transactionId),
      reason: String(reason),
    }),
  approveDeposit: (transactionId) =>
    api.post("/admin/deposits/approve_deposit", {
      transactionId: String(transactionId),
    }),
  approveInvestment: (transactionId) =>
    api.post("/admin/deposits/approve_investment", {
      transactionId: String(transactionId),
    }),
};
