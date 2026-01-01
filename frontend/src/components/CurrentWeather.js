import React from 'react';
import AnimatedTemperature from './ui/AnimatedTemperature';
import AnimatedWeatherIcon from './ui/AnimatedWeatherIcon';
import './CurrentWeather.css';

function CurrentWeather({ weather }) {
  const isNight = weather.icon && weather.icon.includes('n');

  return (
    <div className="current-weather">
      <div className="weather-card glass">
        <div className="weather-main">
          <div className="weather-location">
            <h2>{weather.city}</h2>
            <span className="country-badge">{weather.country}</span>
          </div>
          
          <div className="weather-display">
            <div className="weather-icon-container">
              <AnimatedWeatherIcon 
                weatherCode={weather.weatherCode}
                description={weather.description}
                isNight={isNight}
              />
            </div>
            
            <div className="temperature-display">
              <AnimatedTemperature 
                value={Math.round(weather.temperature)} 
                unit="°C"
              />
              <p className="weather-description">{weather.description}</p>
            </div>
          </div>
        </div>

        <div className="weather-details-grid">
          <div className="detail-card">
            <div className="detail-icon">🌡️</div>
            <div className="detail-info">
              <span className="detail-value">{Math.round(weather.feelsLike)}°C</span>
              <span className="detail-label">Feels Like</span>
            </div>
          </div>
          
          <div className="detail-card">
            <div className="detail-icon">💧</div>
            <div className="detail-info">
              <span className="detail-value">{weather.humidity}%</span>
              <span className="detail-label">Humidity</span>
            </div>
          </div>
          
          <div className="detail-card">
            <div className="detail-icon">💨</div>
            <div className="detail-info">
              <span className="detail-value">{weather.windSpeed} m/s</span>
              <span className="detail-label">Wind Speed</span>
            </div>
          </div>
          
          <div className="detail-card">
            <div className="detail-icon">📊</div>
            <div className="detail-info">
              <span className="detail-value">{weather.pressure} hPa</span>
              <span className="detail-label">Pressure</span>
            </div>
          </div>
          
          <div className="detail-card">
            <div className="detail-icon">☁️</div>
            <div className="detail-info">
              <span className="detail-value">{weather.cloudiness}%</span>
              <span className="detail-label">Cloudiness</span>
            </div>
          </div>
          
          <div className="detail-card">
            <div className="detail-icon">👁️</div>
            <div className="detail-info">
              <span className="detail-value">{weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : 'N/A'}</span>
              <span className="detail-label">Visibility</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;
