import { useState } from "react";
import { investWithMobileMoney } from "../services/mobileMoney";

export default function InvestButton({ planId, method, phone }) {
  const [state, setState] = useState("idle");

  const handleInvest = async () => {
    try {
      setState("requesting");

      await investWithMobileMoney({
        planId,
        method,
        phone,
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
              className="text-white font-bold bg-orange-500 p-3 rounded-sm m-1"
              onClick={handleInvest}
            >
              Invest Now
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
