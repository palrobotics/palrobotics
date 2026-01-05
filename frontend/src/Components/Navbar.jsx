import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiGrid, FiInfo, FiUser, FiLogIn } from "react-icons/fi";
import { useAuth } from "../Context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  const isActive = (path) =>
    location.pathname === path ? "text-orange-500" : "text-gray-300";

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden fixed w-screen z-100 md:flex justify-between items-center px-8 py-4 bg-black text-white shadow">
        <h1 className="text-xl font-bold tracking-wide">
          PAL<span className="text-orange-500">Robotics</span>
        </h1>

        <div className="space-x-6 text-sm font-medium">
          <Link className="hover:text-orange-400" to="/">
            Home
          </Link>
          <Link className="hover:text-orange-400" to="/dashboard">
            Dashboard
          </Link>
          <Link className="hover:text-orange-400" to="/plans">
            Plans
          </Link>
          <Link className="hover:text-orange-400" to="/about">
            About
          </Link>

          {isLoggedIn ? (
            <button
              onClick={() => setShowLogoutModal(true)}
              className="bg-orange-500 px-4 py-2 rounded text-black"
            >
              Logout
            </button>
          ) : (
            <Link
              className="bg-orange-500 px-4 py-2 rounded text-black"
              to="/login"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-black border-t border-gray-800 z-50">
        <div className="flex justify-around items-center py-2">
          <Link
            to="/"
            className={`flex flex-col items-center text-xs ${isActive("/")}`}
          >
            <FiHome size={20} />
            <span className="mt-1">Home</span>
          </Link>

          <Link
            to="/dashboard"
            className={`flex flex-col items-center text-xs ${isActive(
              "/dashboard"
            )}`}
          >
            <FiUser size={20} />
            <span className="mt-1">Dashboard</span>
          </Link>

          <Link
            to="/plans"
            className={`flex flex-col items-center text-xs ${isActive(
              "/plans"
            )}`}
          >
            <FiGrid size={20} />
            <span className="mt-1">Plans</span>
          </Link>

          <Link
            to="/about"
            className={`flex flex-col items-center text-xs ${isActive(
              "/about"
            )}`}
          >
            <FiInfo size={20} />
            <span className="mt-1">About</span>
          </Link>

          {!isLoggedIn && (
            <Link
              to="/login"
              className={`flex flex-col items-center text-xs ${isActive(
                "/login"
              )}`}
            >
              <FiLogIn size={20} />
              <span className="mt-1">Login</span>
            </Link>
          )}
        </div>
      </nav>
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
    </>
  );
}
