import React, { useState } from "react";

export default function Settings() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // default temporary password stored in local storage
  const storedPassword = localStorage.getItem("userPassword") || "Admin@123";

  const validateStrongPassword = (pass) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pass);
  };

  const handleSave = () => {
    if (oldPassword !== storedPassword) {
      alert("❌ Old password is incorrect!");
      return;
    }

    if (!validateStrongPassword(newPassword)) {
      alert(
        "⚠ Password must be at least 8 characters long and include numbers, uppercase, lowercase, and symbols"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("⚠ New password and Confirm password do not match");
      return;
    }

    localStorage.setItem("userPassword", newPassword);
    alert("✅ Password updated successfully!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-[#004D40] mb-6">Change Password</h1>

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
          className="w-full mt-4 bg-[#009688] hover:bg-[#00796B] text-white py-2 rounded-lg font-semibold"
        >
          Save Password
        </button>
      </div>
    </div>
  );
}
