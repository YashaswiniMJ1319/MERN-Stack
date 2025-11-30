import express from "express";
import { checkIn, checkOut, getTodayStatus, getAttendanceHistory } from "../controllers/attendanceController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes here require login
router.get("/today-status", protectRoute, getTodayStatus);
router.get("/history", protectRoute, getAttendanceHistory);
router.post("/checkin", protectRoute, checkIn);
router.post("/checkout", protectRoute, checkOut);

export default router;