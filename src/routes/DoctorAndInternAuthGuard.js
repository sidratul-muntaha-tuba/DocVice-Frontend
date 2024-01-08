import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const DoctorAndInternAuthGuard = ({ children }) => {
	const { auth } = useAuth();

	if (
		!(
			auth &&
			auth.token &&
			auth.user &&
			(auth.user.role === "DOCTOR" || auth.user.role === "INTERN")
		)
	) {
		return <Navigate to="/login" />;
	}

	return children;
};

export default DoctorAndInternAuthGuard;
