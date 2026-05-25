import { useWeather } from "../../context/WeatherContext";
export default function UnitToggle({ darkMode = true }) {
  const { unit, setUnit } = useWeather();
  const wrap = darkMode ? "bg-white/10"           : "bg-black/10";
  const on   = darkMode ? "bg-white/25 text-white": "bg-black/20 text-gray-900";
  const off  = darkMode ? "text-white/50"         : "text-gray-400";
  return (
    <div className={`flex items-center ${wrap} rounded-xl p-1 gap-1`}>
      {["C","F"].map((u) => (
        <button key={u} onClick={() => setUnit(u)} aria-pressed={unit === u}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-display font-semibold transition-all duration-200
            ${unit === u ? on : off}`}>
          °{u}
        </button>
      ))}
    </div>
  );
}
