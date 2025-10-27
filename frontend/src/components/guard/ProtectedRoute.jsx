import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ roles }) {
    const { currentUser, isAuthLoading } = useAuth();
    const location = useLocation();

    if(isAuthLoading){
        return null;
    }

    if (!currentUser) {
        const nextUrl = location.pathname + location.search;
        return <Navigate to={`/login?next=${encodeURIComponent(nextUrl)}`} replace />;
    }

    if (roles && !roles.includes(currentUser.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}