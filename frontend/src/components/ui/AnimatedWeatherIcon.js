import React from 'react';
import './AnimatedWeatherIcon.css';

const AnimatedWeatherIcon = ({ weatherCode, description, isNight }) => {
  const getWeatherType = () => {
    if (!weatherCode) return 'clear';
    const code = weatherCode.toString();
    
    if (code.startsWith('2')) return 'thunderstorm';
    if (code.startsWith('3')) return 'drizzle';
    if (code.startsWith('5')) return 'rain';
    if (code.startsWith('6')) return 'snow';
    if (code.startsWith('7')) return 'fog';
    if (code === '800') return 'clear';
    if (code.startsWith('8')) return 'cloudy';
    
    return 'clear';
  };

  const weatherType = getWeatherType();

  return (
    <div className={`animated-weather-icon weather-icon-${weatherType} ${isNight ? 'night' : 'day'}`}>
      {/* Sun */}
      {(weatherType === 'clear' || weatherType === 'cloudy') && !isNight && (
        <div className="icon-sun">
          <div className="sun-body" />
          <div className="sun-rays-container">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="ray" style={{ transform: `rotate(${i * 45}deg)` }} />
            ))}
          </div>
        </div>
      )}

      {/* Moon */}
      {(weatherType === 'clear') && isNight && (
        <div className="icon-moon">
          <div className="moon-body">
            <div className="moon-crater c1" />
            <div className="moon-crater c2" />
            <div className="moon-crater c3" />
          </div>
          <div className="moon-glow" />
        </div>
      )}

      {/* Stars for night */}
      {isNight && weatherType === 'clear' && (
        <div className="icon-stars">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="icon-star"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${10 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Clouds */}
      {(weatherType === 'cloudy' || weatherType === 'rain' || weatherType === 'drizzle' || weatherType === 'snow' || weatherType === 'thunderstorm') && (
        <div className="icon-clouds">
          <div className="icon-cloud cloud-1">
            <div className="cloud-puff p1" />
            <div className="cloud-puff p2" />
            <div className="cloud-puff p3" />
          </div>
          {weatherType !== 'cloudy' && (
            <div className="icon-cloud cloud-2">
              <div className="cloud-puff p1" />
              <div className="cloud-puff p2" />
              <div className="cloud-puff p3" />
            </div>
          )}
        </div>
      )}

      {/* Rain drops */}
      {(weatherType === 'rain' || weatherType === 'drizzle') && (
        <div className="icon-rain">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="icon-drop"
              style={{
                left: `${20 + i * 12}%`,
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Snow flakes */}
      {weatherType === 'snow' && (
        <div className="icon-snow">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="icon-flake"
              style={{
                left: `${20 + i * 12}%`,
                animationDelay: `${i * 0.2}s`,
                fontSize: `${6 + Math.random() * 4}px`
              }}
            >
              ❄
            </div>
          ))}
        </div>
      )}

      {/* Lightning */}
      {weatherType === 'thunderstorm' && (
        <div className="icon-lightning">
          <svg viewBox="0 0 24 24" className="lightning-bolt">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
          </svg>
        </div>
      )}

      {/* Fog */}
      {weatherType === 'fog' && (
        <div className="icon-fog">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="fog-line"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedWeatherIcon;
