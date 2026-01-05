import api from "./api";

export const fetchEarningsSummary = () => api.get("/earnings/summary");

export const fetchActiveInvestments = () =>
  api.get("/earnings/active-investments");

export const fetchEarningsHistory = () => api.get("/earnings/history");

export const fetchEarningsChart = () => api.get("/earnings/history");
