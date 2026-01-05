import { adminApi } from "../../api/adminApi";
import { useState } from "react";

export default function ApproveModal({ tx, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleApprove() {
    try {
      setLoading(true);
      setError(null);
      await adminApi.approveWithdrawal(tx.id);

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to approve withdrawal"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Approve Withdrawal</h3>

        <p className="text-sm text-gray-600 mb-4">
          You are about to approve a withdrawal of
          <span className="font-semibold text-black">
            {" "}
            UGX {tx.netAmount?.toLocaleString()}
          </span>{" "}
          for
          <span className="font-semibold text-black ml-2">
            {tx.accountName}-{tx.phoneNumber}
          </span>
          .
        </p>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm text-gray-600 hover:text-black"
          >
            Cancel
          </button>

          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded text-sm disabled:opacity-60"
          >
            {loading ? "Approving..." : "Confirm Approval"}
          </button>
        </div>
      </div>
    </div>
  );
}
