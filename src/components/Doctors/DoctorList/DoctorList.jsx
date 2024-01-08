import React, { useState, useEffect } from 'react';
import DoctorItem from '../DoctorItem/DoctorItem';
import apiService from '../../../services/apiService';
import './DoctorList.scss';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasDataBeenFetched, setHasDataBeenFetched] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    setHasDataBeenFetched(false);
    apiService.getDoctors().then((response) => {
      setDoctors(response);
      setHasDataBeenFetched(true);
    }).catch((error) => {
      console.error('There was an error fetching the doctors', error);
      setHasDataBeenFetched(true);
    });
  }, []);

  const indexOfLastDoctor = currentPage * itemsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="doctor-list">
      {hasDataBeenFetched ? (
        <>
          {
            currentDoctors && currentDoctors.length ?
              (
                currentDoctors.map((doctor, i) => 
                  <DoctorItem key={i} doctor={doctor} />
                )
              )
              :
              <p>No Doctors Found</p>
          }
        </>
      ) : (
        <p style={{textAlign: "center", margin: "auto"}}>Loading ...</p>
      )}
      {doctors.length > itemsPerPage && (
        <div className="pagination">
          {Array.from({ length: Math.ceil(doctors.length / itemsPerPage) }).map((_, i) => (
            <button key={i} onClick={() => paginate(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
