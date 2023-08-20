// src/components/Contents.js
import React from 'react';

const Contents = ({ title, content }) => {
    return (
        <section className="content-section">
            <h2 className="section-title">{title}</h2>
            <div className="section-content">
                {content}
            </div>
        </section>
    );
};

export default Contents;
