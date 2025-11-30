import express from "express";
import { managerRegister, managerLogin } from "../controllers/managerController.js";
import { getDashboardStats, getAttendance, teamSummary } from "../controllers/attendanceController.js";
import { managerProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", managerRegister);
router.post("/login", managerLogin);
router.get("/dashboard", managerProtect, getDashboardStats);
router.get("/attendance", managerProtect, getAttendance);
router.get("/team-summary", managerProtect, teamSummary);

export default router;
