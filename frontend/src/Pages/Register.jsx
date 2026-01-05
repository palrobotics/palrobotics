import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../Firebase";
import { generateReferralCode } from "../utilities/utilities";
import toast from "react-hot-toast";
import { createUserProfileAndWallet } from "../services/user.service";
import LoadingOverlay from "../Components/LoadingOverlay";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+256");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const [referredBy, setReferredBy] = useState("");
  const [referralLocked, setReferralLocked] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  useEffect(() => {
    const refFromUrl = searchParams.get("ref");

    if (refFromUrl) {
      setReferredBy(refFromUrl.toUpperCase());
      setReferralLocked(true); // auto-filled from link
    }
  }, [searchParams]);

  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    if (!password) return "";

    if (password.length < 8) return "weak";

    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

    if (strongRegex.test(password)) return "strong";

    return "medium";
  };

  const handleRegister = async () => {
    if (!email || !password || !phone || !fullName) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsRegistering(true);

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCred.user;
      const token = await user.getIdToken();

      // Generate THIS new user's unique code
      const myNewCode = generateReferralCode(user.uid);

      const potentialInviter = referredBy
        ? referredBy.trim().toUpperCase()
        : null;

      //Save data
      await createUserProfileAndWallet(
        {
          uid: user.uid,
          fullName,
          email,
          countryCode,
          phone,
          referralCode: myNewCode,
          referredBy: potentialInviter,
        },
        token
      );

      await sendEmailVerification(user);
      navigate("/verifyEmail");
    } catch (error) {
      console.error(error);

      toast.error("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <>
      {isRegistering && <LoadingOverlay message="Creating your account..." />}

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
        <div className="flex flex-col items-center justify-center px-6 sm:px-10">
          <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm">
            {/* Branding */}
            <h1 className="text-2xl font-bold text-center mb-2">
              PAL<span className="text-orange-500">Robotics</span>
            </h1>
            <p className="text-gray-500 text-center text-sm mb-6">
              Create your investment account
            </p>

            {/* Inputs */}
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-orange-500/50 rounded-lg mb-4"
              placeholder="Full Name"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-orange-500/50 rounded-lg mb-4"
              placeholder="Email address"
            />

            {/* Phone number with country code */}
            <div className="flex gap-3 mb-4">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-3 py-3 border-2 border-orange-500/50 rounded-lg bg-white"
              >
                <option>+1</option>
                <option>+44</option>
                <option>+254</option>
                <option>+255</option>
                <option>+256</option>
                <option>+250</option>
              </select>

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))
                }
                className="flex-1 w-50 px-4 py-3 border-2 border-orange-500/50 rounded-lg"
                placeholder="7XXX XXXXX"
              />
            </div>

            <input
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                setPasswordStrength(getPasswordStrength(value));
              }}
              type="password"
              className="w-full px-4 py-3 border-2 border-orange-500/50 rounded-lg mb-2"
              placeholder="Password"
            />

            {passwordStrength && (
              <p
                className={`text-sm mb-2 ${
                  passwordStrength === "weak"
                    ? "text-red-500"
                    : passwordStrength === "medium"
                    ? "text-yellow-500"
                    : "text-green-600"
                }`}
              >
                {passwordStrength === "weak" && "Weak password"}
                {passwordStrength === "medium" &&
                  "Medium strength (add uppercase, number & symbol)"}
                {passwordStrength === "strong" && "Strong password"}
              </p>
            )}

            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-3 border-2 border-orange-500/50 rounded-lg mb-4"
              placeholder="Confirm Password"
            />

            {confirmPassword.length > 0 && (
              <p
                className={`text-sm mb-2 ${
                  passwordsMatch ? "text-green-600" : "text-red-500"
                }`}
              >
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}

            {/* Referral Code */}
            <div className="mb-6">
              <label className="text-sm text-gray-600 block mb-1">
                Referral Code (optional)
              </label>

              <div className="flex gap-2">
                <input
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value.toUpperCase())}
                  disabled={referralLocked}
                  placeholder="Enter referral code"
                  className={`flex-1 px-4 py-3 border-2 rounded-lg
        ${
          referralLocked
            ? "bg-gray-100 border-gray-300 text-gray-500"
            : "border-orange-500/50 focus:ring-1 focus:ring-orange-500/70"
        }`}
                />

                {referralLocked && (
                  <button
                    type="button"
                    onClick={() => setReferralLocked(false)}
                    className="px-3 text-xs bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Edit
                  </button>
                )}
              </div>

              {referralLocked && (
                <p className="text-xs text-gray-500 mt-1">
                  Referral detected from invitation link
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleRegister}
              disabled={
                isRegistering ||
                passwordStrength !== "strong" ||
                password !== confirmPassword
              }
              className={`w-full py-3 rounded-lg transition
    ${
      !isRegistering &&
      passwordStrength === "strong" &&
      password === confirmPassword
        ? "bg-black text-white hover:bg-gray-800"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
            >
              {isRegistering ? "Creating Account..." : "Create Account"}
            </button>

            {/* Footer link */}
            <p className="text-sm text-gray-600 mt-6 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-500 hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
