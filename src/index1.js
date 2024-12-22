import React, { useState } from "react";
import "./style.css";

export default function Weather() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const handleSearch = () => {
    // Here you can add logic to fetch data from an API using the location.
    // Example with OpenWeather API:
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=YOUR_API_KEY&units=metric`
    )
      .then((response) => response.json())
      .then((data) => setWeatherData(data))
      .catch((err) => console.log(err));
  };
}
