import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axiosInstance from "../utils/axiosInstance.js";

export default function Profile() {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axiosInstance.get("/auth/me"); // ✅ Firestore backend
        setEmployee(res.data);
      } catch (err) {
        setError("Failed to load profile");
      }
    };
    if (user) fetchMe();
  }, [user]);

  const profile = {
    name: employee?.name || "Employee",
    empId: employee?.id || "-",
    dob: "09/4/2024",
    gender: "Male",
    department: "IT",
    maritalStatus: "Single",
    image: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#004D40] mb-6">My Profile</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="bg-white shadow-xl rounded-2xl p-8 flex items-center gap-10">
        <img
          src={profile.image}
          alt="profile"
          className="w-48 h-48 rounded-full border-4 border-[#009688] object-cover"
        />

        <div className="space-y-2 text-lg">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Employee ID:</strong> {profile.empId}</p>
          <p><strong>Date of Birth:</strong> {profile.dob}</p>
          <p><strong>Gender:</strong> {profile.gender}</p>
          <p><strong>Department:</strong> {profile.department}</p>
          <p><strong>Marital Status:</strong> {profile.maritalStatus}</p>
        </div>
      </div>
    </div>
  );
}
