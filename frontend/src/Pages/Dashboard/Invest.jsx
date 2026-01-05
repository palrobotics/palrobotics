import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

import DashboardLayout from "./DashboardLayout";
import { useWallet } from "../../Hooks/useWallet";
import { investFromWallet } from "../../services/wallet.api";
import TransactionList from "../../Components/TransactionsList";
import { useTransactions } from "../../Hooks/useTransactions";
import DepositModal from "../../Components/DepositModal";
import InvestButton from "../../Components/InvestButton";

export default function Invest() {
  const location = useLocation();
  const plan = location.state?.plan;
  const storedPlan = JSON.parse(sessionStorage.getItem("selectedPlan"));
  const finalPlan = plan || storedPlan;

  const [phone, setPhone] = useState("");
  const [fundingSource, setFundingSource] = useState("wallet"); // wallet | mobile
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [investing, setInvesting] = useState(false);
  const [mode, setMode] = useState("invest");
  const [paymentMethod, setPaymentMethod] = useState("MTN");
  const [depositAmount, setDepositAmount] = useState("");
  const { wallet } = useWallet();
  const {
    transactions: depositTxs,
    loading: depositLoading,
    refetch: refetchDeposits,
  } = useTransactions("deposit");

  const {
    transactions: investmentTxs,
    loading: investmentLoading,
    refetch: refetchInvestments,
  } = useTransactions("investment");

  useEffect(() => {
    if (plan) {
      sessionStorage.setItem("selectedPlan", JSON.stringify(plan));
    }
  }, [plan]);

  const selectedPlan = {
    id: finalPlan?.id,
    name: finalPlan?.name,
    price: Number(finalPlan?.price),
    duration: finalPlan?.durationDays,
    dailyIncome: finalPlan?.dailyIncome,
    image: finalPlan?.image,
  };

  const totalRevenue =
    selectedPlan.price + selectedPlan.duration * selectedPlan.dailyIncome;

  async function handleWalletInvest() {
    try {
      setInvesting(true);
      await investFromWallet({ planId: selectedPlan.id });
      alert("Investment successful");
    } catch (err) {
      alert(err.response?.data?.message || "Investment failed");
    } finally {
      setInvesting(false);
    }
  }

  return (
    <DashboardLayout title="New Investment">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl"
      >
        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-md"
        >
          <h3 className="text-xl font-semibold mb-4">Transaction Details</h3>

          {/* MODE */}
          <label className="text-sm font-medium">
            Action(Deposit or Invest)
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full p-3 border border-orange-500/70 rounded-lg mb-4"
          >
            <option value="invest">Invest</option>
            <option value="deposit">Deposit Only</option>
          </select>

          {mode === "invest" && (
            <>
              <label className="text-sm font-medium">Funding Source</label>
              <select
                value={fundingSource}
                onChange={(e) => setFundingSource(e.target.value)}
                className="w-full p-3 border border-orange-500/70 rounded-lg mb-4"
              >
                <option value="wallet">
                  Wallet (Balance: UGX {wallet?.balance.toLocaleString()})
                </option>
                <option value="mobile">Mobile Money</option>
              </select>
            </>
          )}

          {(fundingSource === "mobile" || mode === "deposit") && (
            <>
              <label className="text-sm font-medium">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 border border-orange-500/70 rounded-lg mb-4"
              >
                <option value="MTN">MTN Mobile Money</option>
                <option value="Airtel">Airtel Money</option>
              </select>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="256 7XXX XXXXX"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 12))
                }
                className="w-full p-3 border-2 border-orange-500/50 rounded-lg"
              />
            </>
          )}

          {mode === "invest" ? (
            <>
              <label className="block text-sm font-medium mb-1">
                Amount (UGX)
              </label>
              <input
                value={selectedPlan.price || ""}
                disabled
                className="w-full p-3 border-2 border-orange-500/50 rounded-lg mb-4 bg-gray-100 cursor-not-allowed"
              />
            </>
          ) : (
            <>
              <label className="block text-sm font-medium mb-1">
                Amount (UGX)
              </label>
              <input
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full p-3 border-2 border-orange-500/50 rounded-lg mb-4 bg-gray-100 cursor-not-allowed"
                placeholder="Enter Deposit Amount"
              />
            </>
          )}

          {/* PAYMENT LOGO */}
          <motion.div
            key={paymentMethod}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center mb-6"
          >
            <img
              src={
                paymentMethod === "MTN"
                  ? "/images/mtn.png"
                  : "/images/airtel.png"
              }
              alt="Payment Provider"
              className="h-12 object-contain rounded-md"
            />
          </motion.div>

          {mode === "invest" && fundingSource === "wallet" && (
            <button
              disabled={investing}
              onClick={handleWalletInvest}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              {investing ? "Investing..." : "Invest from Wallet"}
            </button>
          )}

          {mode === "invest" && fundingSource === "mobile" && (
            <InvestButton
              method={paymentMethod}
              phone={phone}
              planId={selectedPlan.id}
            />
          )}

          {mode === "deposit" && (
            <button
              onClick={() => setShowDepositModal(true)}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              Deposit Funds
            </button>
          )}
          {showDepositModal && (
            <DepositModal
              amount={depositAmount}
              phone={phone}
              method={paymentMethod}
              onClose={() => setShowDepositModal(false)}
            />
          )}
        </motion.div>

        {/* RIGHT PANEL */}
        {finalPlan ? (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-2xl p-6 shadow-md"
          >
            <h3 className="text-xl font-semibold mb-4">
              Selected Investment Plan
            </h3>

            <img
              src={selectedPlan.image}
              alt={selectedPlan.name}
              className="w-full h-48 rounded-xl mb-4"
            />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-semibold">{selectedPlan.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-semibold">
                  {selectedPlan.duration} Days
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Daily Income</span>
                <span className="font-semibold">
                  UGX {selectedPlan.dailyIncome}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Investment Amount</span>
                <span className="font-semibold">UGX {selectedPlan.price}</span>
              </div>

              <div className="flex justify-between pt-3 border-t">
                <span className="font-semibold">Total Revenue</span>
                <span className="font-bold text-orange-500">
                  UGX {totalRevenue}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div>
            <p className="text-red-500 text-center">
              No Investment Plan Selected
            </p>
          </div>
        )}
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <TransactionList
          title="Deposit History"
          transactions={depositTxs}
          loading={depositLoading}
        />

        <TransactionList
          title="Investment History"
          transactions={investmentTxs}
          loading={investmentLoading}
        />
      </div>
    </DashboardLayout>
  );
}
