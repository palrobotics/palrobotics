export default function TransactionList({ title, transactions, loading }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-sm text-gray-500">No records found</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="flex flex-col  bg-gray-50 rounded-lg text-sm"
            >
              <span className="flex justify-between items-center p-3">
                <span>
                  <p className="font-medium">UGX {tx.amount || tx.netAmount}</p>
                  <p className="text-gray-500 flex items-center gap-2">
                    <span className="capitalize">{tx.type}</span>
                    <span>•</span>
                    <span
                      className={`font-medium ${
                        tx.status === "pending"
                          ? "text-orange-500"
                          : tx.status === "approved" ||
                            tx.status === "completed"
                          ? "text-green-600"
                          : tx.status === "rejected"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </p>
                </span>
                <span className="text-xs text-gray-400 text-right">
                  {tx.createdAt ? (
                    <>
                      <div>{new Date(tx.createdAt).toLocaleDateString()}</div>
                      <div className="text-[10px] opacity-90">
                        {new Date(tx.createdAt).toLocaleTimeString()}
                      </div>
                    </>
                  ) : (
                    "—"
                  )}
                </span>
              </span>
              {tx.status === "rejected" && tx.rejectionReason && (
                <p className="text-xs text-red-600 px-3 pb-1 rounded">
                  <strong>Reason:</strong> {tx.rejectionReason}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
