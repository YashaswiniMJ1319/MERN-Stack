import { db } from "../config/db.js";

export const getLeaves = async (req, res) => {
  try {
    const snap = await db.collection("leaves").where("userId", "==", req.user.id).get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leaves", error: err.message });
  }
};

export const applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, type, reason, days } = req.body;

    const leaveRecord = { userId: req.user.id, from: fromDate, to: toDate, type, reason, days, status: "Pending", createdAt: new Date().toISOString() };

    await db.collection("leaves").add(leaveRecord);
    res.json({ message: "Leave application submitted", leave: leaveRecord });
  } catch (err) {
    res.status(500).json({ message: "Leave apply failed", error: err.message });
  }
};
