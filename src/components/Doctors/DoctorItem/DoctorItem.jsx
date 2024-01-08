import React from 'react';
import './DoctorItem.scss';
import { Link } from 'react-router-dom';

const DoctorItem = ({ doctor }) => {
  return (
    <div className="doctor-item">
      <img src={doctor.User.picture} alt={doctor.name} className="doctor-photo" />
      <h3 className="doctor-name">{doctor.User.name}</h3>
      <p className="doctor-specialty">{doctor.specialization}</p>
      <Link to={`/doctors/${doctor.id}`} className="btn btn-primary">View Profile</Link>
    </div>
  );
};

export default DoctorItem;
