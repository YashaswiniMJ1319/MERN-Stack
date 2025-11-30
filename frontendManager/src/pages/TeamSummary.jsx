import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TeamSummary() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("managerToken"); // JWT for secure access

        const res = await axios.get("http://localhost:5000/manager/team-summary", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setSummary(res.data);
      } catch (error) {
        console.log("Error loading team summary:", error);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-[#0A2A6E] mb-6">
        Team Attendance Summary
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0A2A6E] text-white">
              <th className="p-3 text-left">Branch</th>
              <th className="p-3 text-left">Total Employees</th>
              <th className="p-3 text-left">Present</th>
              <th className="p-3 text-left">Absent</th>
              <th className="p-3 text-left">Late</th>
            </tr>
          </thead>

          <tbody>
            {summary.length > 0 ? (
              summary.map((team, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-3 font-semibold">{team.branch}</td>
                  <td className="p-3">{team.total}</td>
                  <td className="p-3 text-green-600 font-bold">{team.present}</td>
                  <td className="p-3 text-red-600 font-bold">{team.absent}</td>
                  <td className="p-3 text-yellow-600 font-bold">{team.late}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
