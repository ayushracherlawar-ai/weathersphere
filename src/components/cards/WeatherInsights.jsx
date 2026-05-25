import { useWeather } from "../../context/WeatherContext";
import { generateInsights } from "../../utils/helpers";

const TYPE = {
  alert:    "bg-red-400/20    border-red-400/30    text-red-200",
  warning:  "bg-orange-400/20 border-orange-400/30 text-orange-200",
  info:     "bg-blue-400/20   border-blue-400/30   text-blue-200",
  positive: "bg-green-400/20  border-green-400/30  text-green-200",
};
const TYPE_LIGHT = {
  alert:    "bg-red-50    border-red-200    text-red-700",
  warning:  "bg-orange-50 border-orange-200 text-orange-700",
  info:     "bg-blue-50   border-blue-200   text-blue-700",
  positive: "bg-green-50  border-green-200  text-green-700",
};

export default function WeatherInsights({ darkMode = true }) {
  const { weather, forecast } = useWeather();
  if (!weather) return null;
  const insights = generateInsights(weather, forecast);

  const card = darkMode ? "bg-white/10 border-white/20" : "bg-white/60 border-black/10";
  const hd   = darkMode ? "text-white/50" : "text-gray-500";
  const styles = darkMode ? TYPE : TYPE_LIGHT;

  return (
    <div className="animate-slide-up">
      <div className={`backdrop-blur-md border rounded-3xl p-4 transition-colors duration-500 ${card}`}>
        <h3 className={`text-xs font-body uppercase tracking-wider mb-3 ${hd}`}>🧠 Weather Insights</h3>
        <div className="space-y-2">
          {insights.map((it, i) => (
            <div key={i}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-body animate-slide-up
                ${styles[it.type] ?? styles.info}`}
              style={{ animationDelay: `${i * 0.08}s` }}>
              <span className="text-base flex-shrink-0">{it.icon}</span>
              <span>{it.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
