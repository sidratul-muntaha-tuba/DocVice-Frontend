import React from 'react';
import './ErrorPage.scss';

const ErrorPage = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <img className="error-image" src={process.env.REACT_APP_PAGE_NOT_FOUND_IMAGE} alt="" />
        <h1>Oops! Page not found.</h1>
        <p>We're sorry, but the content you are searching is missing.</p>
      </div>
    </div>
  );
};

export default ErrorPage;
