import { motion } from "framer-motion";

export function SummaryCard({ title, value, highlight }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`rounded-2xl p-6 shadow-sm ${
        highlight ? "bg-black text-white" : "bg-white"
      }`}
    >
      <p className={`text-sm ${highlight ? "text-gray-300" : "text-gray-500"}`}>
        {title}
      </p>
      <p className="text-2xl text-orange-500 font-bold mt-2">{value}</p>
    </motion.div>
  );
}
