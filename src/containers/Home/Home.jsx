// src/components/Home/Home.jsx

import React, { useEffect, useState } from 'react';
import TopDoctors from '../../TopDoctors/TopDoctors';
import Carousel from '../../components/Common/Carousel/Carousel';
import { getDoctors, getHealthTips } from '../../services/apiService';
import './Home.scss';

const Home = () => {

  const [topDoctors, setTopDoctors] = useState([]);
  const [healthTips, setHealthTips] = useState([]);

  const getDoctorsList = async () => {
    const doctorsList = await getDoctors()
    let topDoctorsList = []
    if (doctorsList.length > 3) {
      let count = 0 
      while (count <= 2) {
        topDoctorsList.push(doctorsList[count])
        count++
      }
    } else {
      topDoctorsList = doctorsList
    }
    setTopDoctors(topDoctorsList)
  }

  const getTipsList = async () => {
    const tips = await getHealthTips()
    setHealthTips(tips);
  }

  useEffect(() => {
    getDoctorsList()
    getTipsList()
  }, [])
  
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Docvice</h1>
          <p>Your health matters. Find the best doctors, get health tips, and book appointments online.</p>
        </div>
      </section>

      <Carousel items={healthTips} contentType={"tips"} autoScrollInterval={10000} />

      <TopDoctors doctors={topDoctors} />

      <section className="services">
        <div className="service">
          <h2>Get Health Tips</h2>
          <p>Read articles and tips from health experts to keep you fit and healthy.</p>
        </div>
        <div className="service">
          <h2>Book Appointments</h2>
          <p>Schedule your appointments with ease and manage them online.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
