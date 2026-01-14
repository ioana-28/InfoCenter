import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "ADMIN") {
        return <Navigate to="/admin/dashboard" replace />;
    } else {
        return <Navigate to="/student/chat" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
