
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("New York"); // default city
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");


  const weatherCodeMap = {
    0: { text: "Clear Sky", icon: "☀️" },
    1: { text: "Mainly Clear", icon: "🌤️" },
    2: { text: "Partly Cloudy", icon: "⛅" },
    3: { text: "Overcast", icon: "☁️" },
    45: { text: "Foggy", icon: "🌫️" },
    48: { text: "Depositing Rime Fog", icon: "🌫️" },
    51: { text: "Light Drizzle", icon: "🌦️" },
    53: { text: "Moderate Drizzle", icon: "🌦️" },
    55: { text: "Dense Drizzle", icon: "🌧️" },
    61: { text: "Slight Rain", icon: "🌦️" },
    63: { text: "Moderate Rain", icon: "🌧️" },
    65: { text: "Heavy Rain", icon: "🌧️" },
    71: { text: "Slight Snowfall", icon: "🌨️" },
    73: { text: "Moderate Snowfall", icon: "❄️" },
    75: { text: "Heavy Snowfall", icon: "❄️" },
    77: { text: "Snow Grains", icon: "❄️" },
    80: { text: "Slight Showers", icon: "🌦️" },
    81: { text: "Moderate Showers", icon: "🌧️" },
    82: { text: "Violent Showers", icon: "🌧️" },
    85: { text: "Slight Snow Showers", icon: "🌨️" },
    86: { text: "Heavy Snow Showers", icon: "❄️" },
    95: { text: "Thunderstorm", icon: "⛈️" },
    96: { text: "Thunderstorm with Hail", icon: "⛈️" },
    99: { text: "Severe Thunderstorm with Hail", icon: "⛈️" },
  };


  const fetchWeather = async (cityName) => {
    try {
      setError(null);

    
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found!");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

  
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      const code = weatherData.current_weather.weathercode;
      const condition = weatherCodeMap[code] || {
        text: "Unknown",
        icon: "❓",
      };

      setWeather({
        city: `${name}, ${country}`,
        temp: weatherData.current_weather.temperature,
        condition: condition.text,
        icon: condition.icon,
      });
    } catch (err) {
      setError("Failed to fetch weather!");
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = () => {
    if (query.trim() === "") return;
    fetchWeather(query);
    setQuery("");
  };

  return (
    <div className="app">
      <div className="weather-card">
        <h2 className="title">Weather App</h2>

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-info">
            <div className="icon">{weather.icon}</div>
            <div className="temp">{weather.temp}°C</div>
            <div className="city">{weather.city}</div>
            <div className="condition">{weather.condition}</div>
          </div>
        )}

        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>🔍</button>
        </div>
      </div>
    </div>
  );
}

export default App;
