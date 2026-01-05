import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../Firebase/index";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getAuthErrorMessage } from "../utilities/authErrors";
import LoadingOverlay from "../Components/LoadingOverlay";

export default function Login() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [resetCooldown, setResetCooldown] = useState(0);
  const [sendingReset, setSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isErr, setIsErr] = useState(false);

  const RESET_COOLDOWN_SECONDS = 60;
  const RESET_STORAGE_KEY = "password_reset_timestamp";

  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      setIsSigningIn(true);
      await signInWithEmailAndPassword(auth, email, password);
      setIsSigningIn(false);
      setIsErr(false);
      navigate("/dashboard");
    } catch (err) {
      const message = getAuthErrorMessage(err);
      toast.error(message);
      setIsErr(true);
    }
  };

  const handlePasswordReset = async () => {
    if (!userEmail) {
      toast.error("Please enter your email address first.");
      return;
    }

    if (resetCooldown > 0) {
      toast(`Please wait ${resetCooldown}s before resending`);
      return;
    }

    try {
      setSendingReset(true);

      await sendPasswordResetEmail(auth, userEmail);

      toast.success("Password reset email sent!");

      localStorage.setItem(RESET_STORAGE_KEY, Date.now().toString());
      setResetCooldown(RESET_COOLDOWN_SECONDS);
      setResetSent(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSendingReset(false);
    }
  };

  useEffect(() => {
    if (resetCooldown <= 0) return;

    const timer = setInterval(() => {
      setResetCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(RESET_STORAGE_KEY);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resetCooldown]);

  useEffect(() => {
    const lastReset = localStorage.getItem(RESET_STORAGE_KEY);

    if (!lastReset) return;

    const elapsed = Math.floor((Date.now() - Number(lastReset)) / 1000);
    const remaining = RESET_COOLDOWN_SECONDS - elapsed;

    if (remaining > 0) {
      setResetCooldown(remaining);
    } else {
      localStorage.removeItem(RESET_STORAGE_KEY);
    }
  }, []);

  return (
    <>
      {isSigningIn && !isErr && <LoadingOverlay message="SigningIn..." />}
      <div className="min-h-screen grid md:grid-cols-2 bg-linear-to-b from-orange-400 to-white">
        {/* Illustration / Branding */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gray-100 px-10">
          <h1 className="text-3xl font-bold mb-6">
            PAL<span className="text-orange-500">Robotics</span>
          </h1>
          <img
            src="/images/logo.jpg"
            alt="PAL Robotics"
            className="w-72 h-72 object-cover rounded-xl shadow"
          />
          <p className="text-gray-600 mt-6 text-center max-w-sm">
            Secure access to your robotics investments and earnings.
          </p>
        </div>

        {/* Login Form */}
        <div className="flex flex-col items-center justify-center px-6 sm:px-10">
          <img
            src="/images/logo.jpg"
            alt="PAL Robotics"
            className="w-25 h-25 p-2 object-cover rounded-xl shadow md:hidden"
          />
          <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm">
            {resetSent ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">
                  Check your email 📩
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  If an account exists for this email, you will receive a
                  password reset link shortly.
                </p>

                <button
                  onClick={() => setResetSent(false)}
                  className="text-orange-500 hover:underline text-sm"
                >
                  Back to login
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-center mb-2">
                  PAL<span className="text-orange-500">Robotics</span>
                </h1>
                <h2 className="text-xl font-semibold mb-2 text-center">
                  Welcome Back
                </h2>
                <p className="text-gray-500 mb-6 text-sm text-center">
                  Login to continue to your dashboard
                </p>

                <input
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-500/50 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Email address"
                />

                <input
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-500/50 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Password"
                  type="password"
                />

                <button
                  onClick={() => handleLogin(userEmail, userPassword)}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={sendingReset || resetCooldown > 0}
                  className={`text-sm flex items-center justify-center gap-2 ${
                    sendingReset || resetCooldown > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-orange-500 hover:underline"
                  }`}
                >
                  {sendingReset && (
                    <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  )}

                  {resetCooldown > 0
                    ? `Resend in ${resetCooldown}s`
                    : "Forgot password?"}
                </button>

                <p className="text-sm text-gray-600 mt-6 text-center">
                  Don’t have an account?{" "}
                  <Link
                    to="/register"
                    className="text-orange-500 hover:underline font-medium"
                  >
                    Create one
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
