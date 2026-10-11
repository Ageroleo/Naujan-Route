import { MapPin } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Animated Logo */}
      <div className="animate-fade-in flex flex-col items-center gap-5">
        {/* Logo Mark */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg animate-float">
            <MapPin size={32} className="text-white" strokeWidth={2.5} />
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-2xl bg-emerald-600/20 animate-ping" style={{ animationDuration: '1.5s' }} />
        </div>

        {/* Brand Text */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold font-[family-name:var(--font-display)] text-slate-900 tracking-tight">
            Naujan Trail
          </h1>
          <p className="text-xs text-slate-500">Oriental Mindoro</p>
        </div>

        {/* Loading Bar */}
        <div className="w-40 h-1 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{
              animation: 'loading-bar 1.2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
