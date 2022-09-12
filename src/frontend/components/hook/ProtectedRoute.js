import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useMetaMaskAuth from "./useMetaMaskAuth";

const ProtectedRoute = ({ children }) => {
  const auth = useMetaMaskAuth();
  const location = useLocation();
  return auth ? children : <Navigate to="/login"  state={{ from: location }} />;
};

export default ProtectedRoute;