import axios from "axios";
import { auth } from "../Firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
