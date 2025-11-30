import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";

export default function EmployeeAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    date: "",
    status: ""
  });

  // Fetch Attendance Data from Backend
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("managerToken");

        const res = await axios.get("http://localhost:5000/manager/attendance", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setAttendanceData(res.data);
      } catch (error) {
        console.log("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, []);

  // Filter Logic
  const filteredData = attendanceData.filter((item) => {
    return (
      (filters.name === "" ||
        item.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.date === "" || item.date === filters.date) &&
      (filters.status === "" || item.status === filters.status)
    );
  });

  const headers = [
    { label: "Employee Name", key: "name" },
    { label: "Date", key: "date" },
    { label: "Check In", key: "checkIn" },
    { label: "Check Out", key: "checkOut" },
    { label: "Status", key: "status" }
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#0A2A6E]">All Employees Attendance</h2>

        {/* Export CSV */}
        <CSVLink
          data={filteredData}
          headers={headers}
          filename="attendance-report.csv"
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Export CSV
        </CSVLink>
      </div>

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
