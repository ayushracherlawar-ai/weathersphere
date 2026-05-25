export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0369a1] via-[#0ea5e9] to-[#7dd3fc] z-50">
      <div className="text-center">
        <div className="text-7xl mb-6 animate-float">🌤️</div>
        <h1 className="text-white font-display text-3xl font-bold tracking-tight mb-2">WeatherSphere</h1>
        <p className="text-white/70 font-body text-sm">Detecting your location…</p>
        <div className="flex gap-2 justify-center mt-6">
          {[0,1,2].map((i) => (
            <div key={i} className="w-2 h-2 bg-white/70 rounded-full animate-bounce-dot"
              style={{ animationDelay: `${i * 0.18}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
