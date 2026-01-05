import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "./DashboardLayout";
import { FiClock, FiPercent, FiAlertCircle, FiPhone } from "react-icons/fi";
import { useWallet } from "../../Hooks/useWallet";
import { useTransactions } from "../../Hooks/useTransactions";
import { requestWithdrawal } from "../../services/withdraw.api";
import TransactionList from "../../Components/TransactionsList";

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("MTN");
  const [accountName, setAccountName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { wallet } = useWallet();
  const [loading, setLoading] = useState(false);

  const MIN_WITHDRAW = 7000;
  const FEE_PERCENT = 0.1;

  const numericAmount = Number(amount) || 0;
  const fee = numericAmount * FEE_PERCENT;
  const netAmount = numericAmount - fee;

  const isValid = numericAmount >= MIN_WITHDRAW;
  const {
    transactions: withdrawTxs,
    loading: txLoading,
    refetch: refetchWithdraws,
  } = useTransactions("withdraw");

  async function handleWithdraw() {
    setLoading(true);

    try {
      await requestWithdrawal({
        amount: numericAmount,
        netAmount,
        method,
        phoneNumber,
        accountName,
      });

      alert("Withdrawal request submitted successfully");
      refetchWithdraws();
      setAmount("");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const rejectedTx = withdrawTxs.find((tx) => tx.status === "rejected");

    if (!rejectedTx) return;

    const lastAlertedId = localStorage.getItem("lastRejectedWithdrawal");

    if (lastAlertedId === rejectedTx.id) return;

    alert(
      `Your withdrawal was rejected.\n\nReason:\n${rejectedTx.rejectionReason}`
    );

    localStorage.setItem("lastRejectedWithdrawal", rejectedTx.id);
  }, [withdrawTxs]);

  return (
    <DashboardLayout title="Withdraw Funds">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-3"
      >
        {/* ================= WITHDRAW FORM ================= */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow p-8"
        >
          <h2 className="text-xl font-semibold mb-6">Withdrawal Request</h2>

          {/* Available balance */}
          <div className="mb-6 p-4 rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-2xl font-bold">
              UGX {wallet?.balance?.toLocaleString() ?? 0}
            </p>
          </div>

          {/* Amount */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">
              Withdrawal Amount (UGX)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 border-2 border-orange-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {!isValid && amount && (
              <p className="text-xs text-red-500 mt-1">
                Minimum withdrawal is UGX {MIN_WITHDRAW.toLocaleString()}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">
              Payment Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full p-3 border-2 border-orange-500/50 rounded-lg"
            >
              <option value="MTN">MTN Mobile Money</option>
              <option value="Airtel">Airtel Money</option>
            </select>
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="07X XXXX XXX"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className="w-full p-3 border-2 border-orange-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <label className="block text-sm font-medium mb-2">
              Mobile Money Name
            </label>
            <input
              type="text"
              placeholder="Registered Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full p-3 border-2 border-orange-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Destination Number */}
          <div className="mb-5 p-4 rounded-xl bg-gray-50 flex items-center gap-3">
            <FiPhone className="text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Withdraw To</p>
              <p className="font-semibold">
                {method === "MTN"
                  ? `MTN: ${phoneNumber}`
                  : `Airtel: ${phoneNumber}`}{" "}
                <br />
                {accountName}
              </p>
            </div>
          </div>

          {/* Fee Summary */}
          {numericAmount > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-gray-50 text-sm space-y-2">
              <div className="flex justify-between">
                <span>Withdrawal Fee (10%)</span>
                <span>- UGX {fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Net Amount</span>
                <span>UGX {netAmount.toLocaleString()}</span>
              </div>
            </div>
          )}

          <button
            disabled={!isValid || loading}
            onClick={handleWithdraw}
            className={`w-full py-3 rounded-lg transition ${
              isValid
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : "Request Withdrawal"}
          </button>
        </motion.div>

        {/* ================= WITHDRAW RULES ================= */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gray-50 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-6">Withdrawal Rules</h3>

          <ul className="space-y-4 text-gray-700">
            <Rule icon={<FiClock />} label="Withdrawal Time" value="24 / 7" />
            <Rule
              icon={<FiClock />}
              label="Arrival Time"
              value="3 minutes – 12 hours"
            />
            <Rule icon={<FiPercent />} label="Withdrawal Fee" value="10%" />
            <Rule
              icon={<FiAlertCircle />}
              label="Minimum Withdrawal"
              value="UGX 7,000"
            />
            <Rule
              icon={<FiAlertCircle />}
              label="Maximum Withdrawal"
              value="Unlimited"
            />
            <Rule
              icon={<FiAlertCircle />}
              label="Frequency"
              value="Once per day"
            />
          </ul>

          <p className="mt-8 text-sm text-gray-600 leading-relaxed">
            Withdrawals are processed automatically. In rare cases of
            verification or mobile network delays, processing may take longer
            than usual.
          </p>
        </motion.div>
        {/* ================= WITHDRAW HISTORY ================= */}
        <div className="mb-2">
          <TransactionList
            title="Withdrawal History"
            transactions={withdrawTxs}
            loading={txLoading}
          />
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

/* ================= SMALL COMPONENT ================= */

function Rule({ icon, label, value }) {
  return (
    <li className="flex items-center gap-3">
      <span className="text-orange-500">{icon}</span>
      <span>
        <strong>{label}:</strong> {value}
      </span>
    </li>
  );
}
