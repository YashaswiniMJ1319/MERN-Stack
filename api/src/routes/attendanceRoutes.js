import express from "express";
const router = express.Router();

// temporary test route to stop crash
router.get("/", (req, res) => {
  res.send("Attendance routes working...");
});

export default router;
