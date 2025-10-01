import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user[0].role)) {
    return <Navigate to="/register" replace />;
  }
  return children;
};

export default ProtectedRoute;
