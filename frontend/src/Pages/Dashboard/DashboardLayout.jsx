import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiTrendingUp,
  FiDollarSign,
  FiCreditCard,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiLogIn,
} from "react-icons/fi";
import { useAuth } from "../../Context/AuthContext";
import AccountPopup from "../../Components/AccountPopup";
import InstallButton from "../../Components/InstallButton";

export default function DashboardLayout({ title, children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, isAuthenticated, isEmailVerified, logout, user, isAdmin } =
    useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const fullName = isAuthenticated ? (profile?.fullName ?? "User") : "Guest";
  const email = isAuthenticated ? profile?.email : "Verify email";
  const isLoggedIn = !!user;

  const navItem = (to, label, Icon) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
        ${
          location.pathname === to
            ? "bg-gray-800 text-orange-500"
            : "text-gray-300 hover:bg-gray-800 hover:text-orange-400"
        }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex md:pt-10">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-black text-white p-6 flex-col">
        {/* Account Info */}
        <div
          className="mb-8 hover:cursor-pointer"
          onClick={() => setShowAccount(true)}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-800 rounded-full">
              <FiUser size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">{fullName}</p>
              <p
                className={`text-xs text-gray-400 truncate ${
                  !isEmailVerified ? "cursor-pointer hover:text-orange-500" : ""
                }`}
                onClick={() => {
                  if (!isEmailVerified) {
                    navigate("/verifyEmail");
                  }
                }}
              >
                {email}
              </p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {navItem("/dashboard", "Overview", FiHome)}
          {navItem("/dashboard/earnings", "Earnings", FiDollarSign)}
          {navItem("/dashboard/invest", "Invest/Deposit", FiTrendingUp)}
          {navItem("/dashboard/withdraw", "Withdraw", FiCreditCard)}
          {isAdmin &&
            isAuthenticated &&
            navItem("/dashboard/admin", "Admin", FiUser)}
        </nav>
        <InstallButton isMobile={false} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-black text-white z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-lg font-bold">
            PAL<span className="text-orange-500">Robotics</span>
          </h2>
          <button onClick={() => setOpen(false)}>
            <FiX size={22} />
          </button>
        </div>

        {/* Account Info */}
        <div
          className="p-4 border-b border-gray-800"
          onClick={() => setShowAccount(true)}
        >
          <p className="text-sm font-semibold">{fullName}</p>
          <p
            className={`text-xs text-gray-400 truncate ${
              !isEmailVerified ? "cursor-pointer hover:text-orange-500" : ""
            }`}
            onClick={() => {
              if (!isEmailVerified) {
                navigate("/verifyEmail");
              }
            }}
          >
            {email}
          </p>
        </div>

        <nav className="p-4 space-y-2">
          {navItem("/dashboard", "Overview", FiHome)}
          {navItem("/dashboard/earnings", "Earnings", FiDollarSign)}
          {navItem("/dashboard/invest", "Invest/Deposit", FiTrendingUp)}
          {navItem("/dashboard/withdraw", "Withdraw", FiCreditCard)}
          {isAdmin &&
            isAuthenticated &&
            navItem("/dashboard/admin", "Admin", FiUser)}
        </nav>

        {/* Mobile Section: Install Button then Logout */}
        <div className="mt-auto border-t border-gray-800">
          <InstallButton isMobile={true} />

          <div className="p-4 pt-0">
            {isLoggedIn ? (
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-gray-800 transition"
              >
                <FiLogOut size={18} /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-gray-800 transition"
              >
                <FiLogIn size={18} /> LogIn
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:pt-5">
        {/* Mobile Header */}
        <div
          onClick={() => setShowAccount(true)}
          className="lg:hidden fixed w-screen flex items-center justify-between gap-4 bg-white px-4 py-3 shadow-sm z-30 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              <FiMenu size={22} />
            </button>
            <h1 className="text-lg font-semibold text-black">{title}</h1>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium text-black">{fullName}</p>
            {!isAdmin && (
              <p
                className={`text-xs text-gray-400 truncate ${
                  !isEmailVerified ? "cursor-pointer hover:text-orange-500" : ""
                }`}
                onClick={() => {
                  if (!isEmailVerified) {
                    navigate("/verifyEmail");
                  }
                }}
              >
                {email}
              </p>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6 pt-20 lg:p-10 pb-20">
          <h1 className="hidden lg:block text-2xl font-bold mb-6 text-black">
            {title}
          </h1>
          {children}
        </div>
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold text-black mb-4">
              Confirm Logout
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm rounded bg-gray-200 text-black"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await logout();
                  setShowLogoutModal(false);
                  navigate("/login");
                }}
                className="px-4 py-2 text-sm rounded bg-orange-500 text-black"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
      <AccountPopup open={showAccount} onClose={() => setShowAccount(false)} />
    </div>
  );
}
