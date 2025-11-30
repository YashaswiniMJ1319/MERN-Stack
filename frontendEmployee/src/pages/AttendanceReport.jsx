import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function AttendanceReport() {
  const [report, setReport] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get("/attendance/history");
        setReport(res.data);
      } catch (err) {
        setError("Failed to fetch attendance history");
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-[#004D40] mb-6">Attendance Report</h1>
      {error && <p className="text-red-500 text-center text-sm mb-3">{error}</p>}

      {/* Working Hours Graph (same UI, only data changed) */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h3 className="text-lg font-semibold text-[#004D40] mb-3">Working Hours — Daily</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={report.map(r => ({ day: r.date, hours: r.hours }))} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="day"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="hours" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Cards (design preserved, DB connected) */}
      <div className="space-y-4 mt-6">
        {report.map((r, i) => (
          <div key={r.id} className="border p-4 rounded-lg bg-gray-50">
            <p><strong>{i+1}. Date:</strong> {r.date}</p>
            <p><strong>Status:</strong> {r.status}</p>
            <p><strong>Check-in:</strong> {r.checkInLabel || "-"}</p>
            <p><strong>Check-out:</strong> {r.checkOut || "-"}</p>
            <p><strong>Hours:</strong> {r.hours} hrs</p>
          </div>
        ))}

        {!report.length && <p className="text-center py-5 text-gray-500">No attendance records</p>}
      </div>
    </div>
  );
}
