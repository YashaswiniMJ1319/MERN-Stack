// routes/attendanceRoutes.js
import express from "express";
import {
  checkIn,
  checkOut,
  getTodayStatus,
  getMonthlyData
} from "../controllers/attendanceController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/today-status", protectRoute, getTodayStatus);
router.post("/checkin", protectRoute, checkIn);
router.post("/checkout", protectRoute, checkOut);

// ✅ Necessary routes for report page

router.get("/month-data", protectRoute, getMonthlyData);

export default router;
