import { motion } from "framer-motion";
import DashboardLayout from "./DashboardLayout";
import { useEarningsSummary } from "../../Hooks/useEarningsSummary";
import { useActiveInvestments } from "../../Hooks/useActiveInvestments";
import EarningsChart from "../../Components/Earnings/EarningsChart";
import { InvestmentCard } from "../../Components/Earnings/InvestmentCard";
import { SummaryCard } from "../../Components/Earnings/SummaryCard";

export default function Earnings() {
  const { data, loading } = useEarningsSummary();
  const { investments } = useActiveInvestments();

  if (loading)
    return <DashboardLayout title="Earnings">Loading...</DashboardLayout>;

  return (
    <DashboardLayout title="Earnings">
      {/* ================= SUMMARY ================= */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2"
      >
        <SummaryCard title="Active Plans" value={data?.activePlans} />
        <SummaryCard
          title="Total Earnings"
          value={`UGX ${data?.totalEarned.toLocaleString()}`}
          highlight
        />
        <SummaryCard
          title="Today's Earnings"
          value={`UGX ${data?.todayEarned.toLocaleString()}`}
        />
        <SummaryCard
          title="Monthly Projection"
          value={`UGX ${data?.monthlyProjection.toLocaleString()}`}
        />
      </motion.div>

      <div className="flex items-center bg-gray-50 rounded-2xl gap-2 px-6 py-1 mb-2">
        <h2 className="text-xl font-semibold mb-1 text-orange-500">Note:</h2>
        <p className="text-sm text-gray-600 mb-1">
          Balances/Earnings update every after 24Hours
        </p>
      </div>

      {/* ================= ACTIVE INVESTMENTS ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="bg-white rounded-2xl shadow p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-6">Active Investment Plans</h2>

        {investments?.map((inv) => (
          <InvestmentCard key={inv.id} investment={inv} />
        ))}
      </motion.div>

      {/* ================= EARNINGS HISTORY ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="bg-gray-50 rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>

        <p className="text-sm text-gray-600 mb-6">
          A breakdown of daily earnings per active investment plan.
        </p>

        <div className="bg-gray-50 rounded-2xl p-2">
          <EarningsChart />
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
