import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

export const managerProtect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No Token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.manager = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized - No Token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userSnap = await db.collection("employees").doc(decoded.id).get();
    if (!userSnap.exists) return res.status(401).json({ message: "Unauthorized - Invalid User" });

    req.user = { id: userSnap.id, ...userSnap.data() };
    req.user.id = userSnap.id; // alias for frontend `user`
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};
