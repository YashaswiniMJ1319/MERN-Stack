// src/pages/AttendanceReport.jsx
import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/*
  AttendanceReport.jsx
  - GitHub-style heatmap (custom)
  - animated colors, modal detail on click
  - right-side summary card
  - bar chart using recharts
*/

/* ---------- Helper Modal (inline small component) ---------- */
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

/* ---------- Sample Data Generator for the month ---------- */
/* returns object keyed by yyyy-mm-dd -> { status, checkIn, checkOut, hours } */
function generateSampleMonth(year, monthZeroIndex) {
  // monthZeroIndex: 0..11
  const daysInMonth = new Date(year, monthZeroIndex + 1, 0).getDate();
  const data = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, monthZeroIndex, d);
    const key = dateToKey(date); // yyyy-mm-dd

    // simple deterministic pseudo-random for demo
    const rand = (d * (monthZeroIndex + 3) * (year % 100)) % 7;
    if (rand === 0) {
      // absent
      data[key] = { status: "absent", checkIn: null, checkOut: null, hours: 0 };
    } else if (rand === 1) {
      // half day
      data[key] = {
        status: "half",
        checkIn: "11:15 AM",
        checkOut: "03:00 PM",
        hours: 3.75,
      };
    } else {
      // present
      const inH = 9 + (rand % 2); // 9 or 10
      const outH = 17 - (rand % 2); // 17 or 16
      const checkIn = `${String(inH).padStart(2, "0")}:0${rand % 6} AM`;
      const checkOut = `${String(outH).padStart(2, "0")}:3${rand % 6} PM`;
      const hours = Math.max(0, outH - inH + 0.5);
      data[key] = {
        status: "present",
        checkIn,
        checkOut,
        hours,
      };
    }
  }
  return data;
}

function dateToKey(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/* ---------- Color map and label ---------- */
const STATUS_COLOR = {
  present: "#16A34A", // green
  absent: "#EF4444", // red
  half: "#F59E0B", // yellow
  weekend: "#60A5FA", // blue
  empty: "#E6E6E6", // light
};

const STATUS_LABEL = {
  present: "Present",
  absent: "Absent",
  half: "Half Day",
  weekend: "Weekend/Holiday",
};

/* ---------- Main Component ---------- */
export default function AttendanceReport() {
  // choose the year and month to display (sample: current month)
  const today = new Date();
  const [year] = useState(today.getFullYear());
  const [monthZeroIndex, setMonthZeroIndex] = useState(today.getMonth()); // 0..11
  const [selectedDay, setSelectedDay] = useState(null);

  // sample dataset (in real app you'll fetch from backend)
  const monthData = useMemo(
    () => generateSampleMonth(year, monthZeroIndex),
    [year, monthZeroIndex]
  );

  // Prepare heatmap cells as array of { key, dateObj, status }
  const heatmapCells = useMemo(() => {
    const firstDay = new Date(year, monthZeroIndex, 1);
    const daysInMonth = new Date(year, monthZeroIndex + 1, 0).getDate();
    const cells = [];
    // we want to show a 7-column (Mon-Sun) style grid starting from Monday visually
    const startWeekday = (firstDay.getDay() + 6) % 7; // convert Sun=0 → 6, Mon=0.. so Monday-start
    // add leading blanks
    for (let i = 0; i < startWeekday; i++) {
      cells.push({ empty: true, key: `blank-${i}` });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, monthZeroIndex, d);
      const key = dateToKey(dt);
      // mark weekends
      const wkday = dt.getDay(); // 0 Sunday .. 6 Saturday
      let status = monthData[key]?.status ?? "absent"; // fallback absent for missing
      if (wkday === 0 || wkday === 6) {
        // weekend - but if data has present override weekend label with weekend color but retain status
        status = monthData[key] ? monthData[key].status : "weekend";
      }
      cells.push({
        empty: false,
        key,
        day: d,
        status,
        meta: monthData[key] ?? null,
      });
    }
    return cells;
  }, [year, monthZeroIndex, monthData]);

  // derive summary
  const summary = useMemo(() => {
    let present = 0,
      absent = 0,
      half = 0,
      weekend = 0,
      totalHours = 0;
    Object.entries(monthData).forEach(([k, v]) => {
      if (v.status === "present") {
        present++;
        totalHours += v.hours ?? 0;
      } else if (v.status === "half") {
        half++;
        totalHours += v.hours ?? 0;
      } else if (v.status === "absent") {
        absent++;
      } else if (v.status === "weekend") {
        weekend++;
      }
    });
    return {
      present,
      absent,
      half,
      weekend,
      totalHours: Math.round(totalHours * 100) / 100,
    };
  }, [monthData]);

  // chart data: days -> hours (for present/half)
  const chartData = useMemo(() => {
    const arr = [];
    const daysInMonth = new Date(year, monthZeroIndex + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${year}-${String(monthZeroIndex + 1).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;
      const meta = monthData[dateKey];
      arr.push({
        day: d.toString(),
        hours: meta?.hours ?? 0,
        status: meta?.status ?? "absent",
      });
    }
    return arr;
  }, [year, monthZeroIndex, monthData]);

  /* --- handlers --- */
  const onDayClick = (cell) => {
    if (cell.empty) return;
    setSelectedDay(cell);
  };

  const closeModal = () => setSelectedDay(null);

  const monthLabel = new Date(year, monthZeroIndex).toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  /* animate small legend counts (simple) */
  const animatedNumber = (n) => n; // placeholder for nicer animation (could use react-spring)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-[#004D40] mb-6">
        Attendance Report — {monthLabel}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: heatmap + legend */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">Monthly Heatmap</div>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-sm" style={{ background: STATUS_COLOR.present }} />
                Present
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-sm" style={{ background: STATUS_COLOR.half }} />
                Half
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-sm" style={{ background: STATUS_COLOR.absent }} />
                Absent
              </div>
            </div>
          </div>

          {/* week day labels */}
          <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
              <div key={w} className="text-center">{w}</div>
            ))}
          </div>

          {/* heatmap grid */}
          <div className="grid grid-cols-7 gap-2">
            {heatmapCells.map((cell) => {
              if (cell.empty) {
                return <div key={cell.key} className="w-9 h-9 rounded transition-colors" />;
              }
              // show color based on status
              const color = cell.status === "weekend" ? STATUS_COLOR.weekend : STATUS_COLOR[cell.status] ?? STATUS_COLOR.empty;

              return (
                <button
                  key={cell.key}
                  onClick={() => onDayClick(cell)}
                  className="w-9 h-9 rounded flex items-center justify-center text-xs font-medium transition transform hover:scale-105"
                  style={{
                    background: color,
                    boxShadow: cell.status !== "absent" ? "inset 0 -6px rgba(0,0,0,0.08)" : "none",
                    border: "1px solid rgba(0,0,0,0.06)",
                    color: "#fff",
                  }}
                  title={`${cell.day} — ${STATUS_LABEL[cell.status] ?? cell.status}`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* small caption */}
          <p className="mt-4 text-sm text-gray-600">
            Click a day to view details. Colors are auto-generated from sample data for demo.
          </p>
        </div>

        {/* Right: Summary card */}
        <div className="w-full lg:w-80 bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-[#004D40]">Monthly Summary</h2>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm" style={{ background: STATUS_COLOR.present }} />
                <div>Present</div>
              </div>
              <div className="font-semibold">{animatedNumber(summary.present)}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm" style={{ background: STATUS_COLOR.absent }} />
                <div>Absent</div>
              </div>
              <div className="font-semibold">{animatedNumber(summary.absent)}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm" style={{ background: STATUS_COLOR.half }} />
                <div>Half Days</div>
              </div>
              <div className="font-semibold">{animatedNumber(summary.half)}</div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t mt-2">
              <div className="text-sm text-gray-600">Total Hours</div>
              <div className="text-lg font-bold text-[#004D40]">{summary.totalHours} hrs</div>
            </div>
          </div>

          {/* simple month selector */}
          <div className="mt-4">
            <label className="text-sm text-gray-500">Month</label>
            <select
              value={monthZeroIndex}
              onChange={(e) => setMonthZeroIndex(Number(e.target.value))}
              className="mt-2 w-full border rounded px-3 py-2"
            >
              {Array.from({ length: 12 }).map((_, i) => {
                const d = new Date(year, i);
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

      {/* Graph section */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h3 className="text-lg font-semibold text-[#004D40] mb-3">Working Hours — Daily</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#009688" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal for day details */}
      <Modal open={!!selectedDay} onClose={closeModal}>
        {selectedDay && (
          <>
            <h3 className="text-xl font-bold mb-4">{monthLabel(selectedDay.key)}</h3>

            <div className="flex gap-6">
              <div className="flex-1">
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">{selectedDay.key}</p>

                <p className="mt-3 text-sm text-gray-500">Status</p>
                <p className="font-semibold">{STATUS_LABEL[selectedDay.status] ?? selectedDay.status}</p>
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="font-semibold">{selectedDay.meta?.checkIn ?? "-"}</p>

                <p className="mt-3 text-sm text-gray-500">Check-out</p>
                <p className="font-semibold">{selectedDay.meta?.checkOut ?? "-"}</p>

                <p className="mt-3 text-sm text-gray-500">Total hours</p>
                <p className="font-semibold">{selectedDay.meta?.hours ?? 0} hrs</p>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

/* ---------- small helper to format label in modal header ---------- */
function monthLabel(dateKey) {
  // dateKey format yyyy-mm-dd
  const [y, m] = dateKey.split("-");
  const d = new Date(Number(y), Number(m) - 1);
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}
