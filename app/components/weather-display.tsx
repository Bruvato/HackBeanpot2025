"use client";
import { useEffect, useState } from "react";

interface WeatherDisplayProps {
  lat: number;
  lng: number;
  locationName: string;
}

interface WeatherData {
  temperature: number;
  weatherCode: number;
  windspeed: number;
}

// Weather codes mapping based on WMO standards
const weatherDescriptions: {
  [key: number]: { description: string; icon: string };
} = {
  0: { description: "Clear sky", icon: "☀️" },
  1: { description: "Mainly clear", icon: "🌤️" },
  2: { description: "Partly cloudy", icon: "⛅" },
  3: { description: "Overcast", icon: "☁️" },
  45: { description: "Foggy", icon: "🌫️" },
  48: { description: "Depositing rime fog", icon: "🌫️" },
  51: { description: "Light drizzle", icon: "🌧️" },
  53: { description: "Moderate drizzle", icon: "🌧️" },
  55: { description: "Dense drizzle", icon: "🌧️" },
  61: { description: "Slight rain", icon: "🌧️" },
  63: { description: "Moderate rain", icon: "🌧️" },
  65: { description: "Heavy rain", icon: "🌧️" },
  71: { description: "Slight snow", icon: "🌨️" },
  73: { description: "Moderate snow", icon: "🌨️" },
  75: { description: "Heavy snow", icon: "🌨️" },
  77: { description: "Snow grains", icon: "🌨️" },
  80: { description: "Slight rain showers", icon: "🌦️" },
  81: { description: "Moderate rain showers", icon: "🌦️" },
  82: { description: "Violent rain showers", icon: "🌦️" },
  85: { description: "Slight snow showers", icon: "🌨️" },
  86: { description: "Heavy snow showers", icon: "🌨️" },
  95: { description: "Thunderstorm", icon: "⛈️" },
  96: { description: "Thunderstorm with slight hail", icon: "⛈️" },
  99: { description: "Thunderstorm with heavy hail", icon: "⛈️" },
};

export default function WeatherDisplay({
  lat,
  lng,
  locationName,
}: WeatherDisplayProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        console.log(`Fetching weather for ${locationName} at coordinates:`, {
          lat,
          lng,
        });

        if (typeof lat !== "number" || typeof lng !== "number") {
          throw new Error(`Invalid coordinates: lat=${lat}, lng=${lng}`);
        }

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&temperature_unit=fahrenheit`;
        console.log("Fetching from URL:", url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Weather data received:", data);

        if (!data.current_weather) {
          throw new Error("No weather data in response");
        }

        setWeather({
          temperature: Math.round(data.current_weather.temperature),
          weatherCode: data.current_weather.weathercode,
          windspeed: Math.round(data.current_weather.windspeed),
        });
        setError(null);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch weather data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (lat && lng) {
      fetchWeather();
    }
  }, [lat, lng, locationName]);

  if (error) {
    return (
      <div className="bg-white/90 rounded-lg p-4 shadow-sm">
        <h3 className="font-medium text-lg">Weather in {locationName}</h3>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white/90 rounded-lg p-4 shadow-sm">
        <h3 className="font-medium text-lg">Weather in {locationName}</h3>
        <p>Loading weather...</p>
      </div>
    );
  }

  if (!weather) return null;

  const weatherInfo = weatherDescriptions[weather.weatherCode] || {
    description: "Unknown",
    icon: "❓",
  };

  return (
    <div className="rounded-lg p-4 shadow-sm">
      <h3 className="font-medium text-lg">Weather in {locationName}</h3>
      <div className="flex items-center gap-4">
        <span
          className="text-4xl"
          role="img"
          aria-label={weatherInfo.description}
        >
          {weatherInfo.icon}
        </span>
        <div>
          <p className="text-2xl font-bold">{weather.temperature}°F</p>
          <p className="text-muted-foreground">{weatherInfo.description}</p>
          <p className="text-sm text-muted-foreground">
            Wind: {weather.windspeed} mph
          </p>
        </div>
      </div>
    </div>
  );
}
