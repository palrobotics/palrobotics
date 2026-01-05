import { useEffect, useState } from "react";
import { auth } from "../Firebase/index";
import { sendEmailVerification, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const RESEND_COOLDOWN = 60;

export default function VerifyEmail() {
  const navigate = useNavigate();

  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);

  // Load cooldown from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("verifyCooldown");
    if (stored) {
      const diff = Math.floor((Date.now() - Number(stored)) / 1000);
      if (diff < RESEND_COOLDOWN) {
        setCooldown(RESEND_COOLDOWN - diff);
      }
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  // Redirect if no user
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  // Resend verification email
  const resendEmail = async () => {
    if (!auth.currentUser || cooldown > 0) return;

    try {
      setSending(true);
      await sendEmailVerification(auth.currentUser);

      localStorage.setItem("verifyCooldown", Date.now().toString());
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      console.error(err);
      alert("Failed to resend verification email.");
    } finally {
      setSending(false);
    }
  };

  // Check verification status
  const checkVerification = async () => {
    if (!auth.currentUser) return;

    try {
      setChecking(true);
      await auth.currentUser.reload();

      if (auth.currentUser.emailVerified) {
        await signOut(auth);
        navigate("/login");
        localStorage.removeItem("verifyCooldown");
      } else {
        alert("Email not verified yet.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to check verification status.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-orange-400 to-white px-6">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>

        <p className="text-gray-600 text-sm mb-6">
          We’ve sent a verification link to your email address. Please verify
          your email to continue.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={checkVerification}
            disabled={checking}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {checking ? "Checking..." : "I’ve Verified My Email"}
          </button>

          <button
            onClick={resendEmail}
            disabled={cooldown > 0 || sending}
            className="w-full border border-orange-500 text-orange-600 py-3 rounded-lg hover:bg-orange-50 transition disabled:opacity-50"
          >
            {sending
              ? "Sending..."
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend Verification Email"}
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-400 mt-6">
          Didn’t receive the email? Check spam or promotions.
        </p>
      </div>
    </div>
  );
}
