import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext"; // Import Context
import Unauthorized from "./Unauthorized";

const ProtectedRoute = ({ allowedRoles }) => {

  const { token, userType } = useAuthContext();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Ensure role is valid and lowercase for comparison
  const role = userType ? userType.toLowerCase() : "";

  if (!allowedRoles.includes(role)) {
    return <Unauthorized />;
  }

  return <Outlet />;
};

export default ProtectedRoute;