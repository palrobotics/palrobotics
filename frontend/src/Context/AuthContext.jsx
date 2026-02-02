import { createContext, useContext, useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/index";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Firebase auth user
  const [profile, setProfile] = useState(null); // Firestore user data
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();
  const hasShownWelcome = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);

      try {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));

        if (snap.exists()) {
          const data = snap.data();
          setProfile(data);
          setIsAdmin(data.role === "admin");
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setProfile(null);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!profile || hasShownWelcome.current) return;

    const key = `welcome_shown_${profile.uid}`;

    // Only show once per account
    if (!localStorage.getItem(key) && profile.firstDepositRewarded === false) {
      alert(
        "🎉 Welcome!\n\nYour account has been successfully created and you have received a UGX 2,000 welcome bonus to get you started.",
      );

      localStorage.setItem(key, "true");
      hasShownWelcome.current = true;
    }
  }, [profile]);

  const logout = async () => {
    try {
      await signOut(auth);
      queryClient.clear();
      // onAuthStateChanged will handle clearing user & profile
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        isEmailVerified: !!user?.emailVerified,
        logout,
        isAdmin,
        role: profile?.role ?? "user",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
