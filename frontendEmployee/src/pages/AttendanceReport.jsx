import React, { useMemo, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axiosInstance from "../utils/axiosInstance.js";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

/* ---------- Modal Component (unchanged ✅) ---------- */
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 z-10 transform transition-all">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

/* ---------- Status Colors (Design untouched ✅) ---------- */
const STATUS_COLOR = {
  present: "#16A34A",
  absent: "#EF4444",
  half: "#F59E0B",
  weekend: "#60A5FA",
  empty: "#E6E6E6",
};

const STATUS_LABEL = {
  present: "Present",
  absent: "Absent",
  half: "Half Day",
  weekend: "Weekend/Holiday",
};

/* ---------- Main Component ---------- */
export default function AttendanceReport() {
  const { user } = useAuth();
  const today = new Date();
  const [monthZeroIndex, setMonthZeroIndex] = useState(today.getMonth());
  const yearVal = today.getFullYear();
  const month = monthZeroIndex + 1;

  const [monthRecords, setMonthRecords] = useState([]);
  const [summary, setSummary] = useState({ present: 0, absent: 0, half: 0, totalHours: 0 });
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------- Fetch Firestore Data (Only necessary changes ✅) ---------- */
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setLoading(true);

        const res = await axiosInstance.get("/attendance/month-data", {
          params: { month, year: yearVal }
        });

        // Firestore keys → checkInLabel, checkOutLabel
const formatted = res.data.map(rec => ({
  day: rec.day?.toString(),      // ✅ use day from API
  date: rec.date,               // remains same
  status: rec.status.toLowerCase(),
  hours: rec.hours,
  checkIn: rec.checkInTime,     // ✅ IST from DB
  checkOut: rec.checkOutTime,   // ✅ IST from DB
  meta: rec
}));



        setMonthRecords(formatted);

        const sumRes = await axiosInstance.get("/attendance/monthly-summary", {
          params: { month, year: yearVal }
        });

        setSummary(sumRes.data);

      } catch (err) {
        alert("❌ Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, month, yearVal]);

  /* ---------- Build Heatmap (Design untouched ✅ but data now real) ---------- */
  const heatmapCells = useMemo(() => {
    const cells = [];
    const firstDay = new Date(yearVal, monthZeroIndex, 1);
    const daysInMonth = new Date(yearVal, month, 0).getDate();
    const startWeekday = (firstDay.getDay() + 6) % 7;

    for (let i = 0; i < startWeekday; i++) {
      cells.push({ empty: true, key: `blank-${i}` });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${yearVal}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const rec = monthRecords.find(r => r.date === key);
      let status = rec?.status ?? "empty";

      const weekday = new Date(key).getDay();
      if (!rec && (weekday === 0 || weekday === 6)) {
        status = "weekend";
      }

      cells.push({ empty: false, key, day: d, status, meta: rec?.meta ?? null });
    }

    return cells;
  }, [monthRecords, month, yearVal]);

  /* ---------- Chart Data for Bar Graph (Design untouched ✅) ---------- */
  const chartData = useMemo(() => {
    return monthRecords.map(rec => ({
      day: rec.day?.toString(),
      hours: rec.hours
    }));
  }, [monthRecords]);

  /* ---------- Click Handlers (NOT TOUCHED ✅) ---------- */
  const onDayClick = (cell) => {
    if (!cell.empty && cell.meta) {
      setSelectedDay(cell);
    }
  };

  const closeModal = () => setSelectedDay(null);

  const monthTitle = `${today.toLocaleString(undefined, { month: "long" })} ${yearVal}`;

  return (
    <div className="p-8 max-w-7xl mx-auto">

      <h1 className="text-2xl md:text-3xl font-bold text-[#004D40] mb-6">
        Attendance Report — {monthTitle}
      </h1>

      {loading && <p className="text-center text-gray-500 text-sm">Loading report…</p>}

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ---------- Heat Map UI (NOT TOUCHED DESIGN ✅) ---------- */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Monthly Heatmap</h2>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {heatmapCells.map(cell => {
              if (cell.empty) return <div key={cell.key} className="w-9 h-9 rounded" />;

              const color = cell.status === "weekend"
                ? STATUS_COLOR.weekend
                : STATUS_COLOR[cell.status] ?? STATUS_COLOR.empty;

              return (
                <button
                  key={cell.key}
                  className="w-9 h-9 rounded text-xs font-medium transition transform hover:scale-105"
                  style={{ background: color, color: "#fff" }}
                  onClick={() => onDayClick(cell)}
                  title={`${cell.day} — ${STATUS_LABEL[cell.status] ?? cell.status}`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-sm text-gray-600">Click a day to view details.</p>
        </div>

        {/* ---------- Summary Card (Design untouched ✅, Live Firestore data ✅)---------- */}
        <div className="w-full lg:w-80 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-[#004D40] mb-3">Monthly Summary</h2>

          <div className="flex flex-col gap-2">
            <p className="flex justify-between"><span>✅ Present</span> <b>{summary.present}</b></p>
            <p className="flex justify-between"><span>❌ Absent</span> <b>{summary.absent}</b></p>
            <p className="flex justify-between"><span>⚠ Half Days</span> <b>{summary.half}</b></p>
            <p className="flex justify-between border-t pt-3 mt-2"><span>Total Hours</span> <b>{summary.totalHours} hrs</b></p>
          </div>

          {/* Month Selector (NOT TOUCHED ✅) */}
          <div className="mt-4">
            <label className="text-sm text-gray-500">Month</label>
            <select
              value={monthZeroIndex}
              onChange={(e) => setMonthZeroIndex(Number(e.target.value))}
              className="mt-2 w-full border rounded px-3 py-2"
            >
              {Array.from({ length: 12 }).map((_, i) => {
                const d = new Date(yearVal, i, 1);
                return (
                  <option key={i} value={i}>
                    {d.toLocaleString(undefined, { month: "long", year: "numeric" })}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

      </div>

      {/* ---------- Bar Chart UI (Design untouched ✅, Now live data ✅) ---------- */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h3 className="text-lg font-semibold text-[#004D40] mb-3">Working Hours — Daily</h3>
        <div style={{ width:"100%", height:300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top:5, right:15, bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------- Modal Popup (Design untouched ✅ but now Firestore mapped ✅) ---------- */}
      <Modal open={!!selectedDay} onClose={closeModal}>
        {selectedDay && (
          <div>
            <h4 className="text-xl font-bold mb-4">{monthTitle}</h4>

            <div className="flex gap-6">
              <div className="flex-1">
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">{selectedDay.meta?.date ?? "-"}</p>

                <p className="mt-3 text-sm text-gray-500">Status</p>
                <p className="font-semibold">
                  {STATUS_LABEL[selectedDay.meta?.status?.toLowerCase()] ?? selectedDay.meta?.status ?? "-"}
                </p>
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="font-semibold">{selectedDay.meta?.checkInTime ?? "-"}</p>

                <p className="mt-3 text-sm text-gray-500">Check-out</p>
                <p className="font-semibold">{selectedDay.meta?.checkOutTime ?? "-"}</p>

                <p className="mt-3 text-sm text-gray-500">Total Hours</p>
                <p className="font-semibold">{selectedDay.meta?.hours ?? 0} hrs</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
