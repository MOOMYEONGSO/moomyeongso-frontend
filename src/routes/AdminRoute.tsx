import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticatedUser, isAdminUser } from "../features/auth/api/tokenStore";
import { PATHS } from "../constants/path";

const AdminRoute = () => {
  if (!isAuthenticatedUser()) return <Navigate to={PATHS.LOGIN} replace />;
  if (!isAdminUser()) return <Navigate to={PATHS.HOME} replace />;
  return <Outlet />;
};

export default AdminRoute;