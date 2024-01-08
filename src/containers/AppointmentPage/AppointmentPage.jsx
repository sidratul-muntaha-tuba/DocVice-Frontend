import React, { useEffect, useRef, useState } from "react";
import AppointmentList from "../../components/Appointment/AppointmentList";
import { useAuth } from "../../contexts/AuthContext";
import {
	createAppointment,
	getAppointmentsForAPatient,
	getAvailableDoctorsForToday,
	getTheDetailedAppointmentInfo,
	sendMail,
} from "../../services/apiService";
import "./AppointmentPage.scss";

const AppointmentPage = () => {
	const { auth } = useAuth();
	const userId = auth.user.id;

	const [appointments, setAppointments] = useState([]);
	const [selectedOption, setSelectedOption] = useState(null);
	const [availableDoctors, setAvailableDoctors] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedDoctorId, setSelectedDoctorId] = useState(null);
	const [error, setError] = useState(null);
	const selectedDoctorRef = useRef(null);

	useEffect(() => {
		fetchAvailableDoctors();
		fetchAppointments();
	}, []);

	const handleTakeAppointment = async () => {
		if (!selectedDoctorId) {
			alert("Doctor Not Selected Properly...");
			return;
		}
		if (!userId) {
			alert("There were some issues. Please try again after sometimes...");
			return;
		}

		const appointmentData = {
			patientIdPassed: userId,
			doctorIdPassed: selectedDoctorId,
			date: new Date(),
			status: "booked",
		};

		try {
			const newAppointment = await createAppointment(appointmentData);
			if (newAppointment) {
				const newAppointmentId = newAppointment.id;
				const appointmentInfo = await getTheDetailedAppointmentInfo(
					newAppointmentId
				);
				if (appointmentInfo) {
					const patientName = appointmentInfo.Patient.User.name;
					const patientEmail = appointmentInfo.Patient.User.email;
					const doctorName = appointmentInfo.Doctor.User.name;
					const doctorSpeciality = appointmentInfo.Doctor.specialization;
					const doctorEmail = appointmentInfo.Doctor.User.email;
					const doctorContactNumber = appointmentInfo.Doctor.contactNumber;
					const appointmentStatus = appointmentInfo.status;
					const appointmentDate = appointmentInfo.date;
					const patientMailSubject =
						`Appointment ${appointmentStatus}`.toUpperCase();
					const doctorMailSubject =
						`New Appointment ${appointmentStatus} on ${new Date(
							appointmentDate
						).toLocaleString()}`.toUpperCase();
					const patientMailIntro = `You have an appointment with ${doctorName}, ${doctorSpeciality} on ${new Date(
						appointmentDate
					).toLocaleString()}. You can contact the Doctor in WhatsApp with the contact-number : ${doctorContactNumber} or you can connect through the mail ${doctorEmail}.`;
					const doctorMailIntro = `You have an appointment with ${patientName} on ${new Date(
						appointmentDate
					).toLocaleString()}. The Patient will be reaching you just before the appoinment time and can be reached by ${patientEmail}.`;
					const patientMailOutro = `Thank you for choosing DocVice. For Any Details you can contact the emergency number +8801580889226.`;
					const doctorMailOutro = `Thank you for staying with DocVice. For Any Issues you can contact the emergency number +8801580889226.`;
					const responseFromSendingMailPatient = await sendMail(
						patientName,
						patientEmail,
						patientMailSubject,
						patientMailIntro,
						patientMailOutro
					);
					const responseFromSendingMailDoctor = await sendMail(
						doctorName,
						doctorEmail,
						doctorMailSubject,
						doctorMailIntro,
						doctorMailOutro
					);
					if (responseFromSendingMailPatient) {
						if (responseFromSendingMailDoctor) {
							alert(
								"New appointment created successfully! Soon you will be receiving an email and also your doctor..."
							);
						} else {
							alert(
								"New appointment created successfully! Soon you will be receiving an email..."
							);
						}
					} else {
						alert("New appointment created successfully!");
					}
				} else {
					alert("New appointment created successfully!");
				}
				fetchAppointments();
				fetchAvailableDoctors();
			}
		} catch (error) {
			// alert(
			// 	"There was some problem while setting the appointment. Please try again after some time..."
			// );
		}
	};

	const handleOptionChange = (passedDoctorId) => {
		setSelectedDoctorId(parseInt(passedDoctorId));
		const selectedDoctor = availableDoctors.find(
			(doctor) => doctor.id === parseInt(passedDoctorId)
		);
		setSelectedOption(selectedDoctor);
	};

	const fetchAppointments = async () => {
		setIsLoading(true);
		try {
			const data = await getAppointmentsForAPatient(userId);
			setAppointments(data);
		} catch (error) {
			setError(error.message);
		}
		setIsLoading(false);
	};

	const fetchAvailableDoctors = async () => {
		setIsLoading(true);
		try {
			const data = await getAvailableDoctorsForToday(userId);
			setAvailableDoctors(data);
			return data;
		} catch (error) {
			setError(error.message);
		}
		setIsLoading(false);
		return null;
	};

	useEffect(() => {
		fetchAvailableDoctors();
		fetchAppointments();
	}, []);

	return (
		<div className="appointment-page">
			<h1>Your Appointments</h1>
			{isLoading ? (
				<div>Loading...</div>
			) : error ? (
				<div>Error: {error}</div>
			) : (
				<>
					<div>
						<h3>New Appointment for TODAY !</h3>
						{availableDoctors && availableDoctors.length ? (
							<div>
								<br />
								<label htmlFor="dynamicOptions">Select an option: </label>
								<select
									ref={selectedDoctorRef}
									id="dynamicOptions"
									value={selectedDoctorId || ""}
									onChange={(e) => handleOptionChange(e.target.value)}>
									<option value="">Choose your doctor</option>
									{availableDoctors.map((doctor) => (
										<option key={doctor.id} value={doctor.id}>
											{doctor.User.name + " - " + doctor.specialization}
										</option>
									))}
								</select>
								{selectedOption && (
									<div>
										<br />
										<br />
										<p>
											Selected Doctor:{" "}
											<strong>{selectedOption.User.name}</strong>
										</p>
										<br />
										<small>
											This is a realtime appointment selection process. So
											please make sure that you proceed fast, else today's slots
											may get filled...
										</small>
										<br />
										<br />
										<h4>Scheduled Times</h4>
										<br />
										{selectedOption.DoctorSchedule &&
										selectedOption.DoctorSchedule.activeHours &&
										selectedOption.DoctorSchedule.activeHours.length > 0 ? (
											<ul>
												{selectedOption.DoctorSchedule.activeHours.map(
													(timeSlot, index) => {
														const todaysDay = new Date().getDay();
														if (index === todaysDay) {
															return timeSlot.map((slot, newIndex) => (
																<li key={newIndex}>
																	{slot.startTime} - {slot.endTime}
																</li>
															));
														}
														return null;
													}
												)}
											</ul>
										) : (
											<p>No scheduled times available</p>
										)}
										<br />
										<br />
										<button
											onClick={() => {
												handleTakeAppointment();
											}}>
											Take Appointment
										</button>
									</div>
								)}
							</div>
						) : (
							<p>No doctors available</p>
						)}
					</div>
					<br />
					<br />
					{appointments && appointments.length ? (
						<AppointmentList appointments={appointments} />
					) : (
						<p>No Appointments Yet !</p>
					)}
				</>
			)}
		</div>
	);
};

export default AppointmentPage;
