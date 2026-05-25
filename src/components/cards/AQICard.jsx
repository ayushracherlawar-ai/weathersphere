import { useWeather } from "../../context/WeatherContext";
import { getAQIInfo } from "../../utils/helpers";

const POLLUTANTS = [
  { key: "pm2_5", label: "PM2.5", max: 75  },
  { key: "pm10",  label: "PM10",  max: 150 },
  { key: "o3",    label: "Ozone", max: 180 },
  { key: "no2",   label: "NO₂",   max: 200 },
];

export default function AQICard({ darkMode = true }) {
  const { aqi } = useWeather();
  if (!aqi?.list?.[0]) return null;

  const { main, components } = aqi.list[0];
  const info = getAQIInfo(main.aqi);

  const card  = darkMode ? "bg-white/10 border-white/20" : "bg-white/60 border-black/10";
  const hd    = darkMode ? "text-white/50" : "text-gray-500";
  const ts    = darkMode ? "text-white/60" : "text-gray-500";
  const inner = darkMode ? "bg-white/5"    : "bg-black/5";
  const trk   = darkMode ? "bg-white/10"   : "bg-black/10";
  const tp    = darkMode ? "text-white"    : "text-gray-900";

  return (
    <div className="animate-slide-up">
      <div className={`backdrop-blur-md border rounded-3xl p-4 transition-colors duration-500 ${card}`}>
        <h3 className={`text-xs font-body uppercase tracking-wider mb-3 ${hd}`}>Air Quality Index</h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-display font-bold text-xl text-white"
            style={{ background: info.color + "30", border: `2px solid ${info.color}` }}>
            {main.aqi}
          </div>
          <div>
            <p className="font-display font-bold text-lg" style={{ color: info.color }}>{info.label}</p>
            <p className={`text-xs font-body mt-0.5 ${ts}`}>{info.desc}</p>
          </div>
        </div>

        {/* Scale dots */}
        <div className="flex gap-1 mb-4">
          {["#22c55e","#84cc16","#eab308","#f97316","#ef4444"].map((c, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full transition-all"
              style={{ background: c, opacity: main.aqi === i + 1 ? 1 : 0.25 }} />
          ))}
        </div>

        {/* Pollutants */}
        <div className="grid grid-cols-2 gap-2">
          {POLLUTANTS.map(({ key, label, max }) => {
            const val = components[key] ?? 0;
            const pct = Math.min((val / max) * 100, 100);
            return (
              <div key={key} className={`${inner} rounded-xl p-2.5`}>
                <div className="flex justify-between mb-1.5">
                  <span className={`text-xs font-body ${ts}`}>{label}</span>
                  <span className={`text-xs font-display ${tp}`}>{val.toFixed(1)}</span>
                </div>
                <div className={`h-1 ${trk} rounded-full overflow-hidden`}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: pct > 70 ? "#ef4444" : pct > 40 ? "#f97316" : "#22c55e" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
