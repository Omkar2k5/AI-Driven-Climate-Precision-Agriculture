import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

const WaterQuality = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    ph: '',
    hardness: '',
    solids: ''
  });

  const [report, setReport] = useState<null | {
    chloramines: number;
    sulfate: number;
    organicCarbon: number;
    potability: string;
  }>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert input values to numbers for comparison
    const ph = parseFloat(formData.ph);
    const hardness = parseFloat(formData.hardness);
    const solids = parseFloat(formData.solids);

    // Send data to backend for Chloramines, Sulfate, and Organic Carbon predictions
    const response = await fetch('http://localhost:5000/predict_water_quality', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    // Check if the user input is within the safe boundaries
    let potability = t.waterQuality.report.safe;

    if (
      ph < 7 || ph > 8 ||
      hardness > 120 ||
      solids > 500
    ) {
      potability = t.waterQuality.report.unsafe;
    }

    // Set the model output with appropriate Potability status
    setReport({
      chloramines: result.chloramines,
      sulfate: result.sulfate,
      organicCarbon: result.organicCarbon,
      potability
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto relative"
      style={{
        backgroundImage: "url('/bckgnd.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          zIndex: -1,
        }}
      />
      <LanguageSelector />

      <div className="text-center mb-10">
        <Droplets className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.waterQuality.title}</h1>
        <p className="text-gray-600">{t.waterQuality.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t.waterQuality.phLevel}</label>
            <input
              type="number"
              name="ph"
              value={formData.ph}
              onChange={handleChange}
              step="0.1"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t.waterQuality.hardness}</label>
            <input
              type="number"
              name="hardness"
              value={formData.hardness}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t.waterQuality.totalSolids}</label>
            <input
              type="number"
              name="solids"
              value={formData.solids}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full mt-8 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
        >
          {t.waterQuality.analyzeButton}
        </motion.button>
      </form>

      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.waterQuality.report.title}</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700">{t.waterQuality.report.chloramines}</h3>
                <p className="text-2xl font-bold text-blue-600">{report.chloramines} mg/L</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700">{t.waterQuality.report.sulfate}</h3>
                <p className="text-2xl font-bold text-blue-600">{(report.sulfate * 100).toFixed(2)} mg/L</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700">{t.waterQuality.report.organicCarbon}</h3>
                <p className="text-2xl font-bold text-blue-600">{(report.organicCarbon / 10000).toFixed(3)} mg/L</p>
              </div>

              <div className={`p-4 rounded-lg ${report.potability === t.waterQuality.report.safe ? 'bg-green-50' : 'bg-red-50'}`}>
                <h3 className="font-semibold text-gray-700">{t.waterQuality.report.potabilityStatus}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  {report.potability === t.waterQuality.report.safe ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-green-600 font-semibold">{t.waterQuality.report.safe}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-6 h-6 text-red-600" />
                      <span className="text-red-600 font-semibold">{t.waterQuality.report.unsafe}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">{t.waterQuality.report.recommendations}</h3>
            <p className="text-gray-600">
              {report.potability === t.waterQuality.report.safe
                ? t.waterQuality.report.safeMessage
                : t.waterQuality.report.unsafeMessage}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WaterQuality;
