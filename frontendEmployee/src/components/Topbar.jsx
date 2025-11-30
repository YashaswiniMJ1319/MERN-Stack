import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-full h-16 bg-white shadow-md flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold text-gray-700">
        Welcome, {user?.name || "User"}
      </h2>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#004D40] text-white font-semibold hover:bg-[#00382F] transition">
      
        <FiLogOut />
        Logout
      </button>
    </div>
  );
}
