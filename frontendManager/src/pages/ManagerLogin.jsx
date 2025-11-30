import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";  // ⭐ Added

export default function ManagerLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/manager/login", {
        username,
        password,
      });

      // Save token to localStorage for protected routes
      localStorage.setItem("managerToken", res.data.token);

      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A237E] to-[#3949AB]">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center text-[#1A237E] mb-6">
          Manager Login
        </h2>

        {error && <p className="text-red-600 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-2 border rounded-lg"
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            className="w-full p-2 border rounded-lg"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-[#1A237E] text-white py-2 rounded-lg font-semibold hover:bg-[#151B60] transition">
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-700">
          New Manager?{" "}
          <Link to="/register" className="text-[#1A237E] font-semibold hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
