import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddHealthTipsPage.scss';

const AddHealthTipsPage = () => {
  const [healthTips, setHealthTips] = useState([]);
  const [newHealthTip, setNewHealthTip] = useState({ id: null, title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchHealthTips = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/health-tips`);
      setHealthTips(response.data);
    } catch (error) {
      console.error('Error fetching health tips:', error);
      alert('No data found');
    }
  };

  const addHealthTip = async () => {
    try {
      if (newHealthTip.title.trim() === '' || newHealthTip.content.trim() === '') {
        alert('Title and content cannot be empty');
        return;
      }

      if (isEditing) {
        await axios.put(`${process.env.REACT_APP_API_URL}/health-tips/${newHealthTip.id}`, newHealthTip);
        setIsEditing(false);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/health-tips`, newHealthTip);
      }

      fetchHealthTips();
      setNewHealthTip({ id: null, title: '', content: '' });
    } catch (error) {
      console.error('Error adding/editing health tip:', error);
      alert('Error while addition');
    }
  };

  const deleteHealthTip = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/health-tips/${id}`);
      fetchHealthTips();
      setNewHealthTip({ id: null, title: '', content: '' });
      setIsEditing(false);
      alert('Delete successful');
    } catch (error) {
      console.error('Error deleting health tip:', error);
    }
  };

  const editHealthTip = (tip) => {
    setNewHealthTip({ id: tip.id, title: tip.title, content: tip.content });
    setIsEditing(true);
  };

  useEffect(() => {
    fetchHealthTips();
  }, []);

  return (
    <div className="addHealthTipsContainer">
      <h2>Health Tips</h2>
      <div className="healthTipsList">
        {healthTips.map((tip) => (
          <div key={tip.id} className="healthTip">
            <h3>{tip.title}</h3>
            <p>{tip.content}</p>
            <div className="actions">
              <button className="editBtn" onClick={() => editHealthTip(tip)}>Edit</button>
              <button className="deleteBtn" onClick={() => deleteHealthTip(tip.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="addHealthTipForm">
        <h3>{isEditing ? 'Edit Health Tip' : 'Add New Health Tip'}</h3>
        <input
          type="text"
          placeholder="Title"
          value={newHealthTip.title}
          onChange={(e) => setNewHealthTip({ ...newHealthTip, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={newHealthTip.content}
          onChange={(e) => setNewHealthTip({ ...newHealthTip, content: e.target.value })}
        />
        <button className="addBtn" onClick={addHealthTip}>
          {isEditing ? 'Update' : 'Add'}
        </button>
      </div>
    </div>
  );
};

export default AddHealthTipsPage;
