import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

 // ensure this path is correct

const PatientAuthGuard = ({ children }) => {
	const { auth } = useAuth();

	if (!(auth && auth.token && auth.user && auth.user.role === 'PATIENT')) {
		return <Navigate to="/login" />;
	}

	return children;
};

export default PatientAuthGuard;
