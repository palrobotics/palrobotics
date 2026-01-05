import { FiUsers, FiClock, FiDollarSign } from "react-icons/fi";

export default function AdminStats({ usersCount, pendingWithdrawals }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Stat icon={<FiUsers />} label="Total Users" value={usersCount} />
      <Stat
        icon={<FiClock />}
        label="Pending Withdrawals"
        value={pendingWithdrawals}
      />
      <Stat icon={<FiDollarSign />} label="System Status" value="Operational" />
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex gap-4 items-center">
      <div className="p-3 bg-gray-100 rounded-lg text-black">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
