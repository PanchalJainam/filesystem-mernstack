import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // if no token → send user back to home
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // if token exists → allow route
  return <Outlet />;
};

export default ProtectedRoute;
