import React from "react";
import ManagerSidebar from "../../components/sidebar/ManagerSidebar";
import ManagerTopbar from "../../components/topbar/ManagerTopbar";

export default function AllEmployees() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <ManagerSidebar />
      <div className="flex-1 flex flex-col">
        <ManagerTopbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#1A237E]">All Employees Attendance</h1>
          <p className="mt-2 text-gray-600">This page will display attendance records.</p>
        </div>
      </div>
    </div>
  );
}
