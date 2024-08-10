import React, { useState, useEffect } from "react";
import axios from "axios";
import "./quiz.css";

const Quiz = () => {
  const [passages, setPassages] = useState([]);
  const [data, setData] = useState({});
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState("");
  const [correct, setCorrect] = useState(null);
  const [selectedBook, setSelectedBook] = useState("All");
  const [revealFullScripture, setRevealFullScripture] = useState(false);

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

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      handleBookChange({ target: { value: selectedBook } });
    }
  }, [data]);

  const handleBookChange = (e) => {
    const newSelectedBook = e.target.value;
    setSelectedBook(newSelectedBook);
    let selectedPassages;
    if (newSelectedBook !== "All") {
      selectedPassages = data[newSelectedBook];
    } else {
      selectedPassages = Object.values(data).flat();
    }
    setPassages(selectedPassages);
    getNextQuestion(selectedPassages);
  };

  const getNextQuestion = (passages) => {
    const randomIndex = Math.floor(Math.random() * passages.length);
    const question = passages[randomIndex];
    let choices = [question.reference];
    while (choices.length < 4) {
      let randomChoice =
        passages[Math.floor(Math.random() * passages.length)].reference;
      if (!choices.includes(randomChoice)) choices.push(randomChoice);
    }

    choices.sort(() => Math.random() - 0.5);
    setQuestion(question);
    setChoices(choices);
    setCorrect(null);
    setSelected("");
    setRevealFullScripture(false);
  };

  const checkAnswer = (choice) => {
    setSelected(choice);
    setCorrect(choice === question.reference);
    setRevealFullScripture(true);
  };

  const nextQuestion = () => {
    getNextQuestion(passages);
  };

  const books = Object.keys(data);

  return (
    <div className="container">
      <div className="form-group">
        <label htmlFor="book-select">Choose a book:</label>
        <select
          id="book-select"
          className="form-control"
          onChange={handleBookChange}
          value={selectedBook}
        >
          <option value="All">All</option>
          {books.map((book) => (
            <option value={book} key={book}>
              {book}
            </option>
          ))}
        </select>
      </div>
      {question && (
        <div className="quiz-container">
          <h1 className="text-center">Doctrinal Mastery Quiz</h1>
          <p className="passage">
            {revealFullScripture ? question.scripture : question.passage}
          </p>
          <div className="choices-container">
            {choices.map((choice) => (
              <button
                key={choice}
                onClick={() => checkAnswer(choice)}
                disabled={selected !== ""}
                className={`btn btn-primary choice-button ${
                  selected === choice
                    ? correct
                      ? "correct"
                      : "incorrect"
                    : ""
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
          {selected !== "" && (
            <div className="result-container">
              <p>
                {correct
                  ? `Correct! Well done.\n ${question.fullpassage}`
                  : `Incorrect. The correct answer is ${question.reference}.`}
              </p>
              <button onClick={nextQuestion} className="btn btn-secondary">
                Next Question
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;