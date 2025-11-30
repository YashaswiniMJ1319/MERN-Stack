import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username.trim() === "") return setError("Username is required");
    if (password.length < 8) return setError("Password must be at least 8 characters");

    login(username);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#009688] to-[#00796B]">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#004D40] mb-6">
          Employee Login
        </h2>

        {error && <p className="text-red-600 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Username"
            className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-[#004D40]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-[#004D40]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-[#004D40] text-white py-2 rounded-lg font-semibold hover:bg-[#00332B] transition">
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-700">
          New employee?{" "}
          <Link to="/register" className="text-[#004D40] font-semibold">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
