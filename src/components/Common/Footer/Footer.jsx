// src/components/Common/Footer/Footer.jsx

import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>&copy; {new Date().getFullYear()} Docvice. All rights reserved.</span>
        <span className="developer-credit">Developed by Sidratul Muntaha Tuba, CSE DIU</span>
      </div>
    </footer>
  );
};

export default Footer;
