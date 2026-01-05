import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div layout className="mb-4 bg-white rounded-xl shadow-md ">
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex justify-between items-center p-5 font-medium text-left"
        type="button"
        aria-expanded={open}
      >
        {question}
        <span className="text-orange-500" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="px-5 pb-5 text-gray-600"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
