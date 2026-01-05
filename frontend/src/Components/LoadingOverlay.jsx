import { motion } from "framer-motion";

export default function LoadingOverlay({ message = "Please wait..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-xl">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />

        {/* Text */}
        <p className="text-sm font-medium text-gray-700 text-center">
          {message}
        </p>
      </div>
    </motion.div>
  );
}
