import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiHome, FiUsers, FiCalendar, FiFileText, FiLogOut } from "react-icons/fi";

export default function ManagerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
    { name: "Employees", icon: <FiUsers />, path: "/employees" },
    { name: "Attendance", icon: <FiCalendar />, path: "/attendance-report" },
    { name: "Reports", icon: <FiFileText />, path: "/reports" },
  ];

  const logout = () => {
    localStorage.removeItem("managerAuth");
    navigate("/");
  };

  return (
    <div
      className={`h-screen bg-gradient-to-b from-[#1A237E] to-[#3949AB] text-white shadow-xl flex flex-col transition-all duration-300
      ${isOpen ? "w-64" : "w-20"}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Logo / Title */}
      <div className="p-5 font-bold text-xl flex items-center gap-3">
        <span className="bg-white/20 p-2 rounded-lg">M</span>
        {isOpen && <span>Manager</span>}
      </div>

      {/* Menu Items */}
      <ul className="flex-1 px-2 space-y-3 mt-4">
        {menu.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition
            ${location.pathname === item.path ? "bg-white text-[#1A237E] font-semibold shadow" : "hover:bg-white/20"}`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.name}</span>}
          </Link>
        ))}
      </ul>

      {/* Logout */}
      <button
        onClick={logout}
        className="m-4 bg-red-600 hover:bg-red-700 p-3 rounded-xl flex items-center gap-4 justify-center"
      >
        <FiLogOut className="text-xl" />
        {isOpen && <span>Logout</span>}
      </button>
    </div>
  );
}
