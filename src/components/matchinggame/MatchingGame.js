import { useState, useEffect } from "react";
import axios from "axios";
import "./matchingGame.css";
import BookSelect from "../bookselect/BookSelect";
import PassageButton from "./PassageButton";
// import { Tooltip } from "react-tooltip";

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
        setSelectedBook(Object.keys(res.data)[2]);
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

  // const handleNameClick = (id, name) => {
  //   setSelectedName({ id, name });
  // };

  // const handleReferenceClick = (id, reference) => {
  //   setSelectedReference({ id, reference });
  // };
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
    console.log("dragging", id);
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function shuffleReference(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const handleDrop = (e, item) => {
    e.preventDefault();
    console.log("dropped", item.id);
    console.log("e", e.dataTransfer);
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

  useEffect(checkMatch, [selectedName, selectedReference, matchedIds]);

  const books = Object.keys(data);
  let passages = [];

  if (selectedBook !== "All") {
    passages = data[selectedBook] || [];
  } else {
    books.forEach((book) => {
      passages = passages.concat(data[book]);
    });
  }
  const shuffledPassages = shuffleArray([...passages]);
  const shuffledReferences = shuffleReference([...passages]);
  return (
    <div className="container matching-game-container">
      <BookSelect books={books} handleBookChange={handleBookChange} />
      <h2 className="text-center">Matching Game</h2>
      <div className="row">
        <div className="col-sm-6 names">
          <h3 className="text-center">Names</h3>
          {passages.map(
            (item, index) =>
              !matchedIds.includes(item.id) && (
                <PassageButton
                  key={item.id}
                  data-tip={item.passage}
                  title={item.passage}
                  type="name"
                  item={item}
                  selected={selectedName}
                  handleDragStart={handleDragStart}
                  matchedIds={matchedIds}
                />
              )
          )}
        </div>
        <div className="col-sm-6 references">
          <h3 className="text-center">References</h3>
          {passages.map(
            (item) =>
              !matchedIds.includes(item.id) && (
                <PassageButton
                  key={item.id}
                  type="reference"
                  item={item}
                  selected={selectedReference}
                  handleDrop={handleDrop}
                  handleDragOver={handleDragOver}
                  matchedIds={matchedIds}
                />
              )
          )}
        </div>
      </div>
    </div>
  );
};
export default MatchingGame;

// i want to get a tool tip that will show the entire passage
