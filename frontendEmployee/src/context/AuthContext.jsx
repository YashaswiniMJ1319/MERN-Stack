import { createContext, useContext, useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const registerEmployee = async (data) => {
    const res = await axiosInstance.post("/auth/register", data);
    return res.data;
  };

  const loginEmployee = async (data) => {
    const res = await axiosInstance.post("/auth/login", data);

    localStorage.setItem("token", res.data.token);
    setEmployee(res.data.employee);

    return res.data;
  };

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        employee,
        registerEmployee,
        loginEmployee,
        login: loginEmployee,  // ✅ alias for login
        user: employee,        // ✅ alias so Attendance.jsx doesn’t break
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
