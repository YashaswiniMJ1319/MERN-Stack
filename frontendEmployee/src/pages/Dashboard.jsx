import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Profile from "./Profile";
import Attendance from "./Attendance"; 
import AttendanceReport from "./AttendanceReport"; 
import Leaves from "./Leaves";
import Settings from "./Settings";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const { user } = useAuth();   // Get logged-in user

  return (
    <div className="flex h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="p-10">

          {activePage === "dashboard" && (
            <>
              <h1 className="text-3xl font-bold text-[#004D40]">
                Welcome, {user?.name || "User"} 👋
              </h1>
              <p className="mt-3 text-gray-600">
                Welcome to the Employee Management System Dashboard. 
                Use the left menu to navigate across different modules.
              </p>
            </>
          )}

          {activePage === "profile" && <Profile />}
          {activePage === "attendance" && <Attendance />}
          {activePage === "attendance-report" && <AttendanceReport />}
          {activePage === "leaves" && <Leaves />}
          {activePage === "settings" && <Settings />}

        </div>
      </div>
    </div>
  );
}
