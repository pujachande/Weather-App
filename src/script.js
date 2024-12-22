import React, { useState, useEffect } from "react";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useGeolocation, setUseGeolocation] = useState(false);

  const APIKey = "782eb131ad59251d13131049b5d571f5"; // Add your OpenWeather API Key here

  const fetchWeatherByCity = async (city) => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`
      );
      const data = await response.json();

      if (data.cod === "404") {
        setError(true);
        setLoading(false);
        return;
      }

      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  const fetchWeatherByCoordinates = async (lat, lon) => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`
      );
      const data = await response.json();

      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (useGeolocation) {
      // If geolocation is selected, fetch weather by coordinates
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoordinates(latitude, longitude);
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    } else {
      // If city search is selected, fetch weather by city name
      if (city !== "") {
        fetchWeatherByCity(city);
      }
    }
  };

  const getWeatherImage = (weather) => {
    const normalizedWeather = weather.trim().toLowerCase();
    console.log("Weather Condition: ", normalizedWeather);
    switch (normalizedWeather) {
      case "clear":
        return "./clear.jpg";
      case "rain":
        return "./rain.jpg";
      case "snow":
        return "./snow.jpg";
      case "clouds":
        return "./cloud.jpg";
      case "mist":
        return "./mist.jpg";
      case "haze":
        return "./haze.jpg";
      default:
        return "./clr.jpg";
    }
  };

  return (
    <div
      className="container"
      style={{ height: weatherData ? "560px" : "450px" }}
    >
      <div className="search-box">
        <input
          type="text"
          id="search-btn"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search for a city"
        />
        <button onClick={handleSearch}>
          <i className="bx bx-search"></i>
        </button>
      </div>

      <div className="geolocation-toggle">
        <label>
          <input
            type="checkbox"
            checked={useGeolocation}
            onChange={() => setUseGeolocation(!useGeolocation)}
          />
          Use my location
        </label>
      </div>

      {loading && <div>Loading...</div>}

      {error && !loading && (
        <div className="not-found active">
          <p>City not found</p>
        </div>
      )}

      {weatherData && !error && (
        <div className="weather-box active">
          <img
            src={getWeatherImage(weatherData.weather[0].main)}
            alt="weather icon"
          />
          <div className="temperature">
            {parseInt(weatherData.main.temp)}
            <span>°C</span>
          </div>
          <div className="description">
            {weatherData.weather[0].description}
          </div>
        </div>
      )}

      {weatherData && !error && (
        <div className="weather-details active">
          <div className="humidity">
            <span>{weatherData.main.humidity}%</span>
            <label>Humidity</label>
          </div>
          <div className="wind">
            <span>{parseInt(weatherData.wind.speed)} Km/h</span>
            <label>Wind Speed</label>
          </div>
        </div>
      )}
    </div>
  );
}
