import axios from "axios";
import { getAuth } from "firebase/auth";

const API = import.meta.env.VITE_BASE_URL;

async function authHeader() {
  const token = await getAuth().currentUser.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function investFromWallet(data) {
  try {
    const res = await axios.post(`${API}/wallet/invest`, data, {
      headers: await authHeader(),
    });
    return res.data;
  } catch (err) {
    alert(err.response?.data?.message || err.message || "Something went wrong");
    setLoading(false);
  }
}
