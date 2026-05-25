import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useWeather } from "../../context/WeatherContext";
import { formatTemp, formatHour } from "../../utils/helpers";

const CustomTooltip = ({ active, payload, label, unit, darkMode }) => {
  if (!active || !payload?.length) return null;
  const bg   = darkMode ? "bg-gray-900/80 border-white/20 text-white" : "bg-white/95 border-black/10 text-gray-900";
  const sub  = darkMode ? "text-white/50" : "text-gray-400";
  const blue = darkMode ? "text-blue-300" : "text-blue-500";
  return (
    <div className={`${bg} backdrop-blur-md border rounded-xl px-3 py-2 shadow-xl`}>
      <p className={`text-xs font-body mb-1 ${sub}`}>{label}</p>
      <p className="font-display font-semibold text-sm">{formatTemp(payload[0]?.value, unit)}</p>
      {payload[1] && <p className={`text-xs font-body ${blue}`}>Feels {formatTemp(payload[1]?.value, unit)}</p>}
    </div>
  );
};

export default function WeatherChart({ darkMode = true }) {
  const { forecast, unit } = useWeather();
  if (!forecast?.list?.length) return null;

  const data = forecast.list.slice(0, 16).map((item) => ({
    time:   formatHour(item.dt_txt),
    temp:   Math.round(item.main.temp),
    feels:  Math.round(item.main.feels_like),
  }));

  const card   = darkMode ? "bg-white/10 border-white/20" : "bg-white/60 border-black/10";
  const hd     = darkMode ? "text-white/50" : "text-gray-500";
  const tick   = darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const grid   = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  const legend = darkMode ? "text-white/40" : "text-gray-400";

  return (
    <div className={`backdrop-blur-md border rounded-3xl p-4 transition-colors duration-500 ${card}`}>
      <h3 className={`text-xs font-body uppercase tracking-wider mb-4 ${hd}`}>Temperature Trend</h3>
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="gTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#fbbf24" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="gFeels" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis dataKey="time" tick={{ fill: tick, fontSize: 10, fontFamily: "DM Sans" }}
              axisLine={false} tickLine={false} interval={2} />
            <YAxis tick={{ fill: tick, fontSize: 10, fontFamily: "DM Sans" }}
              axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v)}°`} />
            <Tooltip content={<CustomTooltip unit={unit} darkMode={darkMode} />} />
            <Area type="monotone" dataKey="temp"  stroke="#fbbf24" strokeWidth={2}
              fill="url(#gTemp)"  dot={false} activeDot={{ r: 4, fill: "#fbbf24" }} animationDuration={700} />
            <Area type="monotone" dataKey="feels" stroke="#60a5fa" strokeWidth={1.5}
              strokeDasharray="4 2" fill="url(#gFeels)" dot={false} activeDot={{ r: 3, fill: "#60a5fa" }} animationDuration={700} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className={`flex gap-4 mt-2 ${legend}`}>
        <span className="flex items-center gap-1.5 text-xs font-body">
          <span className="w-3 h-0.5 bg-yellow-400 rounded inline-block" /> Temperature
        </span>
        <span className="flex items-center gap-1.5 text-xs font-body">
          <span className="w-3 h-0.5 bg-blue-400 rounded inline-block" /> Feels Like
        </span>
      </div>
    </div>
  );
}
