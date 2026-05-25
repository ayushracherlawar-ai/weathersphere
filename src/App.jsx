import { WeatherProvider } from "./context/WeatherContext";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <WeatherProvider>
      <Dashboard />
    </WeatherProvider>
  );
}
