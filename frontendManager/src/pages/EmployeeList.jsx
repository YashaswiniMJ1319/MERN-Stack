import React, { useState } from "react";
import { CSVLink } from "react-csv";

const dummyAttendance = [
  { id: 1, name: "Yashwanth", date: "2024-11-01", status: "Present", department: "IT" },
  { id: 2, name: "Suresh", date: "2024-11-01", status: "Absent", department: "HR" },
  { id: 3, name: "Ram", date: "2024-11-01", status: "Present", department: "Finance" },
  { id: 4, name: "Harsha", date: "2024-11-02", status: "Leave", department: "IT" },
];

export default function EmployeeList() {
  const [data, setData] = useState(dummyAttendance);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredData = data.filter((record) => {
    const matchesName = record.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? record.status === statusFilter : true;
    return matchesName && matchesStatus;
  });

  const total = data.length;
  const present = data.filter(d => d.status === "Present").length;
  const absent = data.filter(d => d.status === "Absent").length;
  const leave = data.filter(d => d.status === "Leave").length;

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold text-[#004D40] mb-6">Employee Attendance</h1>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded-xl text-center">
          <h2 className="font-medium text-lg">Total Records</h2>
          <p className="text-3xl font-bold">{total}</p>
        </div>
        <div className="bg-green-100 p-4 shadow rounded-xl text-center">
          <h2 className="font-medium text-lg">Present</h2>
          <p className="text-3xl font-bold">{present}</p>
        </div>
        <div className="bg-red-100 p-4 shadow rounded-xl text-center">
          <h2 className="font-medium text-lg">Absent</h2>
          <p className="text-3xl font-bold">{absent}</p>
        </div>
        <div className="bg-yellow-100 p-4 shadow rounded-xl text-center">
          <h2 className="font-medium text-lg">Leave</h2>
          <p className="text-3xl font-bold">{leave}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search employee"
          className="border p-2 rounded w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Filter by Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Leave">Leave</option>
        </select>

        <CSVLink
          data={filteredData}
          filename="attendance_report.csv"
          className="bg-[#004D40] px-4 py-2 text-white rounded"
        >
          Export CSV
        </CSVLink>
      </div>

      {/* Attendance Table */}
      <table className="w-full border">
        <thead className="bg-[#004D40] text-white">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Department</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id} className="text-center border">
              <td className="p-2 border">{item.id}</td>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.date}</td>
              <td className="p-2 border">{item.status}</td>
              <td className="p-2 border">{item.department}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
