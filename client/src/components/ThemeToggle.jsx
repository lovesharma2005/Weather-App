import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <div className="theme-toggle">
      <button 
        className={`theme-toggle-button ${isDark ? 'dark' : 'light'}`}
        onClick={onToggle}
        aria-label="Toggle theme"
      >
        {isDark ? '🌙' : '☀️'}
      </button>
    </div>
  );
};

export default ThemeToggle; 