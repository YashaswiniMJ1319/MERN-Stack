import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();  // getting logged-in user name

  const employee = {
    name: user?.name || "Employee",   // if empty, show default
    empId: "emp112",
    dob: "09/4/2024",
    gender: "Male",
    department: "IT",
    maritalStatus: "Single",
    image: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#004D40] mb-6">My Profile</h1>

      <div className="bg-white shadow-xl rounded-2xl p-8 flex items-center gap-10">
        <img
          src={employee.image}
          alt="profile"
          className="w-48 h-48 rounded-full border-4 border-[#009688] object-cover"
        />

        <div className="space-y-2 text-lg">
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Employee ID:</strong> {employee.empId}</p>
          <p><strong>Date of Birth:</strong> {employee.dob}</p>
          <p><strong>Gender:</strong> {employee.gender}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Marital Status:</strong> {employee.maritalStatus}</p>
        </div>
      </div>
    </div>
  );
}
