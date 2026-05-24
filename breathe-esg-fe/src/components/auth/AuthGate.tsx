import { Navigate, useLocation } from "react-router-dom";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
