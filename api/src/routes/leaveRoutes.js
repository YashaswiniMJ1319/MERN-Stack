import express from "express";
import { getLeaves, applyLeave } from "../controllers/leaveController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protectRoute, getLeaves);
router.post("/apply", protectRoute, applyLeave);

export default router;
