import { useState, useEffect } from "react";
import { FiX, FiEdit2, FiSave } from "react-icons/fi";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/index";
import { useAuth } from "../Context/AuthContext";

export default function AccountPopup({ open, onClose }) {
  const { user, profile, isAuthenticated } = useAuth();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!user) return;

    try {
      setLoading(true);

      await updateDoc(doc(db, "users", user.uid), {
        fullName: form.fullName,
        phone: form.phone,
      });

      setEditing(false);
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Account Information</h2>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {!isAuthenticated ? (
          <p className="text-sm text-gray-600">Guest account</p>
        ) : (
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs text-gray-500">Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                disabled={!editing}
                className="w-full border border-orange-500/70 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-gray-500">Email</label>
              <input
                name="email"
                value={form.email}
                disabled
                className="w-full border border-orange-500/70 rounded-lg px-3 py-2 text-sm bg-gray-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs text-gray-500">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={!editing}
                className="w-full border border-orange-500/70 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={editing ? handleUpdate : () => setEditing(true)}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 text-black py-2 rounded-lg font-medium"
            >
              {editing ? <FiSave /> : <FiEdit2 />}
              {editing ? "Update" : "Edit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
