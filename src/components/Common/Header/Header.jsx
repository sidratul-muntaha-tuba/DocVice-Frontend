// src/components/common/Header.js

import React from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../../contexts/AuthContext";
import "./Header.scss";

const Header = () => {
	const { auth, logout } = useAuth();

	const isAdmin = auth?.user?.role === "ADMIN";
	const isPatient = auth?.user?.role === "PATIENT";
	const isDoctor = auth?.user?.role === "DOCTOR";
	const isIntern = auth?.user?.role === "INTERN";

	return (
		<header className="app-header">
			<div className="container">
				<Link to="/" className="app-title">
					Docvice
				</Link>
				<nav className="app-nav">
					<ul>
						{auth && auth.token && auth.user && (
							<ul>
								<li>
									<Link to="/">Home</Link>
								</li>
								{isPatient && (
									<li>
										<Link to="/questions">Questions</Link>
									</li>
								)}
								{(isDoctor || isIntern) && (
									<li>
										<Link to="/suggestions">Suggestions</Link>
									</li>
								)}
								{isDoctor && (
									<li>
										<Link to="/doctor-schedule">Schedule</Link>
									</li>
								)}
								<li>
									<Link to="/doctors">Doctors</Link>
								</li>
								{isPatient && (
									<li>
										<Link to="/appointments">Appointments</Link>
									</li>
								)}
								{isAdmin && (
									<>
										<li>
											<Link to="/add-health-tips">Tips</Link>
										</li>
										<li>
											<Link to="/approve-users">Approvals</Link>
										</li>
									</>
								)}
								<li className="profile-button">
									<Link to={`/profile`}>
										<img src={auth.user.picture} alt={auth.user.name} />
									</Link>
								</li>
								<li className="logout-button">
									<button onClick={() => logout()}>Logout</button>
								</li>
							</ul>
						)}
						{!(auth && auth.token && auth.user) && (
							<>
								<li>
									<Link to="/login">Login</Link>
								</li>
								<li>
									<Link to="/register">Register</Link>
								</li>
							</>
						)}
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Header;
