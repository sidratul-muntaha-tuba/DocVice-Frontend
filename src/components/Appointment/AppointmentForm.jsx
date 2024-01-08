// src/components/Appointment/AppointmentForm.jsx

import React, { useState } from 'react';
import './AppointmentForm.scss';

const AppointmentForm = ({ onSubmit }) => {
  const [appointment, setAppointment] = useState({
    title: '',
    date: '',
    time: '',
    // Add more fields as needed
  });

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(appointment);
  };

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <input
        name="title"
        value={appointment.title}
        onChange={handleChange}
        placeholder="Appointment Title"
      />
      <input
        name="date"
        type="date"
        value={appointment.date}
        onChange={handleChange}
      />
      <input
        name="time"
        type="time"
        value={appointment.time}
        onChange={handleChange}
      />
      {/* Add more input fields as needed */}
      <button type="submit">Book Appointment</button>
    </form>
  );
};

export default AppointmentForm;
