import { useAdminUsers } from "../../Hooks/useAdminUsers";

export default function UsersTable() {
  const { users, loading, blockUser, unblockUser, actionLoading } =
    useAdminUsers();

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="space-y-3">
      {users.map((u) => (
        <div
          key={u.uid}
          className="flex items-center justify-between p-4 border border-orange-500/70 rounded-lg"
        >
          <div>
            <p className="font-medium">{u.name || "Unnamed user"}</p>
            <p className="text-sm text-gray-500">{u.email}</p>
            <p className="text-xs text-gray-400">Role: {u.role || "user"}</p>
            <p
              className={`text-xs ${
                u.blocked ? "text-red-600" : "text-green-600"
              }`}
            >
              {u.blocked ? "Blocked" : "Active"}
            </p>
          </div>
          {/* Blocking Users UI 
          <div className="flex gap-2">
            {u.blocked ? (
              <button
                disabled={actionLoading === u.uid}
                onClick={() => unblockUser(u.uid)}
                className="px-3 py-1 text-xs rounded bg-green-600 text-white disabled:opacity-50"
              >
                {actionLoading === u.uid ? "Unblocking..." : "Unblock"}
              </button>
            ) : (
              <button
                disabled={actionLoading === u.uid}
                onClick={() => blockUser(u.uid)}
                className="px-3 py-1 text-xs rounded bg-red-600 text-white disabled:opacity-50"
              >
                {actionLoading === u.uid ? "Blocking..." : "Block"}
              </button>
            )}
          </div> */}
        </div>
      ))}
    </div>
  );
}
