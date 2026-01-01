import React from 'react';
import AnimatedWeatherIcon from './ui/AnimatedWeatherIcon';
import './Forecast.css';

function Forecast({ forecast }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    if (isToday) {
      return {
        day: 'Today',
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      };
    }
    
    if (isTomorrow) {
      return {
        day: 'Tomorrow',
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      };
    }
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  const isNight = (icon) => icon && icon.includes('n');

  return (
    <div className="forecast">
      <h3 className="forecast-title">
        <span className="title-icon">📅</span>
        5-Day Forecast
      </h3>
      
      <div className="forecast-scroll">
        <div className="forecast-container">
          {forecast.forecast.map((item, index) => {
            const dateInfo = formatDate(item.date);
            return (
              <div 
                key={index} 
                className="forecast-item glass"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="forecast-time">
                  <span className="forecast-day">{dateInfo.day}</span>
                  <span className="forecast-hour">{dateInfo.time}</span>
                </div>
                
                <div className="forecast-icon-wrapper">
                  <AnimatedWeatherIcon 
                    weatherCode={item.weatherCode}
                    description={item.description}
                    isNight={isNight(item.icon)}
                  />
                </div>
                
                <div className="forecast-temp">
                  <span className="temp-value">{Math.round(item.temperature)}°</span>
                </div>
                
                <p className="forecast-desc">{item.description}</p>
                
                <div className="forecast-meta">
                  <div className="meta-item">
                    <span className="meta-icon">💨</span>
                    <span>{item.windSpeed} m/s</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">💧</span>
                    <span>{item.humidity}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Forecast;
