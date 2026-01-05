import DashboardLayout from "./DashboardLayout";
import {
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { useAuth } from "../../Context/AuthContext";
import { useState } from "react";
import { copyToClipboard } from "../../utilities/copyToClipboard";
import { useWallet } from "../../Hooks/useWallet";
import { motion } from "framer-motion";
import { useEarningsSummary } from "../../Hooks/useEarningsSummary";
import { useReferralEarningsSummary } from "../../Hooks/useReferralEarningsSummary";
import { useTeamCount } from "../../Hooks/useTeamCount";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0 },
};

export default function Overview() {
  const { profile, isAuthenticated } = useAuth();
  const { wallet, loading } = useWallet();
  const { data } = useEarningsSummary();
  const { data: referralSummary } = useReferralEarningsSummary();
  const { count: teamCount } = useTeamCount();

  const level1Earnings = referralSummary?.level1 ?? 0;
  const level2Earnings = referralSummary?.level2 ?? 0;
  const level3Earnings = referralSummary?.level3 ?? 0;

  // Defaults (for logged-out users)
  const balance = isAuthenticated ? wallet?.balance ?? 0 : 0;
  const lockedBalance = isAuthenticated ? wallet?.lockedBalance ?? 0 : 0;
  const totalEarned = isAuthenticated ? wallet?.totalEarned ?? 0 : 0;

  const activeInvestments = isAuthenticated ? data?.activePlans ?? 0 : 0;
  const teamMemberCount = isAuthenticated ? teamCount ?? 0 : 0;

  const inviteCode = isAuthenticated
    ? profile?.referralCode ?? "N/A"
    : "PAL-XXXX";

  const inviteLink = isAuthenticated
    ? `${window.location.origin}/register?ref=${inviteCode}`
    : `${window.location.origin}/register`;

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (loading) {
    return (
      <DashboardLayout title="Overview">
        <p className="text-center text-gray-500">Loading wallet...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Overview">
      {/* Stats Section */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 mb-10"
      >
        <motion.div
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {[1, 2, 3].map((_, i) => (
            <motion.div key={i} variants={item} whileHover={{ scale: 1.02 }}>
              {i === 0 && (
                <div className="bg-white rounded-xl p-5 md:p-6 flex items-center gap-4 shadow-sm border border-gray-50">
                  <div className="p-3 bg-orange-100 text-orange-500 rounded-lg shrink-0 self-start sm:self-center">
                    <FiDollarSign size={24} />
                  </div>

                  <div className="flex flex-col md:flex-row md:gap-8 w-full">
                    <div className="flex flex-col mb-2 md:mb-0">
                      <p className="text-sm md:text-xs text-gray-400 ">
                        Available Balance
                      </p>
                      <p className="text-lg md:text-xl font-extrabold text-gray-900">
                        UGX {balance?.toLocaleString()}
                      </p>
                    </div>

                    <div className="hidden md:block h-10 w-px bg-gray-200 self-center"></div>

                    <div className="flex flex-col border-t border-gray-50 pt-2 md:border-0 md:pt-0">
                      <p className="text-sm md:text-xs  text-gray-400 ">
                        Locked Balance
                      </p>
                      <p className="text-lg md:text-xl font-bold text-gray-500">
                        UGX {lockedBalance?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {i === 1 && (
                <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">
                  <div className="p-3 bg-gray-200 text-black rounded-lg">
                    <FiTrendingUp size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Investments</p>
                    <p className="text-xl font-bold">{activeInvestments}</p>
                  </div>
                </div>
              )}
              {i === 2 && (
                <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm">
                  <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                    <FiUsers size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Earned</p>
                    <p className="text-xl font-bold">
                      UGX {totalEarned.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}{" "}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Invitation Section */}
      <motion.div
        variants={item}
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-xl p-6 mb-10 shadow-sm"
      >
        <h2 className="text-lg font-semibold mb-4 border-2 border-orange-500 rounded-2xl p-2 text-center">
          Invite & Earn
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Invite Code */}
          <div className="rounded-lg p-4 bg-linear-to-r from-black to-orange-500 shadow-sm">
            <p className="text-sm text-white/90 mb-1">Invitation Code</p>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-lg text-white/70">
                {inviteCode}
              </span>
              {isAuthenticated && (
                <button
                  onClick={() => copyToClipboard(inviteCode, setCopiedCode)}
                  className="flex items-center gap-1 text-sm transition
                text-white hover:text-black"
                >
                  {copiedCode ? <FiCheck /> : <FiCopy />}
                  {copiedCode ? "Copied" : "Copy"}
                </button>
              )}
            </div>
          </div>

          {/* Invite Link */}
          <div className="rounded-lg p-4 bg-linear-to-r from-black to-orange-500 shadow-sm">
            <p className="text-sm text-white/90 mb-1">Invitation Link</p>
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-sm text-white/70">
                {inviteLink}
              </span>
              {isAuthenticated && (
                <button
                  onClick={() => copyToClipboard(inviteLink, setCopiedLink)}
                  className="flex items-center gap-1 text-sm transition
                  text-white hover:text-black"
                >
                  {copiedLink ? <FiCheck /> : <FiCopy />}
                  {copiedLink ? "Copied" : "Copy"}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Team Details Section */}
      <motion.div
        variants={item}
        className="bg-gray-50 rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold mb-6">Team Details</h2>

        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Total Team Members:{" "}
            <span className="font-semibold text-black">{teamMemberCount}</span>
          </p>
        </div>

        {/* Commission Levels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border-2 border-orange-500">
            <h3 className="font-semibold mb-2 text-black bg-gray-100 rounded-sm p-1">
              Level 1
            </h3>
            <p className="text-sm text-gray-600">Commission: 30%</p>
            <p className="text-sm text-gray-600">Bonus: UGX {level1Earnings}</p>
          </div>

          <div className="bg-white rounded-lg p-4 border-2 border-orange-500">
            <h3 className="font-semibold mb-2 text-black  bg-gray-100 rounded-sm p-1">
              Level 2
            </h3>
            <p className="text-sm text-gray-600">Commission: 3%</p>
            <p className="text-sm text-gray-600">Bonus: UGX {level2Earnings}</p>
          </div>

          <div className="bg-white rounded-lg p-4 border-2 border-orange-500">
            <h3 className="font-semibold mb-2 text-black  bg-gray-100 rounded-sm p-1">
              Level 3
            </h3>
            <p className="text-sm text-gray-600">Commission: 2%</p>
            <p className="text-sm text-gray-600">Bonus: UGX {level3Earnings}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed text-justify">
          <span className="font-semibold text-black block">
            Invitation award:
          </span>{" "}
          When your invited friends invest and generate income, you will receive
          a cash bonus of <strong>30%</strong> of their first deposit. <br />
          When your Level 2 team members invest and generate income, you will
          receive a cash bonus of <strong>3%</strong> of their daily income.{" "}
          <br />
          When your Level 3 team members invest and generate income, you will
          receive a cash bonus of <strong>2%</strong> of their daily income.
          Once your team members generate income, the cash bonus is
          automatically added to your account balance.
        </p>
      </motion.div>
    </DashboardLayout>
  );
}
