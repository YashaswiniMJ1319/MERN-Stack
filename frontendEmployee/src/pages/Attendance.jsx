import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axiosInstance from "../utils/axiosInstance.js";

export default function Attendance() {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  }); // YYYY-MM-DD in IST

  useEffect(() => {
    const fetchTodayStatus = async () => {
      try {
        const res = await axiosInstance.get("/attendance/today-status");
        setStatus(res.data);
      } catch (err) {
        setError("Failed to load attendance status");
      }
    };
    if (user) fetchTodayStatus();
  }, [user]);

  const handleCheckIn = async () => {
    setLoading(true);
    setError("");

    // Optimistic UI update
    const nowLabel = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    setStatus(prev => ({
      checkedIn: true,
      checkedOut: false,
      record: { ...(prev?.record || {}), checkInLabel: nowLabel, date: today },
    }));

    try {
      const res = await axiosInstance.post("/attendance/checkin", {}, {});
      console.log(res.data);
      // Sync from backend if needed
      setStatus(prev => ({
        ...prev,
        record: res.data.record,
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
      setStatus(null); // rollback
    }

    setLoading(false);
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError("");

    // Optimistic update
    const outLabel = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    setStatus(prev => ({
      ...prev,
      checkedOut: true,
      record: { ...prev.record, checkOutLabel: outLabel },
    }));

    try {
      const res = await axiosInstance.post("/attendance/checkout", {}, {});
      console.log(res.data);
      // Refresh from backend response
      setStatus(prev => ({
        ...prev,
        record: res.data.record,
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full">
      <h1 className="text-3xl font-bold text-[#004D40] mb-4">
        Mark Attendance
      </h1>
      {error && <p className="text-red-500 text-center text-sm">{error}</p>}

      <div className="border rounded-lg p-5 bg-gray-50">
        <p className="font-semibold mb-2">Today's Attendance</p>

        <p className="mb-2">
          <strong>Date:</strong> {today}
        </p>

        {!status?.checkedIn && (
          <>
            <p className="text-yellow-600 mb-3">
              You have not checked in yet today.
            </p>
            <button
              className="bg-[#004D40] text-white px-5 py-2 rounded-lg"
              onClick={handleCheckIn}
              disabled={loading}
            >
              {loading ? "Processing…" : "Check In"}
            </button>
          </>
        )}

        {status?.checkedIn && !status?.checkedOut && (
          <>
            <p className="mt-3">
              <strong>Check-in:</strong> {status.record?.checkInLabel || "-"}
            </p>
            <button
              className="bg-red-600 text-white px-5 py-2 rounded-lg mt-4"
              onClick={handleCheckOut}
              disabled={loading}
            >
              {loading ? "Processing…" : "Check Out"}
            </button>
          </>
        )}

        {status?.checkedOut && (
          <>
            <p>
              <strong>Check-in:</strong> {status.record?.checkInLabel || "-"}
            </p>
            <p>
              <strong>Check-out:</strong> {status.record?.checkOutLabel || "-"}
            </p>
            <div className="bg-green-200 text-green-800 p-3 rounded mt-4 font-semibold">
              Checked out successfully!
            </div>
            <p className="text-green-700 mt-3 font-semibold">
              You have completed your attendance for today.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
