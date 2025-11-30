import { BrowserRouter, Routes, Route } from "react-router-dom";
import ManagerLogin from "./pages/ManagerLogin";
import ManagerRegister from "./pages/ManagerRegister";
import ProtectedRoute from "./components/ProtectedRoute";
import ManagerDashboard from "./pages/ManagerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ManagerLogin />} />
        <Route path="/register" element={<ManagerRegister />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
