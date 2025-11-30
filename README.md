# 👔 Employee & Manager Attendance System (MERN)

A full-stack Attendance Management System built using the MERN stack with role-based dashboards for employees and managers. All attendance logs are stored in IST local time for accurate check‑in/check‑out display.

## ✨ Features

- Employee Login/Register authentication
- Check‑in/Check‑out stored in **IST (Asia/Kolkata)**
- Monthly attendance **Heatmap calendar**
- Monthly summary (Present/Absent/Half Days + Total Hours)
- Daily working hours **Bar chart**
- Protected routes using Context API + JWT
- Manager dashboard to track team attendance
- Docker infrastructure support

## 🧰 Tech Stack

| Component | Tech Used |
|---|---|
| Frontend (Employee) | React (Vite) + TailwindCSS |
| Frontend (Manager)  | React (Vite) + TailwindCSS |
| Backend | Node.js + Express.js |
| Database | Firestore Admin SDK / MongoDB |
| Networking | Axios |
| State | Context API |

## 📁 Folder Structure

```
MERN‑Stack/
├── api/ → Backend
├── frontendEmployee/ → Employee UI
├── frontendManager/ → Manager UI
└── infra/docker/ → Docker support
```

## 🚀 Setup (Windows)

```
git clone <repo-link>
cd api && npm install && node server.js
cd frontendEmployee && npm install && npm run dev
cd frontendManager && npm install && npm run dev
```

## 🔒 Security Note

Do **NOT** commit `.env`, API keys, or service account JSON files. Use `.gitignore` to protect secrets.
