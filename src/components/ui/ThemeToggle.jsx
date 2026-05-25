import { Sun, Moon } from "lucide-react";
import { useWeather } from "../../context/WeatherContext";

export default function ThemeToggle() {
  const { darkMode, toggleDark } = useWeather();
  return (
    <button
      onClick={toggleDark}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
        ${darkMode ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"}`}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode
        ? <Sun  className="w-4 h-4 text-yellow-300" />
        : <Moon className="w-4 h-4 text-gray-600"   />
      }
    </button>
  );
}
