import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

    // Get user from context
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>
    }

    // Redirect to login if user is not logged in
    if (!user) {
        return <Navigate to="/user/login" replace />
    }

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute