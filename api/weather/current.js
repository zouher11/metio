const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { city } = req.query;
  const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  if (!WEATHER_API_KEY) {
    return res.status(500).json({ error: 'Weather API key not configured' });
  }

  try {
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: { q: city, appid: WEATHER_API_KEY, units: 'metric' }
      }
    );

    const data = response.data;

    res.json({
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      weatherCode: data.weather[0].id,
      windSpeed: data.wind.speed,
      cloudiness: data.clouds.all,
      visibility: data.visibility,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  }
};
