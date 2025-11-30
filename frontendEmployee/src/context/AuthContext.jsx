import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username) => {
    const fakeUser = {
      name: username,
      empId: "emp112",
      dob: "09/4/2024",
      gender: "Male",
      department: "IT",
      maritalStatus: "Single",
    };

    setUser(fakeUser);
    localStorage.setItem("user", JSON.stringify(fakeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
