import { CheckCircle2, X } from 'lucide-react';
import { useEffect } from 'react';

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3200);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="fixed bottom-5 left-5 z-[60] flex max-w-sm items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-bold text-ink shadow-floating">
      <CheckCircle2 size={20} className="shrink-0 text-success" />
      <span>{message}</span>
      <button onClick={onClose} className="mr-auto text-muted" aria-label="إغلاق التنبيه">
        <X size={18} />
      </button>
    </div>
  );
}
