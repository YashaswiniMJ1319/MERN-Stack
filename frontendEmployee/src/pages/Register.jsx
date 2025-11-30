import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js"; // Added .js extension

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid Email Format";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/.test(formData.password)
    )
      newErrors.password =
        "Password must include uppercase, lowercase, number & special char";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Destructure to exclude confirmPassword before sending to API
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...apiData } = formData;
      
      await axiosInstance.post("/auth/register", apiData);
      
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error || "Registration failed. Please try again.";
      setErrors({ ...errors, api: serverMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#009688] to-[#00796B] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#004D40] mb-6">
          Employee Register
        </h2>

        {errors.api && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
            {errors.api}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              className="w-full border p-2 rounded-lg focus:outline-none focus:border-[#004D40]"
              type="text"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              className="w-full border p-2 rounded-lg focus:outline-none focus:border-[#004D40]"
              type="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              className="w-full border p-2 rounded-lg focus:outline-none focus:border-[#004D40]"
              type="tel"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <input
              className="w-full border p-2 rounded-lg focus:outline-none focus:border-[#004D40]"
              type="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              className="w-full border p-2 rounded-lg focus:outline-none focus:border-[#004D40]"
              type="password"
              placeholder="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button 
            disabled={loading}
            className={`w-full bg-[#004D40] text-white py-2 rounded-lg font-semibold transition ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#00332B]'}`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-700">
          Already registered?{" "}
          <Link to="/login" className="text-[#004D40] font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}