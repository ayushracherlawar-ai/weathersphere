import { useEffect } from "react";
import { useWeather } from "../context/WeatherContext";

export function useGeolocation(defaultCity = "Nagpur") {
  const { loadWeatherData, loadByCoords } = useWeather();
  useEffect(() => {
    if (!navigator?.geolocation) { loadWeatherData(defaultCity); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => loadByCoords(pos.coords.latitude, pos.coords.longitude),
      ()    => loadWeatherData(defaultCity),
      { timeout: 6000 }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
