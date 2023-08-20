// src/components/ParallaxSection.js
import React from 'react';

const ParallaxSection = ({ backgroundImage, content }) => {
    return (
        <section className="parallax-section" style={{backgroundImage: `url(${backgroundImage})`}}>
            <div className="content-container">
                {content}
            </div>
        </section>
    );
};

export default ParallaxSection;
