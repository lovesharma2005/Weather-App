// client/src/App.js
import React from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ThemeToggle from './components/ThemeToggle';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Define API URL based on environment
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    
    try {
      const response = await axios.get(`${API_URL}/api/weather`, {
        params: { city }
      });
      setWeatherData(response.data);
    } catch (err) {
      let errorMessage;
      if (err.response?.status === 404) {
        errorMessage = 'City not found. Please check the spelling and try again.';
      } else if (err.response?.status === 401) {
        errorMessage = 'API key error. Please contact support.';
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network and try again.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else {
        errorMessage = 'Failed to fetch weather data. Please try again later.';
      }
      setError(errorMessage);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="App-header">
        <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
        <h1>Weather Dashboard</h1>
        <SearchBar onSearch={fetchWeatherData} disabled={loading} />
        
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Fetching weather data...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <p className="error-text">{error}</p>
            <small>Please try searching for another city</small>
          </div>
        )}
        
        {weatherData && !loading && !error && (
          <WeatherCard weatherData={weatherData} isDark={isDarkMode} />
        )}
      </header>
    </div>
  );
}

export default App;