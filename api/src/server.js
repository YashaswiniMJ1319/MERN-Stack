import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import managerAuthRoutes from "./routes/managerRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/manager", managerAuthRoutes);

app.listen(5000, () => console.log("🚀 Backend running on port 5000"));
