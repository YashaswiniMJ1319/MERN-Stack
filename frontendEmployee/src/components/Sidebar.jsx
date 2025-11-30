import { FiHome, FiUsers, FiLayers, FiCalendar, FiClock, FiBarChart, FiSettings, FiLogOut } from "react-icons/fi";
import { useState } from "react";

export default function Sidebar({ activePage, setActivePage }) {
  const [expanded, setExpanded] = useState(false);

  const menu = [
    { name: "Dashboard", key: "dashboard", icon: <FiHome /> },
    { name: "Profile", key: "profile", icon: <FiUsers /> },
    { name: "Leaves", key: "leaves", icon: <FiCalendar /> },
    { name: "Attendance", key: "attendance", icon: <FiClock /> },
    { name: "Attendance Report", key: "attendance-report", icon: <FiBarChart /> },
    { name: "Settings", key: "settings", icon: <FiSettings /> },
  ];

  return (
    <div
      className={`h-screen bg-[#004D40] text-white shadow-xl transition-all duration-300
      ${expanded ? "w-64" : "w-20"}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <h1 className={`font-bold mt-6 mb-10 text-center transition-all ${expanded ? "text-xl" : "text-sm"}`}>
        {expanded ? "Employee MS" : "EMS"}
      </h1>

      <nav className="space-y-2 px-3">
        {menu.map((item) => (
          <button
            key={item.key}
            onClick={() => setActivePage(item.key)}
            className={`flex items-center gap-4 p-3 rounded-lg w-full text-left cursor-pointer transition
            ${activePage === item.key ? "bg-[#009688]" : "hover:bg-[#00695C]"}`}
          >
            <span className="text-lg">{item.icon}</span>
            {expanded && item.name}
          </button>
        ))}
      </nav>

     
    </div>
  );
}
