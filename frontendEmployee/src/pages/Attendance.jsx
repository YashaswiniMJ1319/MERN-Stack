import React, { useState } from "react";

export default function Attendance() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);

  // FIXED DATE (LOCAL YYYY-MM-DD)
  const today = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
    setCheckedIn(true);
  };

  const handleCheckOut = () => {
    const now = new Date();
    setCheckOutTime(
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
    setCheckedOut(true);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full">
      <h1 className="text-3xl font-bold text-[#004D40] mb-4">Mark Attendance</h1>

      <div className="border rounded-lg p-5 bg-gray-50">
        <p className="font-semibold mb-2">Today's Attendance</p>

        <p className="mb-2">
          <strong>Date:</strong> {today}
        </p>

        {!checkedIn && (
          <>
            <p className="text-yellow-600 mb-3">You have not checked in yet today.</p>
            <button
              className="bg-[#004D40] text-white px-5 py-2 rounded-lg hover:bg-[#00332B]"
              onClick={handleCheckIn}
            >
              Check In
            </button>
          </>
        )}

        {checkedIn && !checkedOut && (
          <>
            <p className="mt-3">
              <strong>Check-in Time:</strong> {checkInTime}
            </p>
            <button
              className="bg-red-600 text-white px-5 py-2 rounded-lg mt-4 hover:bg-red-700"
              onClick={handleCheckOut}
            >
              Check Out
            </button>
          </>
        )}

        {checkedOut && (
          <>
            <p className="mt-3">
              <strong>Check-in Time:</strong> {checkInTime}
            </p>
            <p className="mt-1">
              <strong>Check-out Time:</strong> {checkOutTime}
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
