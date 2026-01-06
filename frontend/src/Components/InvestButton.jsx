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
              {verifyMethod === "automatic" ? "Invest Now" : "Verify"}
            </button>
          </div>
        </>
      )}

      {state === "pending_confirmation" && (
        <p>📲 Approve payment to activate investment</p>
      )}

      {state === "failed" && <p>Investment failed. Try again.</p>}
    </>
  );
}
