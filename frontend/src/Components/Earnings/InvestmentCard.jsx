import { motion } from "framer-motion";

export function InvestmentCard({ investment }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="border border-orange-500/70 rounded-xl p-5 bg-orange-500/1 shadow-sm mb-2"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">{investment.planName} Plan</h3>
        <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700">
          Active
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <Info label="Invested" value={`UGX ${investment.amount}`} />
        <Info label="Daily Income" value={`UGX ${investment.dailyIncome}`} />
        <Info
          label="Earned"
          value={`UGX ${
            investment.dailyIncome *
            (investment.durationDays - investment.daysLeft)
          }`}
        />
        <Info label="Days Left" value={`${investment.daysLeft} days`} />
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1 text-gray-500">
          <span>Progress</span>
          <span>{investment.progress.toFixed(4)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500"
            style={{ width: `${investment.progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
