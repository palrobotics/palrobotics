import { useState } from "react";
import { depositMobileMoney } from "../services/mobileMoney";

export default function DepositModal({
  amount,
  method,
  phone,
  onClose,
  transactionId,
}) {
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
        transactionId,
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
            className="w-full bg-orange-500 mt-1 text-white py-3 rounded-lg"
            onClick={handleDeposit}
          >
            Confirm
          </button>
        </div>
      )}

      {state === "pending_confirmation" && (
        <p>
          {transactionId === ""
            ? "Check your phone to approve payment"
            : "Waiting for Admin approval"}
        </p>
      )}

      {state === "failed" && <p className="error">{error}</p>}
    </>
  );
}
