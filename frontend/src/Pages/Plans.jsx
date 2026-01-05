import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePlans } from "../Hooks/usePlans";

export default function Plans() {
  const navigate = useNavigate();
  const { plans, loading } = usePlans();

  return (
    <section className="md:pt-20 bg-white pb-20">
      <img
        src="/images/levelup.jpg"
        className="flex md:hidden pb-5 w-screen h-60 rounded-b-lg"
        alt=""
        loading="lazy"
      />
      {/* ================= INTRO ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-3xl px-6 mx-auto text-center mb-14"
      >
        <h2 className="text-3xl font-bold mb-4 text-black">Investment Plans</h2>
        <div className="hidden md:flex items-center justify-center">
          <img
            src="/images/levelup.jpg"
            className="rounded-2xl w-50 h-50"
            alt=""
          />
        </div>
        <p className="text-gray-600 leading-relaxed">
          Choose from a range of robotics-powered investment plans designed to
          generate consistent daily income. Each plan runs for a fixed number of
          days, during which your selected robot earns revenue daily. At the end
          of the cycle, you receive your total earnings based on the plan’s
          duration and daily returns.
        </p>
      </motion.div>

      {/* ================= PLANS GRID ================= */}
      {loading ? (
        <p className="text-center">Loading plans...</p>
      ) : (
        <motion.div
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 px-6 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {plans.map((p) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
              className="flex flex-col gap-2 rounded-xl p-4 shadow-sm hover:shadow-xl transition bg-linear-to-tr from-black to-white"
            >
              <h3 className="text-2xl font-semibold text-black text-center bg-white/70 p-2 rounded-md">
                {p.name}
              </h3>
              <img
                src={p.image}
                alt={`${p.name}`}
                className="h-50 lg:h-70 w-full rounded-lg"
                loading="lazy"
              />

              <div className="grid grid-cols-2 gap-2 text-sm justify-center items-center">
                <p className="text-white/90">
                  Price (UGX)
                  <span className="block font-extrabold text-white text-lg">
                    {p.price.toLocaleString()}
                  </span>
                </p>

                <p className="text-white/90">
                  Duration (Days)
                  <span className="block font-extrabold text-white text-lg">
                    {p.durationDays}
                  </span>
                </p>

                <p className="text-white/90">
                  Daily Income (UGX)
                  <span className="block font-extrabold text-white text-lg">
                    {p.dailyIncome.toLocaleString()}
                  </span>
                </p>

                <p className="text-white/90">
                  Total Revenue (UGX)
                  <span className="block font-extrabold text-white text-lg">
                    {(
                      p.durationDays * p.dailyIncome +
                      p.price
                    ).toLocaleString()}
                  </span>
                </p>
              </div>

              {/* ================= INVEST BUTTON ================= */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ opacity: 0.85 }}
                onClick={() =>
                  navigate("/dashboard/invest", {
                    state: { plan: p },
                  })
                }
                className="mt-5 font-bold bg-orange-500 text-white px-4 py-3 rounded-lg w-full transition"
              >
                Invest Now
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
