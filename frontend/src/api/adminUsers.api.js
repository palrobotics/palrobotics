import api from "./api";

export const fetchAdminUsers = () => api.get("/admin/users");

export const blockAdminUser = (uid) => api.patch(`/admin/users/${uid}/block`);

export const unblockAdminUser = (uid) =>
  api.patch(`/admin/users/${uid}/unblock`);

export const fetchAdminUserById = (uid) => api.get(`/admin/users/${uid}`);
