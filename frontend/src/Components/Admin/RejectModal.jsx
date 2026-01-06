import { useState } from "react";
import { adminApi } from "../../api/adminApi";
import { useQueryClient } from "@tanstack/react-query";

export default function RejectModal({ tx, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function handleReject() {
    if (!reason) return alert("Enter rejection reason");

    setLoading(true);
    if (tx.type === "withdraw") {
      await adminApi.rejectWithdrawal(tx.id, reason);
      queryClient.invalidateQueries({
        queryKey: ["admin-withdrawals"],
      });
    } else if (tx.type === "invest" || tx.type === "deposit") {
      await adminApi.rejectManualTransaction(tx.id, reason);
      queryClient.invalidateQueries({
        queryKey: ["admin", "deposits", "manual", "pending"],
      });
    }

    setLoading(false);
    onSuccess();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Reject Withdrawal</h3>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for rejection"
          className="w-full border rounded p-2 text-sm mb-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm"
          >
            {loading ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}
