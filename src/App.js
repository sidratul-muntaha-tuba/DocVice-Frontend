import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./App.css";
import Footer from "./components/Common/Footer/Footer";
import Header from "./components/Common/Header/Header";
import AddHealthTipsPage from "./containers/AddHealthTipsPage/AddHealthTipsPage";
import AdminApproveUsersPage from "./containers/AdminApprovesUsersPage/AdminApproveUsersPage";
import AppointmentPage from "./containers/AppointmentPage/AppointmentPage";
import DoctorPage from "./containers/DoctorPage/DoctorPage";
import DoctorSchedulePage from "./containers/DoctorSchedulePage/DoctorSchedulePage";
import ErrorPage from "./containers/ErrorPage/ErrorPage";
import Home from "./containers/Home/Home";
import Login from "./containers/LoginPage/Login";
import ProfilePage from "./containers/ProfilePage/ProfilePage";
import PatientQueries from "./containers/Query/PatientQueries";
import Register from "./containers/RegisterPage/Register";
import { AuthProvider } from "./contexts/AuthContext";
import AdminAuthGuard from "./routes/AdminAuthGuard";
import DoctorAndInternAuthGuard from "./routes/DoctorAndInternAuthGuard";
import AuthGuard from "./routes/AuthGuard";
import PatientAuthGuard from "./routes/PatientAuthGuard";
import Doctor from "./components/Doctors/Doctor/Doctor";
function App() {
	return (
		<div className="main">
			<Router>
				<AuthProvider>
					<Header />
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route
							path="/questions"
							element={
								<PatientAuthGuard>
									<PatientQueries />
								</PatientAuthGuard>
							}
						/>
						<Route
							path="/suggestions"
							element={
								<DoctorAndInternAuthGuard>
									<PatientQueries />
								</DoctorAndInternAuthGuard>
							}
						/>
						<Route
							path="/doctors"
							element={
								<AuthGuard>
									<DoctorPage />
								</AuthGuard>
							}
						/>
						<Route
							path="/doctors/:doctorId"
							element={
								<AuthGuard>
									<Doctor />
								</AuthGuard>
							}
						/>
						<Route
							path="/appointments"
							element={
								<PatientAuthGuard>
									<AppointmentPage />
								</PatientAuthGuard>
							}
						/>
						<Route
							path="/doctor-schedule"
							element={
								<AuthGuard>
									<DoctorSchedulePage />
								</AuthGuard>
							}
						/>
						<Route
							path="/add-health-tips"
							element={
								<AdminAuthGuard>
									<AddHealthTipsPage />
								</AdminAuthGuard>
							}
						/>
						<Route
							path="/approve-users"
							element={
								<AdminAuthGuard>
									<AdminApproveUsersPage />
								</AdminAuthGuard>
							}
						/>
						<Route
							path="/profile"
							element={
								<AuthGuard>
									<ProfilePage />
								</AuthGuard>
							}
						/>
						<Route
							path="/"
							element={
								<AuthGuard>
									<Home />
								</AuthGuard>
							}
						/>
						<Route path="*" element={<ErrorPage />} />
					</Routes>
				</AuthProvider>
			</Router>
			<Footer />
		</div>
	);
}

export default App;
