import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const exists = await Employee.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      name,
      email,
      phone,
      password: hashed
    });

    res.json({ message: "Registration successful", employee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, employee.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful", token, employee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const me = async (req, res) => {
  res.json(req.user);
};
