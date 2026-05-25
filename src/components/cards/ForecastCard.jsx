import { useWeather } from "../../context/WeatherContext";
import { formatTemp, getDayName, formatHour, groupForecastByDay } from "../../utils/helpers";
import WeatherIcon from "../ui/WeatherIcon";

export function HourlyForecast({ darkMode = true }) {
  const { forecast, unit } = useWeather();
  if (!forecast?.list?.length) return null;
  const hours = forecast.list.slice(0, 12);

  const card  = darkMode ? "bg-white/10 border-white/20" : "bg-white/60 border-black/10";
  const hd    = darkMode ? "text-white/50" : "text-gray-500";
  const now   = darkMode ? "bg-white/20 ring-1 ring-white/30" : "bg-black/10 ring-1 ring-black/15";
  const rest  = darkMode ? "bg-white/5 hover:bg-white/10" : "bg-black/4 hover:bg-black/8";
  const tp    = darkMode ? "text-white"    : "text-gray-900";
  const ts    = darkMode ? "text-white/60" : "text-gray-500";

  return (
    <div className={`backdrop-blur-md border rounded-3xl p-4 transition-colors duration-500 ${card}`}>
      <h3 className={`text-xs font-body uppercase tracking-wider mb-3 ${hd}`}>Hourly Forecast</h3>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
        {hours.map((h, i) => (
          <div key={h.dt}
            className={`flex-shrink-0 snap-start flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-2xl min-w-[62px] transition-all
              ${i === 0 ? now : rest}`}>
            <span className={`text-xs font-body ${ts}`}>{i === 0 ? "Now" : formatHour(h.dt_txt)}</span>
            <WeatherIcon icon={h.weather[0].icon} size="text-xl" />
            {h.pop > 0.1 && <span className="text-blue-400 text-xs font-body">{Math.round(h.pop * 100)}%</span>}
            <span className={`font-display text-sm font-semibold ${tp}`}>{formatTemp(h.main.temp, unit)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DailyForecast({ darkMode = true }) {
  const { forecast, unit } = useWeather();
  if (!forecast?.list?.length) return null;
  const days = groupForecastByDay(forecast.list);

  const card  = darkMode ? "bg-white/10 border-white/20" : "bg-white/60 border-black/10";
  const hd    = darkMode ? "text-white/50" : "text-gray-500";
  const row   = darkMode ? "hover:bg-white/5"  : "hover:bg-black/5";
  const tp    = darkMode ? "text-white"    : "text-gray-900";
  const ts    = darkMode ? "text-white/70" : "text-gray-600";
  const tm    = darkMode ? "text-white/40" : "text-gray-400";
  const trk   = darkMode ? "bg-white/10"   : "bg-black/10";

  return (
    <div className={`backdrop-blur-md border rounded-3xl p-4 transition-colors duration-500 ${card}`}>
      <h3 className={`text-xs font-body uppercase tracking-wider mb-3 ${hd}`}>5-Day Forecast</h3>
      <div className="space-y-0.5">
        {days.map((day, i) => {
          const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : getDayName(day.date);
          return (
            <div key={day.date} className={`flex items-center gap-3 px-2 py-2.5 rounded-xl transition-colors ${row}`}>
              <span className={`text-sm font-body w-[88px] flex-shrink-0 ${ts}`}>{label}</span>
              <WeatherIcon icon={day.condition.icon} size="text-xl" />
              <span className={`text-xs font-body w-8 ${day.pop > 0.1 ? "text-blue-400" : "opacity-0"}`}>
                {Math.round(day.pop * 100)}%
              </span>
              <div className="flex-1 flex items-center gap-2">
                <span className={`text-sm font-display w-12 text-right ${tm}`}>{formatTemp(day.minTemp, unit)}</span>
                <div className={`flex-1 h-1.5 ${trk} rounded-full overflow-hidden`}>
                  <div className="h-full rounded-full"
                    style={{
                      marginLeft: `${Math.max(0, (day.minTemp / 45) * 100)}%`,
                      width:      `${Math.max(4, ((day.maxTemp - day.minTemp) / 45) * 100)}%`,
                      background: "linear-gradient(90deg,#60a5fa,#fbbf24)",
                    }} />
                </div>
                <span className={`text-sm font-display w-12 ${tp}`}>{formatTemp(day.maxTemp, unit)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
