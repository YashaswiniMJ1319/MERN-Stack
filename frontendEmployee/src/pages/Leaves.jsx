import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LeavePage() {
  const { user } = useAuth();   // fetch the logged user from context
  const employeeName = user?.name || "Employee";
 // fallback name

  const [filter, setFilter] = useState("All");

  const leaveData = [
    { id: 1, from: "2025-11-10", to: "2025-11-12", type: "Sick Leave", days: 3, status: "Approved" },
    { id: 2, from: "2025-11-15", to: "2025-11-15", type: "Casual Leave", days: 1, status: "Pending" },
    { id: 3, from: "2025-11-20", to: "2025-11-21", type: "Annual Leave", days: 2, status: "Rejected" },
  ];

  const filteredLeaves =
    filter === "All" ? leaveData : leaveData.filter((item) => item.status === filter);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#004D40]">{employeeName}</h1>

        <div className="flex gap-3">
          {["Pending", "Approved", "Rejected", "All"].map((btn) => (
            <button
              key={btn}
              onClick={() => setFilter(btn)}
              className={`px-4 py-2 rounded-lg font-semibold border
                  ${filter === btn ? "bg-[#004D40] text-white" : "text-gray-800 border-gray-400"}`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden w-full">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-3">S No</th>
              <th className="p-3">From Date</th>
              <th className="p-3">To Date</th>
              <th className="p-3">Leave Type</th>
              <th className="p-3">Days</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeaves.map((leave, index) => (
              <tr key={leave.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{leave.from}</td>
                <td className="p-3">{leave.to}</td>
                <td className="p-3">{leave.type}</td>
                <td className="p-3">{leave.days}</td>
                <td
                  className={`p-3 font-semibold ${
                    leave.status === "Approved"
                      ? "text-green-600"
                      : leave.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {leave.status}
                </td>
              </tr>
            ))}

            {filteredLeaves.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-5 text-gray-500">
                  No leave records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
