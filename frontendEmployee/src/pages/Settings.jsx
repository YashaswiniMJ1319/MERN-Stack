import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Settings() {
  const { user } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateStrongPassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(pass);
  };

  const handleSave = async () => {
    setError("");

    if (!user) {
      return alert("❌ Please login first");
    }

    if (!oldPassword) {
      return alert("⚠ Enter old password");
    }

    if (!validateStrongPassword(newPassword)) {
      return alert("⚠ Password must be 8+ chars, include uppercase, lowercase, number & symbol");
    }

    if (newPassword !== confirmPassword) {
      return alert("⚠ New password and confirm password do not match");
    }

    setLoading(true);
    try {
      await axiosInstance.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      alert("✅ Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-[#004D40] mb-6">Change Password</h1>

      {error && <p className="text-red-600 text-center mb-3 text-sm">{error}</p>}

      <div className="space-y-4">
        <div>
          <label className="font-semibold">Old Password</label>
          <input
            type="password"
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold">New Password</label>
          <input
            type="password"
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold">Confirm Password</label>
          <input
            type="password"
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-4 bg-[#009688] hover:bg-[#00796B] text-white py-2 rounded-lg font-semibold"
        >
          {loading ? "Saving..." : "Save Password"}
        </button>
      </div>
    </div>
  );
}
