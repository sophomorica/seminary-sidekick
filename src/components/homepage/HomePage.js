// HomePage.js
import React from "react";
import Header from "../header/Header";
import ParallaxSection from "../parallax/Parallax";
import Content from "../contents/Contents";
import Footer from "../footer/Footer";
import "./homepage.css";

const HomePage = ({ title, content }) => {

  const handleGetStartedClick = () => {
    console.log("buttface");
  }
  return (
    <div className="app">
      <Header />
      <div className="hero-section">
  <video autoPlay muted loop id="hero-video">
    <source src="path_to_your_video.mp4" type="video/mp4" />
    Your browser does not support HTML5 video.
  </video>
  <div className="hero-message">
    <h1>Welcome to Seminary Sidekick</h1>
    <p>Enhance your scripture knowledge and mastery</p>
    <button onClick={handleGetStartedClick} className="get-started-button">Get Started</button>
  </div>
</div>

      <Footer />
    </div>
  );
};

export default HomePage;
