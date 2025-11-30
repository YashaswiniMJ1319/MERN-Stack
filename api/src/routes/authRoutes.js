import express from "express";
import { register, login, me, changePassword } from "../controllers/authController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protectRoute, me);

// ✅ new route added
router.post("/change-password", protectRoute, changePassword);

export default router;
