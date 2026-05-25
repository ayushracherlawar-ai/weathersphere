import { useState } from "react";
import { Code2, ChevronDown, ChevronUp } from "lucide-react";

const ITEMS = [
  { icon: "🌐", title: "Open-Meteo API",      desc: "Free weather API — no key required. Real-time data, 5-day forecast, air quality." },
  { icon: "📍", title: "Geolocation API",     desc: "Auto-detects location on load with graceful permission fallback." },
  { icon: "📊", title: "Data Visualization",  desc: "Recharts area chart with animated temperature trend and feels-like overlay." },
  { icon: "🎨", title: "Glassmorphism UI",    desc: "Backdrop-blur cards, dynamic gradients, and weather-matched particle effects." },
  { icon: "🌓", title: "Dark / Light Mode",   desc: "Full theme switch — gradients, cards, text, and inputs all respond." },
  { icon: "⚡", title: "Performance",         desc: "Debounced search, useCallback on loaders, lazy state, no unnecessary re-renders." },
  { icon: "🗄️", title: "Local Storage",       desc: "Favourites, recent searches, unit pref, and theme persisted across sessions." },
  { icon: "📱", title: "Responsive Design",   desc: "Mobile-first Tailwind layout — works on phone, tablet, and desktop." },
  { icon: "♿", title: "Accessibility",        desc: "ARIA labels, keyboard navigation, semantic HTML, sufficient contrast." },
  { icon: "🏗️", title: "Clean Architecture",  desc: "components / hooks / services / context / utils — easy to extend." },
];

export default function TechHighlights({ darkMode = true }) {
  const [open, setOpen] = useState(false);

  const wrap  = darkMode ? "bg-white/5  border-white/10"  : "bg-black/3  border-black/8";
  const hd    = darkMode ? "text-white/40" : "text-gray-400";
  const badge = darkMode ? "bg-white/10 text-white/35"    : "bg-black/8  text-gray-400";
  const item  = darkMode ? "bg-white/5"  : "bg-black/4";
  const tp    = darkMode ? "text-white"  : "text-gray-900";
  const ts    = darkMode ? "text-white/50" : "text-gray-500";

  return (
    <div className={`backdrop-blur-md border rounded-3xl overflow-hidden transition-colors duration-500 ${wrap}`}>
      <button onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 hover:${darkMode ? "bg-white/5" : "bg-black/5"} transition-colors`}>
        <div className="flex items-center gap-2">
          <Code2 className={`w-4 h-4 ${hd}`} />
          <span className={`text-xs font-body uppercase tracking-wider ${hd}`}>Tech Highlights</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${badge}`}>{ITEMS.length} features</span>
        </div>
        {open
          ? <ChevronUp   className={`w-4 h-4 ${hd}`} />
          : <ChevronDown className={`w-4 h-4 ${hd}`} />
        }
      </button>

      {open && (
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fade-in">
          {ITEMS.map((h) => (
            <div key={h.title} className={`flex gap-3 p-3 ${item} rounded-xl`}>
              <span className="text-lg flex-shrink-0">{h.icon}</span>
              <div>
                <p className={`text-sm font-display font-semibold ${tp}`}>{h.title}</p>
                <p className={`text-xs font-body mt-0.5 leading-relaxed ${ts}`}>{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
