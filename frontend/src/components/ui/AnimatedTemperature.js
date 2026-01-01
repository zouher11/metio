import React, { useEffect, useState, useRef } from 'react';
import './AnimatedTemperature.css';

const AnimatedTemperature = ({ value, unit = '°C' }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValue = useRef(value);
  const animationRef = useRef(null);

  useEffect(() => {
    if (value === previousValue.current) return;

    setIsAnimating(true);
    const startValue = previousValue.current;
    const endValue = value;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (endValue - startValue) * easeProgress;
      setDisplayValue(Math.round(currentValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        setIsAnimating(false);
        previousValue.current = endValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value]);

  // Determine color based on temperature
  const getTemperatureColor = () => {
    if (displayValue <= 0) return 'cold';
    if (displayValue <= 10) return 'cool';
    if (displayValue <= 20) return 'mild';
    if (displayValue <= 30) return 'warm';
    return 'hot';
  };

  return (
    <div className={`animated-temperature ${getTemperatureColor()} ${isAnimating ? 'animating' : ''}`}>
      <span className="temp-digits">
        {displayValue.toString().split('').map((digit, index) => (
          <span 
            key={index} 
            className="temp-digit"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {digit}
          </span>
        ))}
      </span>
      <span className="temp-unit">{unit}</span>
    </div>
  );
};

export default AnimatedTemperature;
