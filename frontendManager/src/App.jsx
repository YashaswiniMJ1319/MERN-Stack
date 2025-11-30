import { BrowserRouter, Routes, Route } from "react-router-dom";
import ManagerLogin from "./pages/ManagerLogin";
import ManagerRegister from "./pages/ManagerRegister";
import ProtectedRoute from "./components/ProtectedRoute";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeList from "./pages/EmployeeList";
import EmployeeAttendance from "./pages/EmployeeAttendance";
import TeamSummary from "./pages/TeamSummary"; // <-- ADD THIS

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<ManagerLogin />} />
        <Route path="/register" element={<ManagerRegister />} />
        <Route path="/login" element={<ManagerLogin />} />

        {/* Protected Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeeList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <EmployeeAttendance />
            </ProtectedRoute>
          }
        />

        {/* ---- ADD THIS ROUTE ---- */}
        <Route
          path="/summary"
          element={
            <ProtectedRoute>
              <TeamSummary />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
