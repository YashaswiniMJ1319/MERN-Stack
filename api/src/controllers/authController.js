import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userSnapshot = await db.collection("employees").where("email", "==", email).get();
    if (!userSnapshot.empty) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newEmployee = { name, email, phone, password: hashed, createdAt: Date.now() };
    const docRef = await db.collection("employees").add(newEmployee);

    res.status(201).json({
      message: "Registration successful",
      employee: { name, email, phone, id: docRef.id },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userSnapshot = await db.collection("employees").where("email", "==", email).get();
    if (userSnapshot.empty) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const employeeDoc = userSnapshot.docs[0];
    const employeeData = employeeDoc.data();

    const isMatch = await bcrypt.compare(password, employeeData.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: employeeDoc.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const employeeSafe = { name: employeeData.name, email: employeeData.email, phone: employeeData.phone, id: employeeDoc.id };

    res.json({ message: "Login successful", token, employee: employeeSafe });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const me = async (req, res) => {
  res.json(req.user);
};
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const userSnap = await db.collection("employees").doc(userId).get();
    if (!userSnap.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const employee = userSnap.data();

    const match = await bcrypt.compare(oldPassword, employee.password);
    if (!match) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await db.collection("employees").doc(userId).update({ password: hashedNew });

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};