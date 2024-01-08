// Carousel.js
import React, { useState, useEffect, useRef } from 'react';
import './Carousel.scss';
import doctorImg from '../../../assets/images/doctor.png'

const Carousel = ({ items, autoScrollInterval = 3000, contentType }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(nextSlide, autoScrollInterval);

    return () => {
      resetTimeout();
    };
  }, [currentIndex, items.length, autoScrollInterval]);

  return (
    <div className="carousel-container" onMouseEnter={resetTimeout} onMouseLeave={() => timeoutRef.current = setTimeout(nextSlide, autoScrollInterval)}>
      <div className="carousel" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {
          contentType === "doctors" && (
            items.map((doctor, index) => (
              <div
                className="carousel-item"
                key={index}
              >
                <div className='doctors'>
                  <div>
                    <img src={doctorImg} alt="" />
                  </div>
                  <div>
                    <p>{ doctor.User.name }</p>
                    <p>{doctor.specialization}</p>
                  </div>
                </div>
              </div>
            ))
          )
        }
        {
          contentType === "tips" && (
            items.map((tip, index) => (
              <div
                className="carousel-item"
                key={index}
              >
                <div className='tips' >
                  <h2 style={{textAlign: 'left', }}>{ tip.title }</h2>
                  <p style={{textAlign: 'left', }}>{ tip.content }</p> 
                </div>
              </div>
            ))
          )
        }
      </div>
      <button className="carousel-prev" onClick={prevSlide}>&#10094;</button>
      <button className="carousel-next" onClick={nextSlide}>&#10095;</button>
    </div>
  );
};

export default Carousel;
