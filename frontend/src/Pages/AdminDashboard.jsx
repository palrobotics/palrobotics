import DashboardLayout from "./Dashboard/DashboardLayout";
import PendingTransactionsTable from "../Components/Admin/PendingTransactionsTable";
import AdminStats from "../Components/Admin/AdminStats";
import { useAdminWithdrawals } from "../Hooks/useAdminWithdrawals";
import { useAdminPendingManualTxs } from "../Hooks/useAdminManualTransations";
import { useAdminUsers } from "../Hooks/useAdminUsers";
import UsersTable from "../Components/Admin/UsersTable";

export default function AdminDashboard() {
  const { withdrawals, loading, refresh } = useAdminWithdrawals();
  const { transactions } = useAdminPendingManualTxs();

  const pendingWithdrawals = withdrawals || [];
  const pendingDepositsAndInvestments = transactions || [];

  const { users } = useAdminUsers();

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-8">
        <AdminStats
          usersCount={users.length}
          pendingWithdrawals={pendingWithdrawals?.length}
          pendingDepositsAndInvestments={pendingDepositsAndInvestments?.length}
        />

        <div className="bg-white rounded-xl p-6 shadow-sm">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <div>
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Pending Investments/Deposits
                </h2>
                <PendingTransactionsTable
                  pendingTransactions={pendingDepositsAndInvestments}
                  type={"deposits/investments"}
                  onActionComplete={refresh}
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Pending Withdrawals
                </h2>
                <PendingTransactionsTable
                  pendingTransactions={pendingWithdrawals}
                  type={"withdrawals"}
                  onActionComplete={refresh}
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold mt-4">Users List</h2>
                <UsersTable />
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
