import React, { useState, useCallback, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import WeatherEffects from './components/effects/WeatherEffects';
import SoundControls from './components/controls/SoundControls';
import useSoundManager from './hooks/useSoundManager';
import './App.css';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchedCity, setSearchedCity] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sound manager hook
  const { 
    handleWeatherChange, 
    toggleSound, 
    adjustVolume, 
    resumeAudio,
    isEnabled: soundEnabled, 
    volume 
  } = useSoundManager();

  // Handle weather change for effects and sounds
  const onWeatherEffectChange = useCallback((weatherType, isNight, windSpeed) => {
    handleWeatherChange(weatherType, isNight, windSpeed);
  }, [handleWeatherChange]);

  // Resume audio on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      resumeAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [resumeAudio]);

  const handleSearch = async (city) => {
    setSearchedCity(city);
    setLoading(true);
    setError(null);
    setIsTransitioning(true);

    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `/api/weather/current?city=${encodeURIComponent(city)}`
      );

      if (!currentResponse.ok) {
        if (currentResponse.status === 404) {
          throw new Error('City not found');
        }
        throw new Error('Failed to fetch current weather');
      }

      const currentData = await currentResponse.json();
      
      // Smooth transition between weather states
      setTimeout(() => {
        setCurrentWeather(currentData);
        setIsTransitioning(false);
      }, 300);

      // Fetch forecast
      const forecastResponse = await fetch(
        `/api/weather/forecast?city=${encodeURIComponent(city)}`
      );

      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast');
      }

      const forecastData = await forecastResponse.json();
      setForecast(forecastData);
    } catch (err) {
      setError(err.message);
      setCurrentWeather(null);
      setForecast(null);
      setIsTransitioning(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Dynamic weather background effects */}
      <WeatherEffects 
        weather={currentWeather} 
        onWeatherChange={onWeatherEffectChange}
      />
      
      {/* Main content */}
      <div className={`app-content ${isTransitioning ? 'transitioning' : ''}`}>
        <header className="app-header">
          <h1 className="app-title">
            <span className="title-icon">☁️</span>
            Metio
            <span className="title-accent">Weather</span>
          </h1>
          <p className="app-subtitle">Immersive weather experience</p>
        </header>

        <SearchBar onSearch={handleSearch} />

        {loading && (
          <div className="loading">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <span>Fetching weather data...</span>
          </div>
        )}

        {error && (
          <div className="error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {currentWeather && (
          <CurrentWeather weather={currentWeather} />
        )}

        {forecast && (
          <Forecast forecast={forecast} />
        )}

        {!loading && !currentWeather && !error && (
          <div className="welcome">
            <div className="welcome-icon">🌤️</div>
            <h2>Welcome to Metio</h2>
            <p>Search for a city to experience immersive weather</p>
            <div className="welcome-features">
              <div className="feature">
                <span>🎨</span>
                <span>Dynamic Visuals</span>
              </div>
              <div className="feature">
                <span>🔊</span>
                <span>Ambient Sounds</span>
              </div>
              <div className="feature">
                <span>✨</span>
                <span>Real-time Effects</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sound controls */}
      <SoundControls 
        isEnabled={soundEnabled}
        volume={volume}
        onToggle={toggleSound}
        onVolumeChange={adjustVolume}
      />
    </div>
  );
}

export default App;
