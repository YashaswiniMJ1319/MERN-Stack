import React, { useState } from "react";

export default function EmployeeAttendance() {
  const [attendanceData] = useState([
    { id: 1, name: "Rahul Sharma", date: "2025-11-30", checkIn: "09:05 AM", checkOut: "--", status: "Present" },
    { id: 2, name: "Pooja Rao", date: "2025-11-30", checkIn: "--", checkOut: "--", status: "Absent" },
    { id: 3, name: "Arjun Patel", date: "2025-11-30", checkIn: "10:12 AM", checkOut: "--", status: "Late" }
  ]);

  const [filters, setFilters] = useState({
    name: "",
    date: "",
    status: ""
  });

  const filteredData = attendanceData.filter((item) => {
    return (
      (filters.name === "" || item.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.date === "" || item.date === filters.date) &&
      (filters.status === "" || item.status === filters.status)
    );
  });

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-[#0A2A6E] mb-6">All Employees Attendance</h2>

      {/* FILTER BAR */}
      <div className="p-4 bg-white rounded-xl shadow-md flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by employee name"
          className="border p-2 rounded w-1/3"
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0A2A6E] text-white">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Check In</th>
              <th className="p-3 text-left">Check Out</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.date}</td>
                  <td className="p-3">{item.checkIn}</td>
                  <td className="p-3">{item.checkOut}</td>
                  <td
                    className={`p-3 font-semibold ${
                      item.status === "Present"
                        ? "text-green-600"
                        : item.status === "Absent"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan="5">
                  No Records Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
