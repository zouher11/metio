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
      'https://api.openweathermap.org/data/2.5/forecast',
      {
        params: { q: city, appid: WEATHER_API_KEY, units: 'metric' }
      }
    );

    const data = response.data;
    const forecast = data.list.slice(0, 8).map(item => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      weatherCode: item.weather[0].id,
      windSpeed: item.wind.speed,
      humidity: item.main.humidity
    }));

    res.json({
      city: data.city.name,
      country: data.city.country,
      forecast
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch forecast data' });
    }
  }
};
