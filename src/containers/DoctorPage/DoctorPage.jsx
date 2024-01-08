// src/containers/DoctorPage/DoctorPage.jsx

import React from 'react';


import './DoctorPage.scss';
import DoctorList from '../../components/Doctors/DoctorList/DoctorList';

const DoctorPage = () => {
  return (
    <>
      <div className="doctor-page-container">
        <DoctorList />
      </div>
    </>
  );
};

export default DoctorPage;
