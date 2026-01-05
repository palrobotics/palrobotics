import DashboardLayout from "./Dashboard/DashboardLayout";
import WithdrawalsTable from "../Components/Admin/WithdrawalsTable";
import AdminStats from "../Components/Admin/AdminStats";
import { useAdminWithdrawals } from "../Hooks/useAdminWithdrawals";
import { useAdminUsers } from "../Hooks/useAdminUsers";
import UsersTable from "../Components/Admin/UsersTable";

export default function AdminDashboard() {
  const { withdrawals, loading, refresh } = useAdminWithdrawals();

  const pendingWithdrawals = withdrawals || [];

  const { users } = useAdminUsers();

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-8">
        <AdminStats
          usersCount={users.length}
          pendingWithdrawals={pendingWithdrawals?.length}
        />

        <div className="bg-white rounded-xl p-6 shadow-sm">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-4">
                Pending Withdrawals
              </h2>
              <WithdrawalsTable
                withdrawals={pendingWithdrawals}
                onActionComplete={refresh}
              />
              <h2 className="text-lg font-semibold mt-4">Users List</h2>
              <UsersTable />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
