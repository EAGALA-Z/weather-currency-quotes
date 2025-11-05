import React, { useState, useEffect } from 'react'
import axios from 'axios'
import sunny from '../assets/sunny.jpg'
import rain from '../assets/rain.jpg'
import snow from '../assets/snow.jpg'
import cloudy from '../assets/cloudy.jpg'

const backgroundMap = {
  Clear: sunny,
  Clouds: cloudy,
  Rain: rain,
  Drizzle: rain,
  Thunderstorm: rain,
  Snow: snow,
  Mist: cloudy,
  Haze: cloudy,
  Fog: cloudy,
}

export default function WeatherPage() {
  const [city, setCity] = useState('London')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bg, setBg] = useState(sunny)

  const fetchWeather = async (q) => {
    setLoading(true)
    setError('')
    try {
      const resp = await axios.get('/api/weather', { params: { city: q } })
      if (resp.data?.success) {
        const w = resp.data.weather
        setWeather(w)
        const key =
          Object.keys(backgroundMap).find((k) =>
            (w.condition || '').toLowerCase().includes(k.toLowerCase())
          ) || 'Clear'
        setBg(backgroundMap[key] || sunny)
      } else {
        setError('Weather not found')
      }
    } catch {
      setError('Unable to fetch weather')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather(city)
  }, [])

  return (
    <div className="page weather-page" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay card-large centered-column">
        <div className="search-top">
          <input
            className="search-input"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchWeather(city)}
          />
          <button className="btn-primary" onClick={() => fetchWeather(city)}>
            Get
          </button>
        </div>

        {loading && <div className="muted small">Loading...</div>}
        {error && <div className="error">{error}</div>}

        {weather && !loading && !error && (
          <>
            <h2 className="city-name">{weather.city}, {weather.country}</h2>
            <img src={weather.icon} alt={weather.condition} width="100" />
            <h1 className="temp-large">{Math.round(weather.temperatureC)}°C</h1>
            <p className="condition">{weather.condition}</p>
          </>
        )}
      </div>
    </div>
  )
}
