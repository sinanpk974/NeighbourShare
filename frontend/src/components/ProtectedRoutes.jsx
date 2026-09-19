import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    const currentTime = Date.now() / 1000;
    if (payload.exp && payload.exp < currentTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      return <Navigate to="/login" replace />;
    }

  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;