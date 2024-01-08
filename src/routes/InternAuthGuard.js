import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

 // ensure this path is correct

const InternAuthGuard = ({ children }) => {
	const { auth } = useAuth();

	if (!(auth && auth.token && auth.user && auth.user.role === 'INTERN')) {
		return <Navigate to="/login" />;
	}

	return children;
};

export default InternAuthGuard;
