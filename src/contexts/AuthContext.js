import React, { createContext, useState, useContext, useEffect } from "react";

// Initialize context with undefined to avoid direct access without Provider
// const AuthContext = createContext(undefined);
const AuthContext = createContext({
	auth: {
		token: localStorage.getItem("token") || null,
		user: JSON.parse(localStorage.getItem("user")) || null,
	},
	login: (token, user) => {},
	logout: () => {},
});

export const useAuth = () => {
	// Ensure useAuth is used within AuthProvider
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

const AuthProvider = ({ children }) => {
	// Initialize state from localStorage to persist login state
	const [auth, setAuth] = useState({
		token: localStorage.getItem("token"),
		user: JSON.parse(localStorage.getItem("user")),
	});

	// Login updates both the state and the localStorage
	const login = (token, user) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));
		setAuth({ token, user });
	};

	// Logout should clear the state and localStorage
	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setAuth({ token: null, user: null });
	};

	// Effect hook to listen for changes in localStorage
	useEffect(() => {
		const handleStorageChange = (e) => {
			if (e.key === "token" || e.key === "user") {
				setAuth({
					token: localStorage.getItem("token"),
					user: JSON.parse(localStorage.getItem("user")),
				});
			}
		};

		// Add event listener for local storage
		window.addEventListener("storage", handleStorageChange);

		// Remove event listener on cleanup
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	return (
		<AuthContext.Provider value={{ auth, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthProvider };
