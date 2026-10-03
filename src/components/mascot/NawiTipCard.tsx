import NawiMascot from './Nawi';

interface NawiTipCardProps {
  /** Override the default tip message */
  message?: string;
}

export default function NawiTipCard({
  message = "Nawi's Tip: Tricycle fares to remote interior barangays may be negotiated as a 'Special Trip' (chartered). Always confirm the fare with the driver before boarding!",
}: NawiTipCardProps) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 animate-fade-in-up"
      style={{ animationDelay: '0.25s' }}
      id="nawi-tip-card"
    >
      <div className="shrink-0 mt-0.5">
        <NawiMascot size={64} pose="compass" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-emerald-800 mb-1">
          🦆 Local Tip from Nawi
        </p>
        <p className="text-[11px] text-emerald-700 leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
