import React, { useState } from 'react';
import './affirmation.css';

const AffirmationPage = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newEntry.trim()) {
      const entry = {
        id: Date.now(),
        text: newEntry,
        date: new Date().toLocaleDateString()
      };
      setEntries([entry, ...entries]);
      setNewEntry('');
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Scripture Journal</h1>
      <p className="lead text-muted mb-4">
        Record your thoughts, insights, and spiritual impressions as you study the scriptures.
      </p>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">New Entry</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="4"
                placeholder="What did you learn today? What spiritual impressions did you receive?"
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Save Entry
            </button>
          </form>
        </div>
      </div>

      <h3 className="mb-3">Your Entries</h3>
      {entries.length === 0 ? (
        <div className="alert alert-info">
          No journal entries yet. Start recording your spiritual insights above!
        </div>
      ) : (
        <div className="row">
          {entries.map((entry) => (
            <div key={entry.id} className="col-12 mb-3">
              <div className="card">
                <div className="card-body">
                  <p className="card-text">{entry.text}</p>
                  <small className="text-muted">{entry.date}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="alert alert-info mt-4">
        <strong>Note:</strong> Journal entries are currently stored in your browser session.
        In a future update, your entries will be saved to your account.
      </div>
    </div>
  );
};

export default AffirmationPage;
