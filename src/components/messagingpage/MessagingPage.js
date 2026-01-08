import React from 'react';
import './messagingpage.css';

const MessagingPage = () => {
  return (
    <div className="container py-4">
      <h1 className="mb-4">Messages</h1>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Conversations</h5>
            </div>
            <div className="card-body">
              <div className="text-center text-muted py-5">
                <div className="display-1 mb-3">💬</div>
                <p>No conversations yet</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Chat</h5>
            </div>
            <div className="card-body d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="text-center text-muted">
                <div className="display-1 mb-3">📮</div>
                <h4>Messaging Coming Soon!</h4>
                <p className="mb-4">
                  Connect with your seminary classmates and teachers to discuss scriptures and share insights.
                </p>
                <div className="alert alert-info text-start">
                  <h6>Planned Features:</h6>
                  <ul className="mb-0">
                    <li>Direct messaging with classmates</li>
                    <li>Group discussions for scripture study</li>
                    <li>Share favorite passages and insights</li>
                    <li>Ask questions and get help</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
