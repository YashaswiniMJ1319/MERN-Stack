import { db } from "../config/db.js";

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
// Helper to calculate hours
const calculateHours = (inISO, outISO) => {
  const checkIn = new Date(inISO);
  const checkOut = new Date(outISO);
  const diff = (checkOut - checkIn) / (1000 * 60 * 60);
  return Math.round(diff * 100) / 100;
};

// Helper to convert ISO to IST label
const toIndiaLabel = (iso) => {
  return new Date(iso).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
};

// ✅ Check In
export const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];
    const nowISO = new Date().toISOString();

    const q = await db.collection("attendance")
      .where("userId", "==", userId)
      .where("date", "==", today)
      .limit(1)
      .get();

    if (!q.empty) {
      return res.status(400).json({ message: "Already checked in for today" });
    }

    const record = {
      userId,
      date: today,
      status: "Present",
      checkInTime: nowISO,
      checkInLabel: toIndiaLabel(nowISO),
      checkOutLabel: null,
      checkOutTime: null,
      hours: 0,
      createdAt: nowISO
    };

    // Save in Firestore
    await db.collection("attendance").add(record);

    return res.json({ message: "Check-in successful", record });
  } catch (error) {
    return res.status(500).json({ message: "Check-in failed", error: error.message });
  }
};

// ✅ Check Out
export const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];
    const nowISO = new Date().toISOString();
    const outLabel = toIndiaLabel(nowISO);

    const q = await db.collection("attendance")
      .where("userId", "==", userId)
      .where("date", "==", today)
      .limit(1)
      .get();

    if (q.empty) {
      return res.status(400).json({ message: "You must check in first" });
    }

    const doc = q.docs[0];
    const data = doc.data();

    const hours = calculateHours(data.checkInTime, nowISO);

    // Update in Firestore
    await db.collection("attendance").doc(doc.id).update({
      checkOutLabel: outLabel,
      checkOutTime: nowISO,
      hours,
      updatedAt: nowISO
    });

    return res.json({ message: "Check-out successful", record: { ...data, checkOutLabel: outLabel, hours } });
  } catch (error) {
    return res.status(500).json({ message: "Check-out failed", error: error.message });
  }
};

// ✅ Get Today Status
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
    const data = doc.data();

    return res.json({
      checkedIn: true,
      checkedOut: !!data.checkOutLabel,
      record: {
        date: data.date,
        status: data.status,
        checkInLabel: data.checkInLabel,
        checkOutLabel: data.checkOutLabel,
        hours: data.hours
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch status", error: error.message });
  }
};

// ✅ Get Attendance History
export const getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const snap = await db.collection("attendance")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const history = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch attendance history", error: error.message });
  }
};
