import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, AlertCircle, CheckCircle } from 'lucide-react';

const WaterQuality = () => {
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
    let potability = 'Safe for consumption';

    if (
      ph < 7 || ph > 8 ||
      hardness > 120 ||
      solids > 500
    ) {
      potability = 'Not safe for consumption';
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
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <Droplets className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Water Quality Analysis</h1>
        <p className="text-gray-600">Analyze water parameters to ensure safety and suitability</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">pH Level</label>
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
            <label className="block text-sm font-medium text-gray-700">Hardness (mg/L)</label>
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
            <label className="block text-sm font-medium text-gray-700">Total Solids (mg/L)</label>
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
          Analyze Water Quality
        </motion.button>
      </form>

      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
         <h2 className="text-2xl font-bold text-gray-800 mb-6">Water Quality Report</h2>

<div className="grid md:grid-cols-2 gap-6 mb-8">
  <div className="space-y-4">
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold text-gray-700">Chloramines</h3>
      <p className="text-2xl font-bold text-blue-600">{report.chloramines} mg/L</p>
    </div>

    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold text-gray-700">Sulfate</h3>
      {/* Multiply by 100 and format to 2 decimals */}
      <p className="text-2xl font-bold text-blue-600">{(report.sulfate * 100).toFixed(2)} mg/L</p>
    </div>
  </div>

  <div className="space-y-4">
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold text-gray-700">Organic Carbon</h3>
      {/* Divide by 10000 and format to 3 decimals */}
      <p className="text-2xl font-bold text-blue-600">{(report.organicCarbon / 10000).toFixed(3)} mg/L</p>
    </div>

    <div className={`p-4 rounded-lg ${report.potability === 'Safe for consumption' ? 'bg-green-50' : 'bg-red-50'}`}>
      <h3 className="font-semibold text-gray-700">Potability Status</h3>
      <div className="flex items-center space-x-2 mt-2">
        {report.potability === 'Safe for consumption' ? (
          <>
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-green-600 font-semibold">Safe for consumption</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-6 h-6 text-red-600" />
            <span className="text-red-600 font-semibold">Not safe for consumption</span>
          </>
        )}
      </div>
    </div>
  </div>
</div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Recommendations</h3>
            <p className="text-gray-600">
              {report.potability === 'Safe for consumption'
                ? "The water sample meets safety standards for consumption. Regular monitoring is recommended to maintain water quality."
                : "The water sample does not meet safety standards. Consider water treatment or consulting with water quality experts for remediation steps."}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WaterQuality;
