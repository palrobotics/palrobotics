import { useState } from "react";
import { depositMobileMoney } from "../services/mobileMoney";

export default function DepositModal({
  amount,
  method,
  phone,
  onClose,
  transactionId,
  verifyMethod,
}) {
  const [state, setState] = useState("idle");
  const [error, setError] = useState(null);

  const handleDeposit = async () => {
    setError(null);

    // VALIDATION START
    if (verifyMethod === "manual" && !transactionId) {
      setError("Transaction ID is required for manual verification.");
      return;
    }
    if (verifyMethod === "automatic" && !phone) {
      setError("Phone number is required.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      setState("requesting");

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 text-2xl"
        >
          &times;
        </button>

        <h3 className="text-lg font-bold mb-4">Confirm Deposit</h3>

        <div className="space-y-3">
          <p>
            <strong>Amount:</strong> UGX {Number(amount).toLocaleString()}
          </p>
          <p>
            <strong>Method:</strong> {method}
          </p>
          <p>
            <strong>Type:</strong>{" "}
            {verifyMethod === "manual" ? "Manual Verify" : "Auto-Debit"}
          </p>
        </div>

        <div className="mt-6">
          {state === "idle" && (
            <div className="flex items-center justify-center">
              <button
                className="w-full bg-orange-500 mt-1 text-white py-3 rounded-lg"
                onClick={handleDeposit}
              >
                Confirm Deposit
              </button>
            </div>
          )}

          {state === "pending_confirmation" && (
            <p className="text-center text-green-600">
              {verifyMethod === "automatic"
                ? "📲 Check your phone to approve payment"
                : "✅ Waiting for Admin approval"}
            </p>
          )}

          {(state === "failed" || error) && (
            <p className="text-red-500 text-center mt-2 text-sm">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
