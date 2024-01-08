// src/components/TopDoctors/TopDoctors.js

import React from 'react';
import { Link } from 'react-router-dom';
import './TopDoctors.scss'; // Assuming you have an SCSS file for styles

const TopDoctors = ({ doctors }) => {
  return (
    <section className="top-doctors">
      <h2>Top Doctors</h2>
      <div className="doctors-container">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <div className="doctor-image">
              <img src={doctor.User.picture} alt={doctor.name} />
            </div>
            <div className="rank">#{doctor.rank}</div>
            <h3>{doctor.User.name}</h3>
            <p>{doctor.specialization}</p>
          </div>
        ))}
      </div>
      <div className="view-all">
        <p>Connect with certified doctors across various specializations.</p>
        <Link to="/doctors">View All Doctors</Link>
      </div>
    </section>
  );
};

export default TopDoctors;
