// Register.jsx

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Register.scss'; // Import the SCSS file
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT',
    specialization: '',
    contactNumber: '',
    healthRecord: '',
    picture: process.env.REACT_APP_DEFAULT_PICTURE,
  });
  const [pictureFile, setPictureFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formData);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error); // Handle error
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPictureFile(file);
  };

  const convertToImageBB = async () => {
    if (pictureFile) {

      try {

        const imgData = new FormData();
        imgData.set('key', `${process.env.REACT_APP_IMAGE_BB_API_KEY}`);
        imgData.append('image',pictureFile);
        const responseFromImagebb = await axios.post(`${process.env.REACT_APP_IMAGE_BB_UPLOAD_URL}`, imgData);
        if (responseFromImagebb && responseFromImagebb.data.data.display_url) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            picture: responseFromImagebb.data.data.url,
          }));
        } else {
          setFormData((prevFormData) => ({
            ...prevFormData,
            picture: '',
          }));
        }
      } catch (error) {
        alert("Failed to upload image. Please try again later.")
      }
    }
  };

  useEffect(() => {
    convertToImageBB();
  }, [pictureFile]);

  return (
    <div className="register-container">
      <h2>Registration</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <label className="form-field">
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
          />
        </label>
        <label className="form-field">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
          />
        </label>
        <label className="form-field">
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-field"
          />
        </label>
        <label className="form-field">
          Picture (Upload):
          <input
            type="file"
            name="pictureFile"
            onChange={handleFileChange}
            className="input-field"
          />
        </label>
        <label className="form-field">
          Role:
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input-field"
          >
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
            <option value="INTERN">Intern</option>
          </select>
        </label>
        {formData.role === 'DOCTOR' && (
          <div className="additional-fields">
            <label className="form-field">
              Specialization:
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="input-field"
              />
            </label>
            <label className="form-field">
              Contact Number:
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="input-field"
              />
            </label>
          </div>
        )}
        {formData.role === 'PATIENT' && (
          <label className="form-field">
            Health Record:
            <input
              type="text"
              name="healthRecord"
              value={formData.healthRecord}
              onChange={handleChange}
              className="input-field"
            />
          </label>
        )}
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
