import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MeditationResources from './pages/MeditationResources';
import ProgressTracker from './pages/ProgressTracker';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<MeditationResources />} />
        <Route path="/progress" element={<ProgressTracker />} />
      </Routes>
    </Router>
  );
};

export default App;
