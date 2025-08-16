import { Route, Routes, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { AdminApplications } from "./pages/AdminApplications";

const getUserRole = (): "ADMIN" | "USER" | null => {
  return localStorage.getItem("role") as "ADMIN" | "USER" | null;
};

function App() {
  const role = getUserRole();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/admin/applications"
        element={
          role === "ADMIN" ? <AdminApplications /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/user"
        element={role === "USER" ? <UserDashboard /> : <Navigate to="/login" />}
      />

      <Route
        path="/dashboard"
        element={
          role === "ADMIN" ? (
            <Navigate to="/admin" />
          ) : role === "USER" ? (
            <Navigate to="/user" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
