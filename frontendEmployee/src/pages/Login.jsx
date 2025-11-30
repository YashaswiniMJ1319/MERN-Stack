import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx"; // Added .jsx extension
import axiosInstance from "../utils/axiosInstance.js"; // Added .js extension

export default function Login() {
  const { loginEmployee } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) return setError("Invalid Email Format");

    setLoading(true);
    try {
      // Call the backend API
      const res = await axiosInstance.post("/auth/login", { email, password });
      
      // Pass the token and employee data to the login function
      await loginEmployee({ email, password });

      
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#009688] to-[#00796B]">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#004D40] mb-6">
          Employee Login
        </h2>

        {error && <p className="text-red-600 text-center mb-3 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-[#004D40]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <button 
            disabled={loading}
            className={`w-full bg-[#004D40] text-white py-2 rounded-lg font-semibold transition ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#00332B]'}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-700">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#004D40] font-bold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}