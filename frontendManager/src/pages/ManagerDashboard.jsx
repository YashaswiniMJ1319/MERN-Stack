import { useEffect, useState } from "react";
import axios from "axios";
import ManagerSidebar from "../components/ManagerSidebar";
import ManagerTopbar from "../components/ManagerTopbar";

export default function ManagerDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("managerToken");

        const res = await axios.get("http://localhost:5000/manager/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setStats(res.data);
      } catch (err) {
        console.log("Error fetching dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex bg-gray-100 h-screen">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col">
        <ManagerTopbar />

        <div className="p-6 space-y-6 overflow-y-auto">

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white shadow-md p-6 rounded-xl border-l-4 border-[#1A237E]">
              <h3 className="text-lg font-semibold">Total Employees</h3>
              <p className="text-3xl font-bold mt-2 text-[#1A237E]">
                {stats.total}
              </p>
            </div>

            <div className="bg-white shadow-md p-6 rounded-xl border-l-4 border-green-600">
              <h3 className="text-lg font-semibold">Present Today</h3>
              <p className="text-3xl font-bold mt-2 text-green-600">
                {stats.present}
              </p>
            </div>

            <div className="bg-white shadow-md p-6 rounded-xl border-l-4 border-red-600">
              <h3 className="text-lg font-semibold">Absent Today</h3>
              <p className="text-3xl font-bold mt-2 text-red-600">
                {stats.absent}
              </p>
            </div>

            <div className="bg-white shadow-md p-6 rounded-xl border-l-4 border-yellow-500">
              <h3 className="text-lg font-semibold">Late Arrivals</h3>
              <p className="text-3xl font-bold mt-2 text-yellow-600">
                {stats.late}
              </p>
            </div>
          </div>

          {/* Recent Attendance Table */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Today’s Attendance</h3>
            <table className="w-full">
              <thead>
                <tr className="bg-[#1A237E] text-white">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Check In</th>
                  <th className="p-3 text-left">Check Out</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">Rahul Sharma</td>
                  <td className="p-3">09:05 AM</td>
                  <td className="p-3">—</td>
                  <td className="p-3 text-green-600 font-bold">Present</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
