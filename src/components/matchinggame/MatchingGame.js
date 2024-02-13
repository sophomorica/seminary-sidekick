import React, { useState, useEffect } from "react";
import axios from "axios";
import "./matchingGame.css";
import BookSelect from "../bookselect/BookSelect";
import PassageButton from "./PassageButton";

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
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e, item) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text");
    if (draggedId === item.id) {
      // If the dragged item matches the dropped item, update your state
      // to reflect the match (e.g., remove the items from the game, update scores, etc.)
      setMatchedIds([...matchedIds, item.id]);
      setSelectedName(null);
      setSelectedReference(null);
    } else {
      // If the dragged item does not match the dropped item, shuffle the items
      alert("Incorrect match, try again.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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
      <BookSelect books={books} handleBookChange={handleBookChange} />
      <h2 className="text-center">Matching Game</h2>
      <div className="row">
        <div className="col-sm-6 names">
          <h3 className="text-center">Names</h3>
          {passages.map((item) => (
            <PassageButton
              type="name"
              item={item}
              selected={selectedName}
              handleDragStart={handleDragStart}
              matchedIds={matchedIds}
            />
          ))}
        </div>
        <div className="col-sm-6 references">
          <h3 className="text-center">References</h3>
          {passages.map((item) => (
            <PassageButton
              type="reference"
              item={item}
              selected={selectedReference}
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
              matchedIds={matchedIds}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default MatchingGame;
