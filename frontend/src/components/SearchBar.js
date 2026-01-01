import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [city, setCity] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setCity('');
      inputRef.current?.blur();
    }
  };

  // Popular cities for quick access
  const quickCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];

  return (
    <div className="search-container">
      <form className={`search-bar ${isFocused ? 'focused' : ''}`} onSubmit={handleSubmit}>
        <div className="search-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        <button type="submit" className="search-button" disabled={!city.trim()}>
          <span className="button-text">Search</span>
          <span className="button-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </form>
      
      <div className="quick-search">
        <span className="quick-label">Quick search:</span>
        <div className="quick-cities">
          {quickCities.map((quickCity) => (
            <button
              key={quickCity}
              type="button"
              className="quick-city-btn"
              onClick={() => onSearch(quickCity)}
            >
              {quickCity}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
