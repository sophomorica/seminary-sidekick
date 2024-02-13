// LandingPage component
import React from 'react';
import backgroundImage from '../../images/dc_temple_pic.png';

const LandingPage = () => {

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-white"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
      }}
    >
      <h1 className="mb-2">This is the Place!</h1>
      <h2 className="mb-2">BattlefieldSeminary</h2>
      <h3 className="mb-4">Starting the day with spiritual splendor</h3>
      <a
        href="https://www.churchofjesuschrist.org/si/seminary/about/seminary-registration-landing?lang=eng"
        className="btn btn-outline-light"
      >
        Register for Seminary
      </a>
    </div>
  );
};

export default LandingPage;


