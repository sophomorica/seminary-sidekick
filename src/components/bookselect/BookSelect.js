import React, { useState, useEffect } from "react";

const BookSelect = ({ books, handleBookChange }) => (
  <div className="form-group">
    <label htmlFor="book-select">Choose a book:</label>
    <select
      id="book-select"
      className="form-control"
      onChange={handleBookChange}
    >
      <option value="All">All</option>
      {books.map((book) => (
        <option value={book} key={book}>
          {book}
        </option>
      ))}
    </select>
  </div>
);

export default BookSelect;
