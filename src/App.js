import { Routes, Route } from "react-router-dom";
import HomePage from "./components/homepage/HomePage";
import GamePage from "./components/gamepage/GamePage";
import AffirmationPage from "./components/affirmation/AffirmationPage";
import Quiz from "./components//quiz/Quiz";
import Dashboard from "./components/dashboard/Dashboard";
import MatchingGame from "./components/matchinggame/MatchingGame";
import MessagingPage from "./components/messagingpage/MessagingPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/games" element={<GamePage />} />
      <Route path="/journal" element={<AffirmationPage />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/matching" element={<MatchingGame />} />
      <Route path="/messages" element={<MessagingPage />} />
    </Routes>
  );
}

export default App;
