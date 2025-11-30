import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axiosInstance from "../utils/axiosInstance.js";

export default function LeavePage() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axiosInstance.get("/leave"); 
        setLeaves(res.data);
      } catch (err) {
        setError("Failed to load leaves");
      }
    };
    if (user) fetchLeaves();
  }, [user]);

  const filteredLeaves = filter === "All" ? leaves : leaves.filter(l => l.status === filter);

  const handleApplyLeave = async (form) => {
    setLoading(true);
    try {
      await axiosInstance.post("/leave/apply", form);
      alert("✅ Leave applied successfully!");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {error && <p className="text-red-600 text-center mb-3 text-sm">{error}</p>}

      {/* Header UI unchanged */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#004D40]">{user?.name || "Employee"}</h1>

        <div className="flex gap-3">
          {["Pending","Approved","Rejected","All"].map(btn => (
            <button key={btn} onClick={() => setFilter(btn)} className={`px-4 py-2 rounded-lg font-semibold border ${filter===btn?"bg-[#004D40] text-white":"text-gray-800 border-gray-400"}`}>{btn}</button>
          ))}
        </div>
      </div>

      {/* Table UI unchanged */}
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
            {filteredLeaves.map((l,i)=>(
              <tr key={l.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{i+1}</td>
                <td className="p-3">{l.from}</td>
                <td className="p-3">{l.to}</td>
                <td className="p-3">{l.type}</td>
                <td className="p-3">{l.days}</td>
                <td className={`p-3 font-semibold ${l.status==="Approved"?"text-green-600":l.status==="Rejected"?"text-red-600":"text-yellow-600"}`}>{l.status}</td>
              </tr>
            ))}

            {!filteredLeaves.length && <tr><td colSpan="6" className="text-center py-5 text-gray-500">No leave records</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Apply Leave Form UI preserved ✅ */}
      <div className="bg-white p-6 mt-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-[#004D40] mb-4">Apply for Leave</h2>
        <form onSubmit={e=>{e.preventDefault();handleApplyLeave(Object.fromEntries(new FormData(e.target)))}} className="space-y-4">
          <input name="fromDate" type="date" className="w-full border p-2 rounded-lg" required/>
          <input name="toDate" type="date" className="w-full border p-2 rounded-lg" required/>
          <input name="type" placeholder="Leave Type" className="w-full border p-2 rounded-lg" required/>
          <textarea name="reason" placeholder="Reason" className="w-full border p-2 rounded-lg" required/>
          <button disabled={loading} className="w-full bg-[#004D40] text-white py-2 rounded-lg font-semibold">{loading?"Applying…":"Apply Leave"}</button>
        </form>
      </div>
    </div>
  );
}
