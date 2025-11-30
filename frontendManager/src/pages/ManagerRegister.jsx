import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ManagerRegister() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword)
      return setError("Passwords do not match");

    localStorage.setItem("managerUser", JSON.stringify({ username, password }));
    alert("Registration Success");

    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A237E] to-[#0D47A1]">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#0D47A1] mb-6">
          Manager Register
        </h2>

        {error && <p className="text-red-600 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-2 border rounded-lg"
            type="text"
            placeholder="Enter Username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full p-2 border rounded-lg"
            type="password"
            placeholder="Enter Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            className="w-full p-2 border rounded-lg"
            type="password"
            placeholder="Confirm Password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button className="w-full bg-[#0D47A1] text-white py-2 rounded-lg font-semibold hover:bg-[#092E6A] transition">
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/" className="text-[#0D47A1] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
