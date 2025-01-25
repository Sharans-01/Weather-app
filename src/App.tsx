import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Search,
  Wind,
  Droplets,
  Cloud,
  Loader2
} from 'lucide-react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    main: string;
    description: string;
    id: number;
  }>;
}

const popularCities = [
  'London', 'New York', 'Tokyo', 'Paris', 'Dubai',
  'Singapore', 'Barcelona', 'Rome', 'Sydney', 'Hong Kong',
  'Mumbai', 'Toronto', 'Berlin', 'Madrid', 'Amsterdam'
];

function WeatherIcon({ weatherId }: { weatherId: number }) {
  const getWeatherIcon = () => {
    if (weatherId >= 200 && weatherId < 300) {
      return (
        <img
          src="/cloud light.png" // Replace with your image URL or path
          alt="Thunderstorm"
          className="animate-pulse w-14 h-14 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-24 lg:h-24"
          style={{ filter: "drop-shadow(0 0 6px blue)" }}
        />
      );
    } else if (weatherId >= 300 && weatherId < 400) {
      return (
        <img
          src="/cloud drizzle.png" // Replace with your image URL or path
          alt="Drizzle"
          className="animate-bounce w-14 h-14 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-24 lg:h-24"
          style={{ filter: "drop-shadow(0 0 6px lightblue)" }}
        />
      );
    } else if (weatherId >= 500 && weatherId < 600) {
      return (
        <img
          src="/cloud rain1.png" // Replace with your image URL or path
          alt="Rain"
          className="animate-pulse w-14 h-14 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-24 lg:h-24"
          style={{ filter: "drop-shadow(0 0 8px blue)" }}
        />
      );
    } else if (weatherId >= 600 && weatherId < 700) {
      return (
        <img
          src="/cloud snow.png" // Replace with your image URL or path
          alt="Snow"
          className="animate-pulse w-14 h-14 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-24 lg:h-24"
          style={{ filter: "drop-shadow(0 0 6px white)" }}
        />
      );
    } else if (weatherId >= 700 && weatherId < 800) {
      return (
        <img
          src="/cloud fog1.png" // Replace with your image URL or path
          alt="Fog"
          className="animate-fade-out w-14 h-14 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-24 lg:h-24"
          style={{ filter: "drop-shadow(0 0 6px gray)" }}
        />
      );
    } else if (weatherId === 800) {
      return (
        <img
          src="/sun.png" // Replace with your image URL or path
          alt="Clear sky"
          className="animate-pulse w-14 h-14 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-24 lg:h-24"
          style={{ filter: "drop-shadow(0 0 6px yellow)" }}
        />
      );
    } else if (weatherId > 800) {
      return (
        <img
          src="/cloud sun.png" // Replace with your image URL or path
          alt="Cloudy"
          className="animate-pulse w-14 h-14 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-24 lg:h-24"
          style={{ filter: "drop-shadow(0 0 8px orange)" }}
        />
      );
    }
    return (
      <Cloud
        size={48}
        className="text-gray-800"
        style={{ filter: "drop-shadow(0 0 6px gray)" }}
      />
    );
  };

  return (
    <div className="transition-all duration-500 ease-in-out transform hover:scale-110">
      {getWeatherIcon()}
    </div>
  );
}

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const API_KEY = 'Enter-Your-API-Key';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (city.trim()) {
      const filtered = popularCities.filter(
        c => c.toLowerCase().includes(city.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [city]);

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) {
      setError('Please enter a city name');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
      const response = await axios.get<WeatherData>(url);
      setWeather(response.data);
      setShowSuggestions(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Failed to fetch weather data');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCity(suggestion);
    fetchWeather(suggestion);
  };

  const getBackgroundClass = () => {
    if (!weather) return 'from-blue-400 via-blue-300 to-blue-200';
    
    const weatherId = weather.weather[0].id;
    if (weatherId >= 200 && weatherId < 300) {
      return 'from-gray-900 via-purple-900 to-indigo-900'; // Thunderstorm
    } else if (weatherId >= 300 && weatherId < 600) {
      return 'from-blue-600 via-indigo-500 to-purple-400'; // Rain
    } else if (weatherId >= 600 && weatherId < 700) {
      return 'from-blue-100 via-blue-50 to-white'; // Snow
    } else if (weatherId >= 700 && weatherId < 800) {
      return 'from-gray-400 via-gray-300 to-gray-200'; // Atmosphere
    } else if (weatherId === 800) {
      return 'from-yellow-400 via-orange-300 to-blue-300'; // Clear
    } else {
      return 'from-gray-300 via-gray-200 to-blue-200'; // Clouds
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-pink-700 flex items-center justify-center transition-all duration-1000">
      <div className="w-full max-w-md px-4 sm:px-6 md:px-8" ref={searchRef}>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
          <input
  type="text"
  value={city}
  onChange={(e) => {
    setCity(e.target.value);
    setShowSuggestions(true);
  }}
  onFocus={() => setShowSuggestions(true)}
  placeholder="Enter City Name"
  className={`w-full px-4 py-3 rounded-lg bg-white backdrop-blur-md text-black placeholder-black/60 outline-none border-2 transition-all ${
    city ? 'border-black' : 'border-black'
  } focus:border-black/40`}
/>

            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-black hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            </button>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute w-full mt-1 bg-white/10 backdrop-blur-md rounded-lg border border-black/20 overflow-hidden z-50">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors ${
                      index < suggestions.length - 1 ? 'border-b border-white/10' : ''
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          {error && (
            <p className="text-red-500 mt-2 bg-red-100 p-2 rounded">
              {error}
            </p>
          )}
        </form>

        {weather && (
          <div
            className={`bg-gradient-to-br ${getBackgroundClass()} backdrop-blur-md rounded-3xl p-8 text-black border-4 border-black/20 hover:border-4 hover:border-glow transition-all`}
            style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)' }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-center md:text-left">{weather.name}</h1>
                <p className="text-lg opacity-80 capitalize text-center md:text-left">{weather.weather[0].description}</p>
              </div>
              <WeatherIcon weatherId={weather.weather[0].id} />
            </div>

            <div className="mb-8 text-center">
              <div className="text-5xl sm:text-6xl font-bold mb-4">
                {Math.round(weather.main.temp)}°C
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 bg-black/5 rounded-xl p-4 hover:bg-black/10 transition-all">
                <Wind className="text-black" />
                <div>
                  <p className="text-sm opacity-70">Wind Speed</p>
                  <p className="font-semibold">{weather.wind.speed} km/h</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-black/5 rounded-xl p-4 hover:bg-black/10 transition-all">
                <Droplets className="text-black" />
                <div>
                  <p className="text-sm opacity-70">Humidity</p>
                  <p className="font-semibold">{weather.main.humidity}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

