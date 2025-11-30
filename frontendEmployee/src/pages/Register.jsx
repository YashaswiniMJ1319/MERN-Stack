import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      register(formData.name);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#009688] to-[#00796B]">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-center text-[#004D40] mb-6">
          Create Employee Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border p-2 rounded-lg"
            type="text"
            placeholder="Full Name"
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <input
            className="w-full border p-2 rounded-lg"
            type="email"
            placeholder="Email Address"
            required
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

          <input
            className="w-full border p-2 rounded-lg"
            type="tel"
            placeholder="Phone Number"
            required
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}

          <input
            className="w-full border p-2 rounded-lg"
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}

          <input
            className="w-full border p-2 rounded-lg"
            type="password"
            placeholder="Confirm Password"
            required
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
          )}

          <button className="w-full bg-[#004D40] text-white py-2 rounded-lg font-semibold hover:bg-[#00332B] transition">
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-700">
          Already registered?{" "}
          <Link to="/" className="text-[#004D40] font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
