require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';

/**
 * Quote endpoint - uses local array of quotes
 */
const QUOTES = [
  { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Do what you can with what you have where you are.", author: "Theodore Roosevelt" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Success is not final; failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" }
];

app.get('/api/quote', (req, res) => {
  try {
    const idx = Math.floor(Math.random() * QUOTES.length);
    res.json({ success: true, quote: QUOTES[idx] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Could not get quote.' });
  }
});

/**
 * Weather endpoint
 * Accepts optional query: city (default: London)
 * Returns simplified response with temp (C) and description
 */
app.get('/api/weather', async (req, res) => {
  const city = req.query.city || 'London';
  if (!OPENWEATHER_API_KEY) {
    return res.status(500).json({ success: false, error: 'Weather API key not configured on server.' });
  }

  try {
    // OpenWeatherMap Current Weather API (metric units)
    const url = `https://api.openweathermap.org/data/2.5/weather`;
    const response = await axios.get(url, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    const data = response.data;
    const simplified = {
      city: data.name,
      country: data.sys?.country || '',
      temperatureC: data.main?.temp,
      condition: data.weather && data.weather[0] ? data.weather[0].description : '',
      icon: data.weather && data.weather[0] ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` : null
    };

    res.json({ success: true, weather: simplified });
  } catch (err) {
    console.error('Weather error', err?.response?.data || err.message);
    res.status(500).json({ success: false, error: 'Could not fetch weather data.' });
  }
});

/**
 * Currency endpoint
 * Query param: amount (INR). Default 100.
 * Uses exchangerate.host (free) to get rates (base INR)
 */
app.get('/api/currency', async (req, res) => {
  const raw = req.query.amount || '100';
  const amount = Number(raw);
  if (Number.isNaN(amount) || amount < 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount. Provide a positive number in query param ?amount=...' });
  }

  try {
    // New working API endpoint
    const ratesResp = await axios.get('https://open.er-api.com/v6/latest/INR');

    const rates = ratesResp.data && ratesResp.data.rates ? ratesResp.data.rates : null;
    if (!rates) throw new Error('Bad rates response');

    const usd = +(amount * rates.USD).toFixed(4);
    const eur = +(amount * rates.EUR).toFixed(4);

    res.json({ success: true, base: 'INR', amount, results: { USD: usd, EUR: eur }, rates });
  } catch (err) {
    console.error('Currency error', err?.response?.data || err.message);
    res.status(500).json({ success: false, error: 'Could not fetch currency rates.' });
  }
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => res.json({ success: true, uptime: process.uptime() }));

/**
 * Serve
 */
app.listen(PORT, () => {
  console.log(`InfoHub server running on port ${PORT}`);
});
