import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/homepage/HomePage";
import GamePage from "./components/gamepage/GamePage";
import AffirmationPage from "./components/affirmation/AffirmationPage";
import LandingPage from "./components/landingpage/LandingPage";
import Quiz from "./components//quiz/Quiz";
import Dashboard from "./components/dashboard/Dashboard";
import MatchingGame from "./components/matchinggame/MatchingGame";
import MessagingPage from "./components/messagingpage/MessagingPage";
import Navbar from "./components/navbar/Navbar"
function App() {
  return (
    <Router>
      <Navbar/> 
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/games" element={<GamePage />} />
      <Route path="/journal" element={<AffirmationPage />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/matching" element={<MatchingGame />} />
      <Route path="/messages" element={<MessagingPage />} />
    </Routes>
    </Router>
  );
}

export default App;
