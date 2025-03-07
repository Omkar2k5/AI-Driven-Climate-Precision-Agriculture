import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Thermometer, Wind, Droplets, Sun } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

const API_KEY = '57676ee4d30d2f001f6abb9c6e90c6e2';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

const WeatherUpdates = () => {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getWeather = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        
        setWeather({
          temperature: data.main.temp,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          description: data.weather[0].description,
          icon: data.weather[0].icon
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError(t.weatherUpdates.error);
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError(t.weatherUpdates.error);
          setLoading(false);
        }
      );
    } else {
      setError(t.weatherUpdates.error);
      setLoading(false);
    }
  }, [t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Oops!</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative" 
      style={{ backgroundImage: "url('/bckgnd.jpg')" }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-85"></div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto relative p-8"
      >
        <LanguageSelector />
      
        <div className="text-center mb-10">
          <Cloud className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.weatherUpdates.title}</h1>
          <p className="text-gray-600">{t.weatherUpdates.subtitle}</p>
        </div>

        {weather && (
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8 relative"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{Math.round(weather.temperature)}°C</h2>
                  <p className="text-gray-600 capitalize">{weather.description}</p>
                </div>
                <img
                  src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt="Weather icon"
                  className="w-20 h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  <span className="text-gray-600">{t.weatherUpdates.temperature}</span>
                </div>
                <span className="text-right font-semibold">{Math.round(weather.temperature)}°C</span>

                <div className="flex items-center space-x-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">{t.weatherUpdates.humidity}</span>
                </div>
                <span className="text-right font-semibold">{weather.humidity}%</span>

                <div className="flex items-center space-x-2">
                  <Wind className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">{t.weatherUpdates.windSpeed}</span>
                </div>
                <span className="text-right font-semibold">{weather.windSpeed} m/s</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-8 relative"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t.weatherUpdates.agriculturalImpact.title}</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-gray-700">{t.weatherUpdates.agriculturalImpact.growingConditions}</h3>
                  </div>
                  <p className="text-gray-600">
                    {weather.temperature > 25
                      ? t.weatherUpdates.agriculturalImpact.highTemp
                      : weather.temperature < 10
                      ? t.weatherUpdates.agriculturalImpact.lowTemp
                      : t.weatherUpdates.agriculturalImpact.optimalTemp}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-700">{t.weatherUpdates.agriculturalImpact.irrigationNeeds}</h3>
                  </div>
                  <p className="text-gray-600">
                    {weather.humidity > 70
                      ? t.weatherUpdates.agriculturalImpact.highHumidity
                      : weather.humidity < 40
                      ? t.weatherUpdates.agriculturalImpact.lowHumidity
                      : t.weatherUpdates.agriculturalImpact.moderateHumidity}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wind className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold text-gray-700">{t.weatherUpdates.agriculturalImpact.windAdvisory}</h3>
                  </div>
                  <p className="text-gray-600">
                    {weather.windSpeed > 10
                      ? t.weatherUpdates.agriculturalImpact.strongWind
                      : t.weatherUpdates.agriculturalImpact.favorableWind}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WeatherUpdates;
