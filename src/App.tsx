import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CropRecommendation from './pages/CropRecommendation';
import WaterQuality from './pages/WaterQuality';
import WeatherUpdates from './pages/WeatherUpdates';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crop-recommendation" element={<CropRecommendation />} />
            <Route path="/water-quality" element={<WaterQuality />} />
            <Route path="/weather-updates" element={<WeatherUpdates />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;