import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './ProfilePage.scss';

const ProfilePage = () => {
  const { auth } = useAuth();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [internDetails, setInternDetails] = useState(null);
  const [queriesOfPatients, setQueriesOfPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [hasResponseFetched, setHasResponseFetched] = useState(false);
  const user = auth.user;
  const userId = user.id;
  
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/profile/${userId}`);
      const data = await response.json();
      const fetchedUserProfile = data.userProfile;
      if (fetchedUserProfile.Doctor) {
        setDoctorDetails(fetchedUserProfile.Doctor);
      }
      if (fetchedUserProfile.Patient) {
        setPatientDetails(fetchedUserProfile.Patient);
        if (fetchedUserProfile.Patient.Query) {
          setQueriesOfPatients(fetchedUserProfile.Patient.Query);
        }
      }
      if (fetchedUserProfile.Intern) {
        setInternDetails(fetchedUserProfile.Intern);
      }
      if (fetchedUserProfile.Appointments) {
        setAppointments(fetchedUserProfile.Appointments);
      }
      setHasResponseFetched(true);
    } catch (error) {
      setHasResponseFetched(false);
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    setHasResponseFetched(false);
    fetchUserProfile();
  }, []);

  return (
    <div className="profile-page">
      {hasResponseFetched}
      {hasResponseFetched ? (
        <div className="profile-page-main-div">
          <h1><span style={{ color: "tomato" }}>{user.name}'s</span> Profile</h1>
          <img src={user.picture} alt={user.name} />
          <h3 style={{marginBottom: "0.5rem", textAlign:'left', color: 'indigo'}}>User Details</h3>
          {user && (
            <div className="details-table">
              <div className="table-row">
                <div className='header'>Email</div>
                <div>{user.email}</div>
              </div>
              <div className="table-row">
                <div className='header'>Account Verification</div>
                <div>{user.approved ? 'Verified' : 'Verification Pending'}</div>
              </div>
              <div className="table-row">
                <div className='header'>Role</div>
                <div>{user.role}</div>
              </div>
            </div>
          )}

          {doctorDetails && (
            <div style={{marginTop: "2rem"}}>
              <h3 style={{marginBottom: "0.5rem", textAlign:'left', color: 'indigo'}}>Doctor Details</h3>
              <div className="details-table">
                <div className="table-row">
                  <div className='header'>Specialization</div>
                  <div>{doctorDetails?.specialization}</div>
                </div>
                <div className="table-row">
                  <div className='header'>Contact Info</div>
                  <div>{doctorDetails?.contactNumber}</div>
                </div>
              </div>
            </div>
          )}

          {patientDetails && (
            <div style={{marginTop: "2rem"}}>
              <h3 style={{marginBottom: "0.5rem", textAlign:'left', color: 'indigo'}}>Patient Details</h3>
              <div className="details-table">
                <div className="table-row">
                  <div className='header'>Health Record</div>
                  <div>{patientDetails?.healthRecord}</div>
                </div>
              </div>
            </div>
          )}

          {queriesOfPatients && queriesOfPatients.length > 0 && (
            <div style={{marginTop: "2rem"}}>
              <h3 style={{ marginBottom: "0.5rem", textAlign: 'left', color: 'indigo' }}>Queries</h3>
              {
                queriesOfPatients.map((query, i) => (
                  <div style={{margin: "1rem",}}>
                    <h4>Question #{i + 1}</h4>
                    <p>{query?.queryText}</p>
                    {
                      query?.Suggestions && (
                        <p>{ query?.Suggestions?.suggestionText }</p>
                      )
                    }
                  </div>
                ))
              }
            </div>
          )}
        </div>
      ) : (
        <div className="loader"></div>
      )}
    </div>
  );
};

export default ProfilePage;
