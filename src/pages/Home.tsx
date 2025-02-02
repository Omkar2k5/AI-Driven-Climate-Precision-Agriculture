import React from 'react';
import { motion } from 'framer-motion';
import { Plane as Plant, Droplets, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold text-green-800 mb-6">
          AI-Driven Climate Precision Agriculture
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Empowering farmers with intelligent insights for sustainable and resilient agriculture
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <Link to="/crop-recommendation" className="block">
            <Plant className="w-12 h-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Crop Recommendation</h2>
            <p className="text-gray-600">
              Get AI-powered crop suggestions based on environmental parameters and soil conditions
            </p>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <Link to="/water-quality" className="block">
            <Droplets className="w-12 h-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Water Quality Analysis</h2>
            <p className="text-gray-600">
              Analyze water quality parameters to ensure safe and optimal irrigation
            </p>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <Link to="/weather-updates" className="block">
            <Cloud className="w-12 h-12 text-purple-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Live Weather Updates</h2>
            <p className="text-gray-600">
              Real-time weather information and forecasts for better planning
            </p>
          </Link>
        </motion.div>
      </div>

      <div className="mt-16 bg-green-50 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-green-800 mb-6">Why Choose Our Platform?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-green-700">Data-Driven Decisions</h3>
            <p className="text-gray-600">Make informed farming decisions based on real-time data and AI analysis</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-green-700">Sustainable Farming</h3>
            <p className="text-gray-600">Optimize resource usage and promote environmentally friendly practices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;