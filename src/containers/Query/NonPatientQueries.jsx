import axios from 'axios';
import React, { useEffect, useState } from 'react';
import QueryList from '../../components/User/Queries/QueryList';
import { useAuth } from '../../contexts/AuthContext';
import "./NonPatientQueries.scss";


const NonPatientQueries = ( ) => {
  const [queries, setQueries] = useState([]);
  const { auth } = useAuth();
  const patientId = parseInt(auth.user.id);

  useEffect(() => {
    // Fetch queries for the patient
    axios.get(`${process.env.REACT_APP_API_URL}/query`).then(response => {
      setQueries(response.data);
    });
  }, []);

  };

  return (
    <div className="patient-queries">
      {
        queries.length ?
          <>
            <hr style={{marginTop: "2rem", marginBottom: "2rem"}} />
            <h2>My Queries</h2>
            <QueryList queries={queries} />
          </>
          :
          <p>No Queries found ...</p>
      }
    </div>
  );
};

export default NonPatientQueries;
