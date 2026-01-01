import { useEffect, useRef, useCallback, useState } from 'react';

// Free audio URLs from reliable sources
const SOUND_URLS = {
  rain: 'https://www.soundjay.com/nature/rain-01.mp3',
  heavyRain: 'https://www.soundjay.com/nature/rain-03.mp3',
  thunder: 'https://www.soundjay.com/nature/thunder-01.mp3',
  wind: 'https://www.soundjay.com/nature/wind-howl-01.mp3',
  birds: 'https://www.soundjay.com/nature/birds-1.mp3',
};

// Web Audio API based sound generator for reliable fallback
class SoundGenerator {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.activeNodes = new Map();
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return this.audioContext;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.5;
      this.isInitialized = true;
      
      // Resume if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
    return this.audioContext;
  }

  // Generate rain sound using filtered noise
  async createRainSound(intensity = 0.5) {
    const ctx = await this.init();
    if (!ctx) return null;

    // Stop existing rain sound
    this.stopSound('rain');

    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    
    // Create stereo noise
    for (let channel = 0; channel < 2; channel++) {
      const output = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Bandpass filter for rain-like sound
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1000 + intensity * 2000;
    bandpass.Q.value = 0.5;

    // Low-pass for smoothness
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 3000 + intensity * 2000;

    // Gain control
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;

    // Connect nodes
    noise.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(this.masterGain);

    noise.start();

    // Fade in
    gainNode.gain.linearRampToValueAtTime(intensity * 0.4, ctx.currentTime + 2);

    this.activeNodes.set('rain', { noise, gainNode, bandpass, lowpass });
    return gainNode;
  }

  // Generate wind sound
  async createWindSound(intensity = 0.3) {
    const ctx = await this.init();
    if (!ctx) return null;

    this.stopSound('wind');

    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const output = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Bandpass for wind
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 400;
    bandpass.Q.value = 1;

    // LFO for wind modulation
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.1;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;

    noise.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(this.masterGain);

    lfo.start();
    noise.start();

    gainNode.gain.linearRampToValueAtTime(intensity * 0.3, ctx.currentTime + 2);

    this.activeNodes.set('wind', { noise, gainNode, lfo });
    return gainNode;
  }

  // Generate thunder sound
  async createThunderSound() {
    const ctx = await this.init();
    if (!ctx) return;

    const duration = 3;
    
    // Create rumble oscillator
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(50, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + duration);

    // Noise burst
    const bufferSize = duration * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filter for thunder
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 150;

    // Envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(lowpass);
    noiseSource.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start();
    noiseSource.start();
    oscillator.stop(ctx.currentTime + duration);
    noiseSource.stop(ctx.currentTime + duration);
  }

  // Generate pleasant bird chirping sounds
  async createBirdSounds() {
    const ctx = await this.init();
    if (!ctx) return null;

    this.stopSound('birds');

    // Create a more natural, pleasant bird sound
    const createChirp = () => {
      // Main oscillator for the chirp
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      // Use triangle waves for softer sound
      osc1.type = 'sine';
      osc2.type = 'sine';
      
      // Random bird-like frequencies (higher pitched, melodic)
      const baseFreq = 1200 + Math.random() * 800;
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc2.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime); // Harmonic
      
      // Frequency sweep for natural chirp sound
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, ctx.currentTime + 0.1);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, ctx.currentTime + 0.2);
      
      // Soft filter
      filter.type = 'lowpass';
      filter.frequency.value = 3000;
      filter.Q.value = 1;
      
      // Very gentle volume envelope
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      // Connect
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.4);
    };

    // Create a melodic sequence (like a real bird song)
    const createBirdSong = () => {
      const numNotes = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numNotes; i++) {
        setTimeout(() => createChirp(), i * (80 + Math.random() * 60));
      }
    };

    // Much less frequent chirping, more natural spacing
    let isActive = true;
    const scheduleNextChirp = () => {
      if (!isActive) return;
      
      // Random interval between 3-8 seconds
      const delay = 3000 + Math.random() * 5000;
      
      setTimeout(() => {
        if (isActive && Math.random() > 0.3) {
          createBirdSong();
        }
        scheduleNextChirp();
      }, delay);
    };

    // Start with a delay
    setTimeout(() => {
      if (isActive) {
        createBirdSong();
        scheduleNextChirp();
      }
    }, 2000);

    this.activeNodes.set('birds', { 
      stop: () => { isActive = false; }
    });
    
    return { stop: () => { isActive = false; } };
  }

  stopSound(key) {
    const nodes = this.activeNodes.get(key);
    if (!nodes) return;

    try {
      if (nodes.noise) {
        nodes.gainNode?.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
        setTimeout(() => {
          try { nodes.noise.stop(); } catch (e) {}
        }, 600);
      }
      if (nodes.lfo) {
        try { nodes.lfo.stop(); } catch (e) {}
      }
      if (nodes.interval) {
        clearInterval(nodes.interval);
      }
      if (nodes.stop) {
        nodes.stop();
      }
    } catch (e) {}
    
    this.activeNodes.delete(key);
  }

  stopAll() {
    for (const key of this.activeNodes.keys()) {
      this.stopSound(key);
    }
  }

  setMasterVolume(value) {
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.linearRampToValueAtTime(value, this.audioContext.currentTime + 0.3);
    }
  }

  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}

const useSoundManager = () => {
  const soundGeneratorRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isInitialized, setIsInitialized] = useState(false);
  const currentWeatherRef = useRef('clear');
  const thunderIntervalRef = useRef(null);

  // Initialize sound generator
  useEffect(() => {
    soundGeneratorRef.current = new SoundGenerator();
    return () => {
      if (soundGeneratorRef.current) {
        soundGeneratorRef.current.stopAll();
      }
      if (thunderIntervalRef.current) {
        clearInterval(thunderIntervalRef.current);
      }
    };
  }, []);

  // Play weather-specific sounds
  const playWeatherSound = useCallback(async (weatherType, windSpeed = 0) => {
    if (!isEnabled || !soundGeneratorRef.current) return;

    // Initialize on first play
    if (!isInitialized) {
      await soundGeneratorRef.current.init();
      setIsInitialized(true);
    }

    // Stop all current sounds
    soundGeneratorRef.current.stopAll();
    
    if (thunderIntervalRef.current) {
      clearInterval(thunderIntervalRef.current);
      thunderIntervalRef.current = null;
    }

    // Small delay before starting new sounds
    await new Promise(resolve => setTimeout(resolve, 300));

    switch (weatherType) {
      case 'rain':
      case 'drizzle':
        await soundGeneratorRef.current.createRainSound(0.5);
        break;

      case 'heavy-rain':
        await soundGeneratorRef.current.createRainSound(0.9);
        await soundGeneratorRef.current.createWindSound(0.2);
        break;

      case 'thunderstorm':
        await soundGeneratorRef.current.createRainSound(0.8);
        await soundGeneratorRef.current.createWindSound(0.3);
        
        // Random thunder
        thunderIntervalRef.current = setInterval(() => {
          if (currentWeatherRef.current === 'thunderstorm' && Math.random() > 0.5) {
            soundGeneratorRef.current.createThunderSound();
          }
        }, 5000 + Math.random() * 10000);
        
        // Initial thunder
        setTimeout(() => {
          soundGeneratorRef.current.createThunderSound();
        }, 1000);
        break;

      case 'snow':
      case 'heavy-snow':
        await soundGeneratorRef.current.createWindSound(0.4);
        break;

      case 'cloudy':
      case 'partly-cloudy':
        if (windSpeed > 5) {
          await soundGeneratorRef.current.createWindSound(windSpeed / 30);
        }
        break;

      case 'fog':
        await soundGeneratorRef.current.createWindSound(0.1);
        break;

      case 'clear':
      default:
        await soundGeneratorRef.current.createBirdSounds();
        break;
    }

    currentWeatherRef.current = weatherType;
  }, [isEnabled, isInitialized]);

  // Handle weather changes
  const handleWeatherChange = useCallback((weatherType, isNight, windSpeed) => {
    // No bird sounds at night for clear weather
    if (weatherType === 'clear' && isNight) {
      soundGeneratorRef.current?.stopAll();
      return;
    }
    
    playWeatherSound(weatherType, windSpeed);
  }, [playWeatherSound]);

  // Toggle sound
  const toggleSound = useCallback(async () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    
    if (!newEnabled) {
      soundGeneratorRef.current?.stopAll();
      if (thunderIntervalRef.current) {
        clearInterval(thunderIntervalRef.current);
        thunderIntervalRef.current = null;
      }
    } else {
      // Resume and replay current weather sound
      await soundGeneratorRef.current?.resume();
      playWeatherSound(currentWeatherRef.current);
    }
  }, [isEnabled, playWeatherSound]);

  // Adjust volume
  const adjustVolume = useCallback((newVolume) => {
    setVolume(newVolume);
    soundGeneratorRef.current?.setMasterVolume(newVolume);
  }, []);

  // Resume audio context on user interaction
  const resumeAudio = useCallback(async () => {
    if (soundGeneratorRef.current) {
      await soundGeneratorRef.current.resume();
      if (!isInitialized) {
        await soundGeneratorRef.current.init();
        setIsInitialized(true);
      }
    }
  }, [isInitialized]);

  return {
    handleWeatherChange,
    toggleSound,
    adjustVolume,
    resumeAudio,
    isEnabled,
    volume
  };
};

export default useSoundManager;
