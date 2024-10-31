import { useCallback, useEffect, useState } from "react";
import { formatWeatherDataDaily } from "./utils/formatWeatherDataDaily";
import Today from "./components/today";
import WeekDay from "./components/WeekDay";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [geoLoc, setGeoLoc] = useState({ latitude: null, longitude: null });
  const [weatherUnits, setWeatherUnits] = useState({});
  const [weatherData, setWeatherData] = useState([]);

  const fetchWeather = useCallback(async (latitude, longitude) => {
    setIsLoading(true);
    setError(false);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,wind_speed_10m_max&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data || Object.keys(data).length === 0) {
        setError(true);
      } else {
        const formattedDailyData = formatWeatherDataDaily(data.daily);
        setWeatherData(formattedDailyData);

        setWeatherUnits({
          rain: data.daily_units.precipitation_sum,
          temperature: data.daily_units.temperature_2m_max,
          wind: data.daily_units.wind_speed_10m_max,
        });
      }
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Votre navigateur ne supporte pas la géolocalisation.");
      setError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGeoLoc({ latitude, longitude });
        fetchWeather(latitude, longitude);
      },
      () => {
        setError(true);
      }
    );
  }, [fetchWeather]);

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen h-max bg-cyan-800 flex justify-center items-start p-8 md:px-20">
        <p className="text-center">Chargement ...</p>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="min-h-screen h-max bg-cyan-600 flex justify-center items-start p-8 md:px-20">
        <p className="text-center text-red-600">Une erreur est survenue lors de la récupération des prévisions météo ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-max bg-cyan-600 flex justify-center items-start p-8 md:px-20">
      <div className="w-full max-w-7xl bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg p-4 md:px12 md:py-8 xl:py-12 xl:px-28">
        <Today data={weatherData[0]} weatherUnits={weatherUnits} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-6">
          {weatherData
            .slice(1)
            .map((data, index) => (
              <WeekDay key={index} data={data} weatherUnits={weatherUnits} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
