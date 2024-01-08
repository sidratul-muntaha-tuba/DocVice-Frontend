import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../../../services/apiService';
import './Doctor.scss';

const Doctor = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    apiService.getDoctor(doctorId).then((response) => {
        setDoctor(response);
      })
      .catch((error) => {
        console.error('Error fetching doctor details:', error);
      });
  }, [doctorId]);

  return (
    <div className="doctor-profile">
      {doctor ? (
        <div className="profile-details">
          <h1>{doctor.User.name}</h1>
          <p>Specialization: {doctor.specialization}</p>
          <p>Contact Number: {doctor.contactNumber || 'Not available'}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Doctor;
