import { db } from "../config/firebase.js";

//Normalize user object before sending to frontend

function mapUser(doc) {
  const data = doc.data();

  return {
    uid: doc.id,
    name: data.fullName || "",
    email: data.email || "",
    phone: data.phone || "",
    role: data.role || "user",
    referralCode: data.referralCode || null,
    createdAt: data.createdAt || null,
    activeInvestments: data.activeInvestments || 0,
    isBlocked: data.isBlocked || false,
  };
}

//Get all users (ADMIN ONLY)
export async function getAllUsers() {
  const snap = await db.collection("users").orderBy("createdAt", "desc").get();

  return snap.docs.map(mapUser);
}

//Get single user by UID
export async function getUserById(uid) {
  const doc = await db.collection("users").doc(uid).get();

  if (!doc.exists) {
    return null;
  }

  return mapUser(doc);
}

// Update user (admin actions only)
export async function updateUser(uid, updates) {
  const userRef = db.collection("users").doc(uid);

  await userRef.update({
    ...updates,
    updatedAt: new Date(),
  });
}

// Block or unblock a user
export async function setUserBlocked(uid, blocked) {
  await db.collection("users").doc(uid).update({
    blocked,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
