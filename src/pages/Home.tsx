import React from 'react';
import { motion } from 'framer-motion';
import { Plane as Plant, Droplets, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen st" style={{
      backgroundImage: "url('/bckgnd.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      
    }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          zIndex: -1,
        }}
      />
      <div className="max-w-6xl mx-auto relative p-8">
        <LanguageSelector />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-green-800 mb-6">
            {t.homeTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.homeSubtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <Link to="/crop-recommendation" className="block">
              <Plant className="w-12 h-12 text-green-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t.cropRecommendationCard.title}
              </h2>
              <p className="text-gray-600">
                {t.cropRecommendationCard.description}
              </p>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <Link to="/water-quality" className="block">
              <Droplets className="w-12 h-12 text-blue-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t.waterQualityCard.title}
              </h2>
              <p className="text-gray-600">
                {t.waterQualityCard.description}
              </p>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <Link to="/weather-updates" className="block">
              <Cloud className="w-12 h-12 text-purple-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t.weatherUpdatesCard.title}
              </h2>
              <p className="text-gray-600">
                {t.weatherUpdatesCard.description}
              </p>
            </Link>
          </motion.div>
        </div>

        <div className="mt-16 bg-green-50 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-green-800 mb-6">{t.whyChooseUs.title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-700">{t.whyChooseUs.dataDecisions.title}</h3>
              <p className="text-gray-600">{t.whyChooseUs.dataDecisions.description}</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-700">{t.whyChooseUs.sustainableFarming.title}</h3>
              <p className="text-gray-600">{t.whyChooseUs.sustainableFarming.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
