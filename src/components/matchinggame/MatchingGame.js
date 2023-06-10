import React, { useState, useEffect } from "react";
import axios from "axios";
import "./matchingGame.css";

const MatchingGame = () => {
  const [data, setData] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedReference, setSelectedReference] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [selectedBook, setSelectedBook] = useState("All");

  useEffect(() => {
    axios
      .get("./data/passages.json")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handleBookChange = (e) => {
    setSelectedBook(e.target.value);
    setSelectedName(null);
    setSelectedReference(null);
  };

  const handleNameClick = (id, name) => {
    setSelectedName({ id, name });
  };

  const handleReferenceClick = (id, reference) => {
    setSelectedReference({ id, reference });
  };

  const checkMatch = () => {
    if (selectedName && selectedReference) {
      if (selectedName.id === selectedReference.id) {
        // alert("Correct match!");
        setMatchedIds([...matchedIds, selectedName.id]);
        setSelectedName(null);
        setSelectedReference(null);
      } else {
        alert("Incorrect match, try again.");
      }
    }
  };

  useEffect(checkMatch, [selectedName, selectedReference]);

  const books = Object.keys(data);
  let passages = [];

  if (selectedBook !== "All") {
    passages = data[selectedBook] || [];
  } else {
    books.forEach((book) => {
      passages = passages.concat(data[book]);
    });
  }

  return (
    <div className="container matching-game-container">
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
      <h2 className="text-center">Matching Game</h2>
      <div className="row">
        <div className="col-sm-6 names">
          <h3 className="text-center">Names</h3>
          {passages.map(
            (item) =>
              !matchedIds.includes(item.id) && (
                <button
                  key={item.id}
                  className={`btn btn-outline-primary ${
                    selectedName && selectedName.id === item.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleNameClick(item.id, item.name)}
                >
                  {item.name}
                </button>
              )
          )}
        </div>
        <div className="col-sm-6 references">
          <h3 className="text-center">References</h3>
          {passages.map(
            (item) =>
              !matchedIds.includes(item.id) && (
                <button
                  key={item.id}
                  className={`btn btn-outline-success ${
                    selectedReference && selectedReference.id === item.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleReferenceClick(item.id, item.reference)}
                >
                  {item.reference}
                </button>
              )
          )}
        </div>
      </div>
    </div>
  );
};
export default MatchingGame;
