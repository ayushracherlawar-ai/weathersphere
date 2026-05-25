import { AlertTriangle, RefreshCw } from "lucide-react";
export default function ErrorState({ message, onRetry, darkMode = true }) {
  const bg   = darkMode ? "bg-red-400/10 border-red-400/30" : "bg-red-50 border-red-200";
  const text = darkMode ? "text-red-300" : "text-red-700";
  const sub  = darkMode ? "text-red-400" : "text-red-500";
  return (
    <div className={`${bg} border rounded-2xl p-4 flex items-start gap-3`}>
      <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${sub}`} />
      <div className="flex-1">
        <p className={`text-sm font-body ${text}`}>{message}</p>
        {onRetry && (
          <button onClick={onRetry}
            className={`mt-2 flex items-center gap-1.5 text-xs transition-colors font-body ${sub} hover:opacity-80`}>
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        )}
      </div>
    </div>
  );
}
