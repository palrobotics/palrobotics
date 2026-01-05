import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiDownload,
  FiUpload,
  FiHelpCircle,
  FiCheckCircle,
  FiShield,
  FiCpu,
  FiEye,
  FiTrendingUp,
  FiUsers,
  FiAlertTriangle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ActionCard from "../Components/HomeComponents/ActionCard";
import TabButton from "../Components/HomeComponents/TabButton";
import FAQItem from "../Components/HomeComponents/FAQItem";
import TrustCard from "../Components/HomeComponents/TrustCard";
import StatCard from "../Components/HomeComponents/StatCard";
import { useAuth } from "../Context/AuthContext";
import HelpModal from "../Components/HelpModal";
import { useWallet } from "../Hooks/useWallet";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const trustContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const trustItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("account");
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const isLoggedIn = !!user;
  const [showHelp, setShowHelp] = useState(false);
  const { wallet } = useWallet();

  return (
    <div className="bg-white text-black">
      {/* ================= HERO ================= */}
      <img
        src="/images/rob3.webp"
        alt="Robotics investment"
        className="w-screen shadow md:hidden"
        loading="lazy"
      />
      <section className="relative bg-gray-100 md:h-screen px-6 sm:px-10 py-5 md:py-20 md:bg-[url('/images/rob3.webp')] md:bg-cover md:bg-center overflow-hidden">
        {/* Background overlay */}
        <div className="hidden md:block absolute inset-0 bg-black/60 z-0"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center h-full">
          {/* LEFT CONTENT */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="animate-fadeInUp"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight text-center md:text-left text-black md:text-white">
              The Next Evolution of Wealth is <br />
              <span className="text-orange-500">Human-Free</span>
            </h1>

            <p className="text-gray-600 md:text-gray-300 mb-8 max-w-xl text-center md:text-left">
              The world is automating. Don’t just watch it happen, profit from
              the machines that are building tomorrow. Secure your portfolio
              with{" "}
              <span className="text-xl font-[Space Grotesk]">
                PALRobotics Investment
              </span>
              .
            </p>

            <div className="flex justify-center md:justify-start">
              <button
                onClick={() =>
                  navigate(isLoggedIn ? "/dashboard" : "/register")
                }
                className="bg-black md:bg-orange-500 text-white md:text-black px-8 py-4 rounded-lg hover:bg-black/70 hover:cursor-pointer md:hover:bg-orange-600 transition transform hover:scale-105"
              >
                {isLoggedIn ? "Go to Dashboard" : "Get Started"}
              </button>
            </div>
          </motion.div>

          {/* RIGHT AUTO-SCROLL IMAGE CAROUSEL */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative overflow-hidden"
          >
            <div className="flex gap-6 animate-scrollXSmallScreen md:animate-scrollXBigScreen">
              {[
                "/images/rob2.jpg",
                "/images/illustration2.jpg",
                "/images/illustration.jpg",
              ].map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Robotics"
                  className="min-w-65 sm:min-w-75 h-50 sm:h-60 object-cover rounded-2xl shadow-lg"
                  loading="lazy"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="py-5 md:py-10 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-8 text-center">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <ActionCard
              icon={<FiDownload size={24} />}
              label="Deposit"
              onClick={() =>
                navigate(
                  isLoggedIn
                    ? "/dashboard/invest"
                    : alert(
                        "Please Login or register an account to get started"
                      )
                )
              }
            />

            <ActionCard
              icon={<FiUpload size={24} />}
              label="Withdraw"
              onClick={() =>
                navigate(
                  isLoggedIn
                    ? "/dashboard/withdraw"
                    : alert(
                        "Please Login or register an account to get started"
                      )
                )
              }
            />
            <ActionCard
              icon={<FiHelpCircle size={24} />}
              label="Help"
              onClick={() => setShowHelp(true)}
            />
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
            <ActionCard
              icon={<FiCheckCircle size={24} />}
              label="Check-in"
              onClick={() => alert("Daily check-in coming soon")}
            />
          </div>
        </div>
      </section>

      {/* ================= BALANCE TABS ================= */}
      <section className="bg-gray-50 py-5 md:py-10 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <TabButton
              active={activeTab === "account"}
              onClick={() => setActiveTab("account")}
              label="Account Balance"
            />
            <TabButton
              active={activeTab === "total"}
              onClick={() => setActiveTab("total")}
              label="Total Balance"
            />
          </div>

          <div className="bg-white rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {activeTab === "account" ? (
                  <>
                    <h3 className="text-xl font-semibold mb-3">
                      Account Balance
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Funds available for withdrawal and reinvestment.
                    </p>
                    <p className="text-3xl font-bold">
                      UGX{" "}
                      <span className="text-orange-500">
                        {isLoggedIn
                          ? wallet?.balance.toLocaleString() ?? 0
                          : "0.0"}
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-3">
                      Total Balance
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Total value including active investments, earnings and
                      locked funds.
                    </p>
                    <p className="text-3xl font-bold">
                      UGX{" "}
                      <span className="text-orange-500">
                        {isLoggedIn
                          ? Number(
                              wallet?.balance + wallet.lockedBalance
                            ).toLocaleString() ?? 0
                          : "0.0"}
                      </span>
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <img
              src={
                activeTab === "account"
                  ? "/images/rob5.jpg"
                  : "/images/rob3.webp"
              }
              alt="Balance illustration"
              className="hidden md:block h-65 w-full rounded-2xl shadow-md max-w-sm"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ================= TRUST SIGNALS ================= */}
      <section className="py-10 px-6 sm:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={trustContainer}
            className="text-center mb-14"
          >
            <motion.h2 variants={trustItem} className="text-3xl font-bold mb-4">
              Why Investors Trust{" "}
              <span className="text-orange-500">PAL Robotics</span>
            </motion.h2>

            <motion.p
              variants={trustItem}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              We focus on transparency, technology, and consistency to ensure a
              reliable investment experience for all users.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={trustContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <TrustCard
              icon={<FiEye size={26} />}
              title="Full Transparency"
              points={[
                "Fixed investment plans",
                "Clear earnings tracking",
                "No hidden fees",
              ]}
            />

            <TrustCard
              icon={<FiCpu size={26} />}
              title="Robotics Technology"
              points={[
                "Automated income systems",
                "Deployed in real environments",
                "Performance-driven operations",
              ]}
            />

            <TrustCard
              icon={<FiShield size={26} />}
              title="Security & Protection"
              points={[
                "Firebase authentication",
                "Encrypted user data",
                "Secure wallet handling",
              ]}
            />

            <TrustCard
              icon={<FiTrendingUp size={26} />}
              title="Consistent Returns"
              points={[
                "Daily income calculation",
                "Automated payouts",
                "Stable earning structure",
              ]}
            />
          </motion.div>
        </div>
      </section>

      {/* ================= STATS + RISK DISCLAIMER ================= */}
      <section className="pb-1 px-6 bg-gray-50">
        <h2 className="text-center text-xl font-bold p-2">STATS</h2>
        <div className="max-w-6xl mx-auto">
          {/* ===== STATS ===== */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16"
          >
            <StatCard
              icon={<FiUsers size={28} />}
              label="Active Investors"
              value={1248}
              suffix="+"
            />

            <StatCard
              icon={<FiCpu size={28} />}
              label="Robots Deployed"
              value={86}
              suffix=""
            />

            <StatCard
              icon={<FiCpu size={28} />}
              label="Daily Transactions"
              value={3420}
              suffix="+"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= LOCATION ================= */}
      <section className="py-10 px-6 sm:px-10 text-justify md:text-center">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <img
            src="/images/location.jpg"
            alt="Company location"
            className="w-full rounded-2xl shadow"
            loading="lazy"
          />
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Global Robotics Operations
            </h2>
            <p className="text-gray-600 leading-relaxed ">
              PAL Robotics operates across multiple regions, deploying automated
              systems in logistics, services, and industrial environments to
              ensure consistent revenue generation for investors.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 px-6 sm:px-10 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center">
            Frequently Asked Questions
          </h2>

          <FAQItem
            question="How does PAL Robotics generate returns?"
            answer="Returns are generated through automated robotic systems deployed in commercial and industrial operations that generate consistent daily income."
          />
          <FAQItem
            question="Is my investment guaranteed?"
            answer="All investments carry risk. However, PAL Robotics uses fixed plans with structured income models to reduce volatility."
          />
          <FAQItem
            question="How often can I withdraw earnings?"
            answer="Withdrawals are available based on your selected investment plan and wallet balance."
          />
          <FAQItem
            question="Is my data secure?"
            answer="Yes. We use industry-standard security practices and Firebase-backed authentication to protect user data."
          />
        </div>
        {/* ===== RISK DISCLAIMER ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white border-l-4 border-orange-500 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="text-orange-500 mt-1">
              <FiAlertTriangle size={22} />
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                Investment Risk Disclosure
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                Investing involves risk, and returns are not guaranteed. PAL
                Robotics provides fixed investment plans based on automated
                robotic operations; however, market conditions, operational
                performance, and external factors may impact earnings. Users are
                advised to invest responsibly and only with funds they can
                afford to commit.
              </p>

              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                PAL Robotics does not provide financial advice. Past performance
                does not guarantee future results.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-black text-white pt-10 pb-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Start Building Passive Income Today
        </h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          Join thousands of users earning from robotics-powered investments.
        </p>
        <button
          onClick={() => navigate(isLoggedIn ? "/dashboard" : "/register")}
          className="bg-orange-500 text-black px-10 py-4 rounded-lg hover:bg-orange-600 transition"
        >
          {isLoggedIn ? "Go to Dashboard" : "Create Free Account"}
        </button>
      </section>
    </div>
  );
}
