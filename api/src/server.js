import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.listen(5000, () => console.log("Server running on port 5000"));
