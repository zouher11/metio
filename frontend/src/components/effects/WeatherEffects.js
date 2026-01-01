import React, { useEffect, useRef, useState, useCallback } from 'react';
import './WeatherEffects.css';

// Weather type mapping based on OpenWeatherMap codes
const getWeatherType = (weatherCode, description) => {
  if (!weatherCode) return 'clear';
  
  const code = weatherCode.toString();
  const desc = (description || '').toLowerCase();
  
  // Thunderstorm
  if (code.startsWith('2')) return 'thunderstorm';
  // Drizzle
  if (code.startsWith('3')) return 'drizzle';
  // Rain
  if (code.startsWith('5')) {
    if (code === '502' || code === '503' || code === '504') return 'heavy-rain';
    return 'rain';
  }
  // Snow
  if (code.startsWith('6')) {
    if (code === '602' || code === '622') return 'heavy-snow';
    return 'snow';
  }
  // Atmosphere (fog, mist, etc.)
  if (code.startsWith('7')) {
    if (code === '781') return 'tornado';
    return 'fog';
  }
  // Clear
  if (code === '800') return 'clear';
  // Clouds
  if (code.startsWith('8')) {
    if (code === '801' || code === '802') return 'partly-cloudy';
    return 'cloudy';
  }
  
  return 'clear';
};

// Check if it's night based on icon code
const isNightTime = (iconCode) => {
  return iconCode && iconCode.includes('n');
};

// Rain particle component
const RainParticle = ({ style, intensity }) => (
  <div 
    className={`rain-drop intensity-${intensity}`} 
    style={style}
  />
);

// Snow particle component
const SnowParticle = ({ style, size }) => (
  <div 
    className={`snow-flake size-${size}`} 
    style={style}
  />
);

// Lightning flash component
const Lightning = ({ active }) => (
  <div className={`lightning ${active ? 'flash' : ''}`} />
);

// Cloud component
const Cloud = ({ style, type }) => (
  <div className={`cloud cloud-${type}`} style={style}>
    <div className="cloud-part cloud-main" />
    <div className="cloud-part cloud-left" />
    <div className="cloud-part cloud-right" />
  </div>
);

// Sun component with rays
const Sun = ({ isVisible }) => (
  <div className={`sun-container ${isVisible ? 'visible' : ''}`}>
    <div className="sun">
      <div className="sun-core" />
      <div className="sun-rays">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="sun-ray" style={{ transform: `rotate(${i * 30}deg)` }} />
        ))}
      </div>
    </div>
    <div className="god-rays">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="god-ray" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
    </div>
  </div>
);

// Moon component
const Moon = ({ isVisible }) => (
  <div className={`moon-container ${isVisible ? 'visible' : ''}`}>
    <div className="moon">
      <div className="moon-crater crater-1" />
      <div className="moon-crater crater-2" />
      <div className="moon-crater crater-3" />
    </div>
    <div className="moon-glow" />
  </div>
);

// Stars component for night sky
const Stars = ({ isNight }) => (
  <div className={`stars-container ${isNight ? 'visible' : ''}`}>
    {[...Array(100)].map((_, i) => (
      <div 
        key={i} 
        className="star" 
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 60}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`
        }}
      />
    ))}
  </div>
);

// Fog layer component
const FogLayer = ({ depth }) => (
  <div className={`fog-layer fog-depth-${depth}`}>
    <div className="fog-wave fog-wave-1" />
    <div className="fog-wave fog-wave-2" />
    <div className="fog-wave fog-wave-3" />
  </div>
);

// Interactive ripple effect
const Ripple = ({ x, y, id }) => (
  <div 
    className="ripple" 
    style={{ left: x, top: y }}
    key={id}
  />
);

const WeatherEffects = ({ weather, onWeatherChange }) => {
  const containerRef = useRef(null);
  const [rainDrops, setRainDrops] = useState([]);
  const [snowFlakes, setSnowFlakes] = useState([]);
  const [lightningActive, setLightningActive] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [clouds, setClouds] = useState([]);
  const animationFrameRef = useRef();
  const lastTimeRef = useRef(0);
  
  const weatherType = weather ? getWeatherType(weather.weatherCode, weather.description) : 'clear';
  const isNight = weather ? isNightTime(weather.icon) : false;
  const windSpeed = weather?.windSpeed || 0;
  
  // Notify parent of weather change for audio
  useEffect(() => {
    if (onWeatherChange) {
      onWeatherChange(weatherType, isNight, windSpeed);
    }
  }, [weatherType, isNight, windSpeed, onWeatherChange]);

  // Generate rain particles
  const generateRainDrops = useCallback((count) => {
    const drops = [];
    for (let i = 0; i < count; i++) {
      drops.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 0.5 + Math.random() * 0.3,
        animationDelay: Math.random() * 2,
        intensity: Math.floor(Math.random() * 3) + 1
      });
    }
    return drops;
  }, []);

  // Generate snow particles
  const generateSnowFlakes = useCallback((count) => {
    const flakes = [];
    for (let i = 0; i < count; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 5 + Math.random() * 10,
        animationDelay: Math.random() * 5,
        size: Math.floor(Math.random() * 3) + 1
      });
    }
    return flakes;
  }, []);

  // Generate clouds
  const generateClouds = useCallback((count, isThick = false) => {
    const cloudList = [];
    for (let i = 0; i < count; i++) {
      cloudList.push({
        id: i,
        top: 5 + Math.random() * 25,
        animationDuration: 60 + Math.random() * 60,
        animationDelay: -Math.random() * 60,
        scale: 0.5 + Math.random() * 1,
        opacity: isThick ? 0.8 + Math.random() * 0.2 : 0.4 + Math.random() * 0.4,
        type: Math.floor(Math.random() * 3) + 1
      });
    }
    return cloudList;
  }, []);

  // Lightning effect for thunderstorms
  useEffect(() => {
    if (weatherType !== 'thunderstorm') {
      setLightningActive(false);
      return;
    }

    const triggerLightning = () => {
      setLightningActive(true);
      setTimeout(() => setLightningActive(false), 100);
      
      // Sometimes double flash
      if (Math.random() > 0.5) {
        setTimeout(() => {
          setLightningActive(true);
          setTimeout(() => setLightningActive(false), 50);
        }, 150);
      }
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        triggerLightning();
      }
    }, 3000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, [weatherType]);

  // Setup particles based on weather
  useEffect(() => {
    switch (weatherType) {
      case 'rain':
        setRainDrops(generateRainDrops(100));
        setSnowFlakes([]);
        setClouds(generateClouds(8, true));
        break;
      case 'heavy-rain':
      case 'thunderstorm':
        setRainDrops(generateRainDrops(200));
        setSnowFlakes([]);
        setClouds(generateClouds(12, true));
        break;
      case 'drizzle':
        setRainDrops(generateRainDrops(50));
        setSnowFlakes([]);
        setClouds(generateClouds(6, false));
        break;
      case 'snow':
        setSnowFlakes(generateSnowFlakes(100));
        setRainDrops([]);
        setClouds(generateClouds(6, false));
        break;
      case 'heavy-snow':
        setSnowFlakes(generateSnowFlakes(200));
        setRainDrops([]);
        setClouds(generateClouds(10, true));
        break;
      case 'cloudy':
        setRainDrops([]);
        setSnowFlakes([]);
        setClouds(generateClouds(10, true));
        break;
      case 'partly-cloudy':
        setRainDrops([]);
        setSnowFlakes([]);
        setClouds(generateClouds(5, false));
        break;
      case 'fog':
        setRainDrops([]);
        setSnowFlakes([]);
        setClouds(generateClouds(4, false));
        break;
      case 'clear':
      default:
        setRainDrops([]);
        setSnowFlakes([]);
        setClouds(generateClouds(2, false));
        break;
    }
  }, [weatherType, generateRainDrops, generateSnowFlakes, generateClouds]);

  // Handle click for ripple effect during rain
  const handleClick = useCallback((e) => {
    if (!['rain', 'heavy-rain', 'drizzle', 'thunderstorm'].includes(weatherType)) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
  }, [weatherType]);

  // Get background gradient based on weather and time
  const getBackgroundClass = () => {
    let base = `weather-bg weather-${weatherType}`;
    if (isNight) base += ' night';
    return base;
  };

  return (
    <div 
      ref={containerRef}
      className={getBackgroundClass()}
      onClick={handleClick}
    >
      {/* Animated gradient overlay */}
      <div className="gradient-overlay" />
      
      {/* Stars for night */}
      <Stars isNight={isNight} />
      
      {/* Sun for clear/partly-cloudy days */}
      <Sun isVisible={!isNight && ['clear', 'partly-cloudy'].includes(weatherType)} />
      
      {/* Moon for night */}
      <Moon isVisible={isNight} />
      
      {/* Clouds */}
      <div className="clouds-container">
        {clouds.map(cloud => (
          <Cloud 
            key={cloud.id}
            type={cloud.type}
            style={{
              top: `${cloud.top}%`,
              animationDuration: `${cloud.animationDuration}s`,
              animationDelay: `${cloud.animationDelay}s`,
              transform: `scale(${cloud.scale})`,
              opacity: cloud.opacity
            }}
          />
        ))}
      </div>
      
      {/* Fog layers */}
      {weatherType === 'fog' && (
        <div className="fog-container">
          <FogLayer depth={1} />
          <FogLayer depth={2} />
          <FogLayer depth={3} />
        </div>
      )}
      
      {/* Rain particles */}
      {rainDrops.length > 0 && (
        <div className="rain-container">
          {rainDrops.map(drop => (
            <RainParticle
              key={drop.id}
              intensity={drop.intensity}
              style={{
                left: `${drop.left}%`,
                animationDuration: `${drop.animationDuration}s`,
                animationDelay: `${drop.animationDelay}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Snow particles */}
      {snowFlakes.length > 0 && (
        <div className="snow-container">
          {snowFlakes.map(flake => (
            <SnowParticle
              key={flake.id}
              size={flake.size}
              style={{
                left: `${flake.left}%`,
                animationDuration: `${flake.animationDuration}s`,
                animationDelay: `${flake.animationDelay}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Lightning */}
      <Lightning active={lightningActive} />
      
      {/* Interactive ripples */}
      <div className="ripples-container">
        {ripples.map(ripple => (
          <Ripple key={ripple.id} x={ripple.x} y={ripple.y} />
        ))}
      </div>
      
      {/* Wind streaks for strong wind */}
      {windSpeed > 10 && (
        <div className="wind-container">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="wind-streak"
              style={{
                top: `${Math.random() * 100}%`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.1 + Math.random() * 0.2
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherEffects;
