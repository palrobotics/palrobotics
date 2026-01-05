import { doc, getDoc } from "firebase/firestore";
import { db, auth } from ".";

//FETCH WALLET
export async function fetchWallet(uid) {
  const ref = doc(db, "wallets", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return snap.data();
}
