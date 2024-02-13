// src/components/ParallaxSection.js
import React from 'react';

const ParallaxSection = ({ backgroundImage, content }) => {
    return (
        <section className="parallax-background" style={{backgroundImage: `url(${backgroundImage})`}}>
            <div className="parallax-section">
                {content}
            </div>
        </section>
    );
};

export default ParallaxSection;
