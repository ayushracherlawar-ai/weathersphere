import { useMemo } from "react";

function RainEffect() {
  const drops = useMemo(() => Array.from({ length: 70 }, () => ({
    left:     `${Math.random() * 100}%`,
    delay:    `${(Math.random() * 2).toFixed(2)}s`,
    dur:      `${(0.5 + Math.random() * 0.7).toFixed(2)}s`,
    opacity:  (0.25 + Math.random() * 0.35).toFixed(2),
    width:    `${(1 + Math.random() * 1.5).toFixed(1)}px`,
    height:   `${Math.round(14 + Math.random() * 18)}px`,
  })), []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {drops.map((d, i) => (
        <div key={i} className="absolute bg-blue-200 rounded-full"
          style={{ left: d.left, top: "-40px", width: d.width, height: d.height,
            opacity: d.opacity,
            "--dur": d.dur, "--delay": d.delay,
            animation: `rain ${d.dur} ${d.delay} linear infinite` }} />
      ))}
    </div>
  );
}

function SnowEffect() {
  const flakes = useMemo(() => Array.from({ length: 55 }, () => ({
    left:  `${Math.random() * 100}%`,
    delay: `${(Math.random() * 4).toFixed(2)}s`,
    dur:   `${(3 + Math.random() * 4).toFixed(2)}s`,
    size:  `${Math.round(3 + Math.random() * 7)}px`,
    op:    (0.5 + Math.random() * 0.5).toFixed(2),
  })), []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {flakes.map((f, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ left: f.left, top: "-20px", width: f.size, height: f.size, opacity: f.op,
            animation: `snow ${f.dur} ${f.delay} linear infinite` }} />
      ))}
    </div>
  );
}

function StarEffect() {
  const stars = useMemo(() => Array.from({ length: 110 }, () => ({
    left:  `${Math.random() * 100}%`,
    top:   `${Math.random() * 75}%`,
    size:  `${(1 + Math.random() * 2.5).toFixed(1)}px`,
    delay: `${(Math.random() * 4).toFixed(2)}s`,
    dur:   `${(2 + Math.random() * 3).toFixed(2)}s`,
  })), []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size,
            "--dur": s.dur, "--delay": s.delay,
            animation: `pulseSlow ${s.dur} ${s.delay} ease-in-out infinite` }} />
      ))}
    </div>
  );
}

function CloudEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[0,1,2].map((i) => (
        <div key={i} className="absolute rounded-full bg-white/10 blur-3xl"
          style={{ width: `${220 + i * 90}px`, height: `${80 + i * 35}px`,
            top: `${8 + i * 14}%`, left: "-250px",
            animation: `floatY ${6 + i * 2}s ${i * 1.5}s ease-in-out infinite` }} />
      ))}
    </div>
  );
}

function SunnyEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute rounded-full bg-yellow-300/20 blur-3xl"
        style={{ width: "420px", height: "420px", top: "-120px", right: "-100px",
          animation: "pulseSlow 4s ease-in-out infinite" }} />
      <div className="absolute rounded-full bg-orange-200/15 blur-2xl"
        style={{ width: "220px", height: "220px", bottom: "18%", left: "8%",
          animation: "floatY 8s 1s ease-in-out infinite" }} />
    </div>
  );
}

export default function WeatherBackground({ particleType }) {
  const map = {
    rain: <RainEffect />, lightning: <RainEffect />, thunder: <RainEffect />,
    snow: <SnowEffect />,
    stars: <StarEffect />, night: <StarEffect />,
    clouds: <CloudEffect />, fog: <CloudEffect />,
    sunny: <SunnyEffect />, clear: <SunnyEffect />,
    none: null,
  };
  return map[particleType] ?? <SunnyEffect />;
}
