import ApproveModal from "./AproveModal";
import RejectModal from "./RejectModal";
import { useState } from "react";

export default function WithdrawalsTable({
  withdrawals = [],
  onActionComplete,
}) {
  const [selectedTx, setSelectedTx] = useState(null);
  const [action, setAction] = useState(null);

  if (withdrawals.length === 0) {
    return <p className="text-sm text-gray-500">No pending withdrawals</p>;
  }

  return (
    <>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-600">
              <th className="py-3">TxID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Phone</th>
              <th>Name</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {withdrawals.map((tx) => (
              <tr key={tx.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{tx.id}</td>
                <td className="font-medium">UGX {tx.netAmount}</td>
                <td>{tx.method}</td>
                <td>{tx.phoneNumber}</td>
                <td>{tx.accountName}</td>
                <td className="text-right space-x-2">
                  <ActionButtons
                    tx={tx}
                    setSelectedTx={setSelectedTx}
                    setAction={setAction}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {withdrawals.map((tx) => (
          <div
            key={tx.id}
            className="border border-orange-500/70 rounded-xl p-4 bg-white shadow-sm space-y-3"
          >
            <Row label="TxID" value={tx.id} />
            <Row label="Amount" value={`UGX ${tx.netAmount}`} bold />
            <Row label="Method" value={tx.method} />
            <Row label="Phone" value={tx.phoneNumber} />
            <Row label="Name" value={tx.accountName} />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedTx(tx);
                  setAction("approve");
                }}
                className="flex-1 py-2 rounded-lg bg-orange-500 text-white text-sm"
              >
                Approve
              </button>

              <button
                onClick={() => {
                  setSelectedTx(tx);
                  setAction("reject");
                }}
                className="flex-1 py-2 rounded-lg bg-black text-white text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODALS ================= */}
      {action === "approve" && selectedTx && (
        <ApproveModal
          tx={selectedTx}
          onClose={() => setAction(null)}
          onSuccess={onActionComplete}
        />
      )}

      {action === "reject" && selectedTx && (
        <RejectModal
          tx={selectedTx}
          onClose={() => setAction(null)}
          onSuccess={onActionComplete}
        />
      )}
    </>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={bold ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}

function ActionButtons({ tx, setSelectedTx, setAction }) {
  return (
    <>
      <button
        onClick={() => {
          setSelectedTx(tx);
          setAction("approve");
        }}
        className="px-3 py-1 rounded bg-orange-500 text-white text-xs hover:bg-orange-700"
      >
        Approve
      </button>

      <button
        onClick={() => {
          setSelectedTx(tx);
          setAction("reject");
        }}
        className="px-3 py-1 rounded bg-black text-white text-xs hover:bg-black/80"
      >
        Reject
      </button>
    </>
  );
}
