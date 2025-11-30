import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [employee, setEmployee] = useState(null);

  const registerEmployee = async (data) => {
    const res = await axios.post("http://localhost:5000/api/auth/register", data);
    return res.data;
  };

  const loginEmployee = async (data) => {
    const res = await axios.post("http://localhost:5000/api/auth/login", data);
    localStorage.setItem("token", res.data.token);
    setEmployee(res.data.employee);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ employee, registerEmployee, loginEmployee }}>
      {children}
    </AuthContext.Provider>
  );
}
