import { Sunrise, Sunset } from "lucide-react";

export default function SunriseSunset({ sunrise, sunset, darkMode = true }) {
  const now = Math.floor(Date.now() / 1000);
  const dur = Math.max(sunset - sunrise, 1);
  const pct = Math.min(100, Math.max(0, ((now - sunrise) / dur) * 100));
  const isDay = now >= sunrise && now <= sunset;
  const fmt = (ts) => new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const bg   = darkMode ? "bg-white/5"    : "bg-black/5";
  const tp   = darkMode ? "text-white"    : "text-gray-900";
  const tm   = darkMode ? "text-white/40" : "text-gray-400";
  const trk  = darkMode ? "bg-white/10"   : "bg-black/10";

  return (
    <div className={`${bg} rounded-2xl p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sunrise className="w-4 h-4 text-orange-400" />
          <div>
            <p className={`text-xs font-body ${tm}`}>Sunrise</p>
            <p className={`font-display text-sm font-semibold ${tp}`}>{fmt(sunrise)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-right">
          <div>
            <p className={`text-xs font-body ${tm}`}>Sunset</p>
            <p className={`font-display text-sm font-semibold ${tp}`}>{fmt(sunset)}</p>
          </div>
          <Sunset className="w-4 h-4 text-orange-500" />
        </div>
      </div>

      {/* Track */}
      <div className={`relative h-2 ${trk} rounded-full`}>
        <div className="absolute h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.max(2, pct)}%`,
            background: isDay
              ? "linear-gradient(90deg,#fb923c,#fbbf24)"
              : "linear-gradient(90deg,#6366f1,#818cf8)",
          }} />
        {/* Sun/moon dot */}
        <div className="absolute w-4 h-4 rounded-full -top-1 -translate-x-1/2 transition-all duration-700 shadow-md"
          style={{
            left:       `${Math.max(2, Math.min(pct, 98))}%`,
            background: isDay ? "#fbbf24" : "#818cf8",
            boxShadow:  isDay ? "0 0 8px #fbbf2488" : "0 0 8px #818cf888",
          }} />
      </div>
      <div className={`flex justify-between text-xs mt-2 font-mono ${tm}`}>
        <span>Dawn</span>
        <span>{isDay ? "☀️ Daytime" : "🌙 Nighttime"}</span>
        <span>Dusk</span>
      </div>
    </div>
  );
}
