import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import axios from 'axios';
import soilNPKValues from '../values/soilNPKValues';

// Note: Replace with your OpenWeatherMap API key
const API_KEY = '';

type SoilType = keyof typeof soilNPKValues;

type Errors = {
  humidity: string;
  waterPh: string;
};


const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    moisture: '',
    temperature: '',
    humidity: '',
    waterPh: '',
    rainfall: '',
    soilType: 'clay' as SoilType,
  });

  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({
    humidity: '',
    waterPh: '',
  });

  const [weatherData, setWeatherData] = useState<{ temperature: number; humidity: number } | null>(null);

  // Fetch weather data
  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      console.log('Weather data fetched:', data); // Debug log
      setWeatherData({
        temperature: data.main.temp,
        humidity: data.main.humidity,
      });
    } catch (err) {
      console.error('Error fetching weather data:', err);
    }
  };

  // Handle auto-fetch for temperature and humidity from weather API
  const handleAutoFetch = () => {
    if (navigator.geolocation) {
      console.log('Getting user location...'); // Debug log
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Geolocation successful:', position); // Debug log
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  // Update N, P, K values based on soil type selection
  useEffect(() => {
    if (soilNPKValues[formData.soilType]) {
      setFormData((prevState) => ({
        ...prevState,
        nitrogen: soilNPKValues[formData.soilType].nitrogen.toString(),
        phosphorus: soilNPKValues[formData.soilType].phosphorus.toString(),
        potassium: soilNPKValues[formData.soilType].potassium.toString(),
      }));
    }
  }, [formData.soilType]);

  // Validate form
  const validate = () => {
    let valid = true;
    const newErrors: Errors = { humidity: '', waterPh: '' };

    if (parseFloat(formData.humidity) < 0 || parseFloat(formData.humidity) > 100) {
      newErrors.humidity = 'Humidity must be between 0 and 100.';
      valid = false;
    }

    if (parseFloat(formData.waterPh) < 0 || parseFloat(formData.waterPh) > 14) {
      newErrors.waterPh = 'Water pH must be between 0 and 14.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      N: soilNPKValues[formData.soilType].nitrogen,
      P: soilNPKValues[formData.soilType].phosphorus,
      K: soilNPKValues[formData.soilType].potassium,
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      ph: parseFloat(formData.waterPh),
      rainfall: parseFloat(formData.rainfall),
    };

    try {
      const response = await axios.post('http://localhost:5000/predict_crop', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      setRecommendation(response.data.prediction);
    } catch (error) {
      console.error('Error fetching prediction:', error);
      setRecommendation('Error fetching data');
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Auto-fetch temp and humidity from the weather API
  useEffect(() => {
    if (weatherData) {
      setFormData({
        ...formData,
        temperature: weatherData.temperature.toString(),
        humidity: weatherData.humidity.toString(),
      });
    }
  }, [weatherData]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <Leaf className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Crop Recommendation</h1>
        <p className="text-gray-600">Enter environmental parameters to get AI-powered crop suggestions</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Soil Type</label>
            <select
              name="soilType"
              value={formData.soilType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              required
            >
              {Object.keys(soilNPKValues).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {[ 
            { name: 'temperature', label: 'Temperature (°C)', type: 'number' },
            { name: 'humidity', label: 'Humidity (%)', type: 'number' },
            { name: 'waterPh', label: 'Water pH', type: 'number' },
            { name: 'rainfall', label: 'Rainfall (mm)', type: 'number' },
          ].map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
              {errors[field.name as keyof typeof errors] && (
                <p className="text-red-600 text-xs mt-1">{errors[field.name as keyof typeof errors]}</p>
              )}
            </div>
          ))}

          {/* Auto Fetch Button */}
          <div className="col-span-2 text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAutoFetch}
              className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors mt-4"
            >
              Auto fetch temp and humidity
            </motion.button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full mt-8 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors"
        >
          Get Crop Recommendations
        </motion.button>
      </form>

      {/* Display Crop Recommendation */}
      {recommendation && (
        <motion.div
          className="mt-8 bg-green-50 rounded-xl p-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-3xl font-extrabold text-green-800 mb-4 font-sans tracking-wide">
            Recommended Crop
          </h2>
          <p className="text-gray-600 text-2xl font-serif">{recommendation}</p>
        </motion.div>
      )}

      <div className="mt-8 bg-green-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-green-800 mb-4">How it Works</h2>
        <p className="text-gray-600">
          Our AI model analyzes environmental parameters like nitrogen, phosphorus, potassium, temperature, humidity, water pH, rainfall, and soil type to provide the best crop recommendations for your region.
        </p>
      </div>
    </motion.div>
  );
};

export default CropRecommendation;
