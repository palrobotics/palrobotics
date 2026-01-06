import { useState } from "react";
import { investWithMobileMoney } from "../services/mobileMoney";

export default function InvestButton({
  planId,
  method,
  phone,
  transactionId,
  verifyMethod,
}) {
  const [state, setState] = useState("idle");

  const handleInvest = async () => {
    //Validation
    if (verifyMethod === "manual" && !transactionId) {
      alert("Please enter the Transaction ID to verify payment.");
      return;
    }
    if (verifyMethod === "automatic" && !phone) {
      alert("Please enter a valid Phone Number.");
      return;
    }

    try {
      setState("requesting");

      await investWithMobileMoney({
        planId,
        method,
        phone,
        transactionId,
      });

      setState("pending_confirmation");
    } catch (err) {
      setState("failed");
    }
  };

  return (
    <>
      {state === "idle" && (
        <>
          <div className="flex items-center justify-center">
            <button
              className="w-full bg-orange-500 mt-1 text-white py-3 rounded-lg"
              onClick={handleInvest}
            >
              {verifyMethod === "automatic" ? "Invest Now" : "Verify Payment"}
            </button>
          </div>
        </>
      )}

      {state === "pending_confirmation" && (
        <p className="text-center mt-2 text-sm text-green-600">
          {verifyMethod === "automatic"
            ? "📲 Check your phone to approve the payment."
            : "✅ Transaction submitted for verification."}
        </p>
      )}

      {state === "failed" && (
        <p className="text-red-500 text-center mt-2">
          Investment failed. Try again.
        </p>
      )}
    </>
  );
}
