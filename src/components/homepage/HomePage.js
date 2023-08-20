// HomePage.js
import React from "react";
import Header from "../header/Header";
import ParallaxSection from "../parallax/Parallax";
import Content from "../contents/Contents";
import Footer from "../footer/Footer";
import "./homepage.css";

const HomePage = ({ title, content }) => {
  return (
    <div className="app">
      <Header />

      <ParallaxSection
        backgroundImage="path/to/your/parallax-image.jpg"
        content={
          <p>
            Discover games and journals that encourage growth and intelligence.
          </p>
        }
      />

      <Content
        title="Games"
        content={
          <p>Engage with thought-provoking games that stimulate your brain.</p>
        }
      />

      <Content
        title="Journaling"
        content={
          <p>
            Reflect on your experiences and share your thoughts through
            journaling.
          </p>
        }
      />

      <Footer />
    </div>
  );
};

export default HomePage;
