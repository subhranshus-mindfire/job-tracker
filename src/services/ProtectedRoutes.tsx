import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "employer" | "applicant";
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(user, !user)
  if (!user) {
    return <Navigate to="/unauthenticated" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
