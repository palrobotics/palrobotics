import { useState } from "react";
import { depositMobileMoney } from "../services/mobileMoney";

export default function DepositModal({ amount, method, phone, onClose }) {
  const [state, setState] = useState("idle");
  const [error, setError] = useState(null);

  const handleDeposit = async () => {
    try {
      setState("requesting");
      setError(null);

      await depositMobileMoney({
        amount: Number(amount),
        method,
        phone,
      });

      // Backend accepted request, waiting for provider
      setState("pending_confirmation");
    } catch (err) {
      setError(err.response?.data?.message || "Deposit failed");
      setState("failed");
    }
  };

  return (
    <>
      {state === "idle" && (
        <div className="flex items-center justify-center">
          <button
            className="text-white font-bold bg-orange-500 p-3 rounded-sm m-1"
            onClick={handleDeposit}
          >
            Confirm
          </button>
        </div>
      )}

      {state === "pending_confirmation" && (
        <p>Check your phone to approve payment</p>
      )}

      {state === "failed" && <p className="error">{error}</p>}
    </>
  );
}
