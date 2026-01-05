import { motion } from "framer-motion";

const hoverCard = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.25 },
  },
};

export default function ActionCard({ icon, label, onClick }) {
  return (
    <motion.button
      whileHover="hover"
      variants={hoverCard}
      onClick={onClick}
      className="bg-black rounded-xl p-6 flex flex-col items-center gap-3 hover:shadow-md transition hover:bg-white hover:border hover:cursor-pointer"
      type="button"
    >
      <div className="text-orange-500">{icon}</div>
      <span className="text-white text-sm font-medium hover:text-black">
        {label}
      </span>
    </motion.button>
  );
}
