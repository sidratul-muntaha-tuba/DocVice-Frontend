// src/components/Appointment/AppointmentItem.jsx

import React from "react";
import "./AppointmentItem.scss";

const AppointmentItem = ({ appointment }) => {
	return (
		<div className="appointment-item">
			<p>Appointment with</p>
			<h3>
				{appointment.Doctor.User.name}
				, {appointment.Doctor.specialization}
			</h3>
			<p>at {new Date(appointment.date).toLocaleString()}</p>
		</div>
	);
};

export default AppointmentItem;
