import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  // use `user` as your main state (already used in your app)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // ✅ Register (don’t change)
  const registerEmployee = async (data) => {
    const res = await axiosInstance.post("/auth/register", data);
    return res.data;
  };

  // ✅ Login (use real backend employee as user)
  const loginEmployee = async (data) => {
    const res = await axiosInstance.post("/auth/login", data);

    localStorage.setItem("token", res.data.token);
    setUser(res.data.employee); // ✅ set user, not undefined employee

    return res.data;
  };

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        employee: user,         // alias so UI shows welcome name
        registerEmployee,
        loginEmployee,
        login: loginEmployee,  // required alias ✅
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
