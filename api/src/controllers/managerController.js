import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

export const managerRegister = async (req, res) => {
  try {
    const { username, password } = req.body;

    const snap = await db.collection("managers").where("username", "==", username).get();
    if (!snap.empty) return res.status(400).json({ message: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const docRef = await db.collection("managers").add({
      username,
      password: hashed,
      createdAt: Date.now()
    });

    res.status(201).json({ message: "Manager registered successfully", id: docRef.id });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

export const managerLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const snap = await db.collection("managers").where("username", "==", username).get();
    if (snap.empty) return res.status(400).json({ message: "Invalid credentials" });

    const managerDoc = snap.docs[0];
    const data = managerDoc.data();

    const match = await bcrypt.compare(password, data.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: managerDoc.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login success", token });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};
