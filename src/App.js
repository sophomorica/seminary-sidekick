import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import GamePage from "./components/GamePage";
import AffirmationPage from "./components/AffirmationPage";
import Quiz from "./components/quiz/Quiz";
import Dashboard from "./components/Dashboard";
import MatchingGame from "./components/MatchingGame";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/games" element={<GamePage />} />
      <Route path="/journal" element={<AffirmationPage />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/matchinggame" element={<MatchingGame />} />
    </Routes>
  );
}

export default App;
