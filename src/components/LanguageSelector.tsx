import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex justify-end mb-4">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
      >
        <option value="english">English</option>
        <option value="hindi">हिंदी</option>
        <option value="marathi">मराठी</option>
      </select>
    </div>
  );
}; 