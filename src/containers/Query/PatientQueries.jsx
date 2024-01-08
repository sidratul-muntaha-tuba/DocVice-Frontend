import axios from 'axios';
import React, { useEffect, useState } from 'react';
import QueryList from '../../components/User/Queries/QueryList';
import { useAuth } from '../../contexts/AuthContext';
import "./PatientQueries.scss";


const PatientQueries = ( ) => {
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState('');
  const { auth } = useAuth();
  const patientId = parseInt(auth.user.id);

  useEffect(() => {
    // Fetch queries for the patient
    axios.get(`${process.env.REACT_APP_API_URL}/query/patient/${patientId}`).then(response => {
      setQueries(response.data);
    });
  }, [patientId]);

  const handleSubmit = e => {
    e.preventDefault();
    // Logic to submit the new query
    axios.post(`${process.env.REACT_APP_API_URL}/query`, { patientId, queryText: newQuery }).then(response => {
      setQueries([...queries, response.data]);
      setNewQuery('');
    });
  };

  return (
    <div className="patient-queries">
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Type your question here..."
          value={newQuery}
          onChange={e => setNewQuery(e.target.value)}
        />
        <button type="submit">Submit Question</button>
      </form>
      {
        queries.length ?
          <>
            <hr style={{marginTop: "2rem", marginBottom: "2rem"}} />
            <h2>My Queries</h2>
            <QueryList queries={queries} />
          </>
          :
          null
      }
    </div>
  );
};

export default PatientQueries;
