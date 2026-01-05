import { motion } from "framer-motion";

const trustItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function TrustCard({ icon, title, points = [] }) {
  return (
    <motion.div
      variants={trustItem}
      whileHover={{ y: -6 }}
      className="bg-gray-50 rounded-2xl p-6 shadow-md hover:shadow-md transition"
    >
      <div className="text-orange-500 mb-4 flex justify-center items-center">
        {icon}
      </div>

      <h3 className="font-semibold text-lg mb-3 text-center">{title}</h3>

      <div className="flex justify-center items-center">
        <ul className="text-sm text-gray-600 space-y-2">
          {points.map((point, index) => (
            <li key={index}>• {point}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
