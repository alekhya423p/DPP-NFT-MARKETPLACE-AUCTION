import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hook/useAuth";

const PublicRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  if (auth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }else {
    return children;
  }

};

export default PublicRoute;