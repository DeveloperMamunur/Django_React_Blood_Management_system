import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const GuestRoute = ({ children }) => {
  const { currentUser, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;