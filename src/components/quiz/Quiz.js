import React, { useState, useEffect } from "react";
import axios from "axios";
import "./quiz.css";

const Quiz = () => {
  const [passages, setPassages] = useState([]);
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState("");
  const [correct, setCorrect] = useState(null);

  useEffect(() => {
    axios.get("./data/passages.json").then((res) => {
        setPassages(res.data);
        getNextQuestion(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const getNextQuestion = (passages) => {
    const randomIndex = Math.floor(Math.random() * passages.length);
    const question = passages[randomIndex];
    let choices = [question.reference];
    while (choices.length < 4) {
      let randomChoice =
        passages[Math.floor(Math.random() * passages.length)].reference;
      if (!choices.includes(randomChoice)) choices.push(randomChoice);
    }

    // Randomly sort choices
    choices.sort(() => Math.random() - 0.5);

    setQuestion(question);
    setChoices(choices);
    setCorrect(null);
    setSelected("");
  };

  const checkAnswer = (choice) => {
    setSelected(choice);
    setCorrect(choice === question.reference);
  };

  const nextQuestion = () => {
    getNextQuestion(passages);
  };

  return (
    <div>
      {question && (
        <div className="quiz-container">
          <h1 className="text-center">Doctrinal Mastery Quiz</h1>
          <p className="passage">{question.passage}</p>
          <div className="choices-container">
            {choices.map((choice) => (
              <button
                key={choice}
                onClick={() => checkAnswer(choice)}
                disabled={selected !== ""}
                className="btn btn-primary choice-button"
                style={{
                  backgroundColor:
                    selected === choice
                      ? correct
                        ? "green"
                        : "red"
                      : "initial",
                }}
              >
                {choice}
              </button>
            ))}
            {selected !== "" && <button onClick={nextQuestion}>Next</button>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
