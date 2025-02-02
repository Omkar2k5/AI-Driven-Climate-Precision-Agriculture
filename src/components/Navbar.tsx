import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane as Plant, Droplets, Cloud } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-green-700' : '';
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Plant className="h-8 w-8" />
            <span className="font-bold text-xl">AgroClimate AI</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link
              to="/crop-recommendation"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-700 transition-colors ${isActive('/crop-recommendation')}`}
            >
              <Plant className="h-5 w-5" />
              <span>Crop Recommendation</span>
            </Link>
            
            <Link
              to="/water-quality"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-700 transition-colors ${isActive('/water-quality')}`}
            >
              <Droplets className="h-5 w-5" />
              <span>Water Quality</span>
            </Link>
            
            <Link
              to="/weather-updates"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-700 transition-colors ${isActive('/weather-updates')}`}
            >
              <Cloud className="h-5 w-5" />
              <span>Weather Updates</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;