import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("managerAuth");
  return isAuth ? children : <Navigate to="/" replace />;
}
