// AdminApproveUsersPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminApproveUsersPage.scss';

const AdminApproveUsersPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    // Fetch pending users
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/approve-users`); // Replace with your API endpoint
        setPendingUsers(response.data);
      } catch (error) {
        console.error('Error fetching pending users:', error);
      }
    };

    fetchPendingUsers();
  }, []);

  const approveUser = async (userId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/approve-users/${userId}/approve`); // Replace with your API endpoint
      // Update the UI after approval
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const declineUser = async (userId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/approve-users/${userId}/decline`);
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error declining user:', error);
    }
  };

  return (
    <div className="admin-approve-users-container">
      <h2>Pending User Registrations</h2>
      {pendingUsers.length === 0 ? (
        <p>No pending registrations</p>
      ) : (
        <ul className="user-list">
          {pendingUsers.map(user => (
            <li key={user.id} className="user-item">
              <div className="user-details">
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                {/* Include other user details */}
              </div>
              <div className="user-actions">
                <button onClick={() => approveUser(user.id)}>Approve</button>
                <button style={{backgroundColor: "red", marginLeft: "1rem"}} onClick={() => declineUser(user.id)}>Decline</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminApproveUsersPage;
