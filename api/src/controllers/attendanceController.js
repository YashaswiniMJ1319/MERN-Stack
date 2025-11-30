import { db } from "../config/db.js";

/* ---------- Helpers ---------- */

// Convert IST local time string + date back to Date object for hour calculation
const parseIST = (dateStr, timeStr) => {
  const [hh, mm, ssPart] = timeStr.split(":");
  const ss = parseInt(ssPart);
  const period = timeStr.includes("PM") ? 12 : 0;
  const hours24 = ((parseInt(hh) % 12) + period) || 0;

  return new Date(`${dateStr}T${String(hours24).padStart(2, "0")}:${mm}:${String(ss).padStart(2, "0")}`);
};

// Calculate hours based on IST local strings
const calculateHoursIST = (dateStr, inTime, outTime) => {
  const checkIn = parseIST(dateStr, inTime);
  const checkOut = parseIST(dateStr, outTime);
  const diff = (checkOut - checkIn) / (1000 * 60 * 60);

  return Math.round(diff * 100) / 100;
};

// ✅ Get current IST local time string
const getISTTimeString = () => {
  return new Date().toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

/* ---------- APIs ---------- */

// ✅ Check-In
export const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const checkInIST = getISTTimeString();

    const q = await db.collection("attendance")
      .where("userId", "==", userId)
      .where("date", "==", today)
      .limit(1)
      .get();

    if (!q.empty) return res.status(400).json({ message: "Already checked in for today" });

    const record = {
      userId,
      date: today,
      status: "Present",
      checkInTime: checkInIST,
      checkOutTime: null,
      hours: 0,
      createdAt: new Date().toISOString(),
    };

    await db.collection("attendance").add(record);
    return res.json({ message: "Check-in successful", record });

  } catch (err) {
    return res.status(500).json({ message: "Check-in failed", error: err.message });
  }
};

// ✅ Check-Out
export const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];
    const checkOutIST = getISTTimeString();

    const q = await db.collection("attendance")
      .where("userId", "==", userId)
      .where("date", "==", today)
      .limit(1)
      .get();

    if (q.empty) return res.status(400).json({ message: "You must check in first" });

    const doc = q.docs[0];
    const r = doc.data();

    const workedHours = r.checkInTime
      ? calculateHoursIST(r.date, r.checkInTime, checkOutIST)
      : 0;

    await db.collection("attendance").doc(doc.id).update({
      checkOutTime: checkOutIST,
      hours: workedHours,
    });

    return res.json({
      message: "Check-out successful",
      record: { ...r, checkInTime: r.checkInTime, checkOutTime: checkOutIST, hours: workedHours },
    });

  } catch (err) {
    return res.status(500).json({ message: "Check-out failed", error: err.message });
  }
};

// ✅ Monthly data including summary (Main API for Report UI)
export const getMonthlyData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    if (!month || !year) return res.status(400).json({ message: "Month and year required" });

    const m = Number(month);
    const y = Number(year);
    const start = `${y}-${String(m).padStart(2, "0")}-01`;
    const daysInMonth = new Date(y, m, 0).getDate();
    const end = `${y}-${String(m).padStart(2, "0")}-${daysInMonth}`;

    const snap = await db.collection("attendance")
      .where("userId", "==", userId)
      .where("date", ">=", start)
      .where("date", "<=", end)
      .orderBy("date", "asc")
      .get();

    const records = snap.docs.map(d => {
      const r = d.data();
      const dayNum = r.date.split("-")[2];

      return {
        id: d.id,
        day: Number(dayNum),
        date: r.date,
        status: r.status.toLowerCase(),
        hours: r.hours,
        checkInTime: r.checkInTime || "-",
        checkOutTime: r.checkOutTime || "-",
        meta: r,
      };
    });

    // Summary build
    let present = 0, absent = 0, half = 0, totalHours = 0;
    snap.docs.forEach(d => {
      const r = d.data();
      if (r.status === "Present") present++;
      if (r.status === "Absent") absent++;
      if (r.status === "Half Day") half++;
      totalHours += r.hours || 0;
    });

    return res.json({
      records,
      summary: {
        present,
        absent,
        half,
        totalHours: Math.round(totalHours * 100) / 100,
      },
    });

  } catch (err) {
    return res.status(500).json({ message: "Failed to load monthly data", error: err.message });
  }
};

// ✅ Get Today Status (Aligned for frontend usage)
export const getTodayStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const q = await db.collection("attendance")
      .where("userId", "==", userId)
      .where("date", "==", today)
      .limit(1)
      .get();

    if (q.empty) {
      return res.json({ checkedIn: false, checkedOut: false, record: null });
    }

    const doc = q.docs[0];
    const r = doc.data();

    return res.json({
      checkedIn: true,
      checkedOut: !!r.checkOutTime,
      record: {
        date: r.date,
        status: r.status,
        checkInTime: r.checkInTime || "-",
        checkOutTime: r.checkOutTime || "-",
        hours: r.hours,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch today status", error: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const snap = await db.collection("attendance").get();
    const records = snap.docs.map(doc => doc.data());

    const today = new Date().toISOString().slice(0,10);

    const todayRecords = records.filter(r => r.date === today);
    const present = todayRecords.filter(x => x.status === "Present").length;
    const absent = todayRecords.filter(x => x.status === "Absent").length;
    const late = todayRecords.filter(x => x.status === "Late").length;

    res.json({ total: records.length, present, absent, late });
  } catch (err) {
    res.status(500).json({ message: "Failed", error: err.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { name, status, date } = req.query;
    const snap = await db.collection("attendance").get();
    let data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    if (name) data = data.filter(a => a.name.toLowerCase().includes(name.toLowerCase()));
    if (status) data = data.filter(a => a.status === status);
    if (date) data = data.filter(a => a.date === date);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

export const teamSummary = async (req, res) => {
  try {
    const snap = await db.collection("teams").get();
    const summary = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Failed", error: err.message });
  }
};