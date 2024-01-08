import React from 'react';
import AppointmentItem from './AppointmentItem';

const AppointmentList = ({ appointments }) => {
  return (
    <div className="appointment-list">
      <h3>All Appointments</h3>
      <br />
      {appointments.map((appointment) => (
        <AppointmentItem key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
};

export default AppointmentList;
