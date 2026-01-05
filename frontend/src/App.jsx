import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import ScrollRestoration from "./Components/ScrollRestoration";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminRoute from "./Components/Admin/AdminRoute";
import { Toaster } from "react-hot-toast";

import Home from "./Pages/Home";
import Plans from "./Pages/Plans";
import Login from "./Pages/Login";
import About from "./Pages/About";
import Register from "./Pages/Register";
import Overview from "./Pages/Dashboard/Overview";
import Invest from "./Pages/Dashboard/Invest";
import Earnings from "./Pages/Dashboard/Earnings";
import Withdraw from "./Pages/Dashboard/Withdraw";
import VerifyEmail from "./Pages/VerifyEmail";
import AdminDashboard from "./Pages/AdminDashboard";

export default function App() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    fetch(`${BASE_URL}/health`).catch((err) =>
      console.log("Ping failed, but that's okay")
    );
  }, []);
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
      <Router>
        <ScrollRestoration />
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verifyEmail" element={<VerifyEmail />} />

          <Route path="/dashboard" element={<Overview />} />
          <Route
            path="/dashboard/invest"
            element={
              <ProtectedRoute>
                <Invest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/earnings"
            element={
              <ProtectedRoute>
                <Earnings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/withdraw"
            element={
              <ProtectedRoute>
                <Withdraw />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
