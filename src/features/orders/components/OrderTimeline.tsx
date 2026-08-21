import { Check } from 'lucide-react';
import type { TimelineStep } from '../types/order.types';

export function OrderTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((step, index) => (
        <li key={step.id} className="relative flex gap-3 pb-5 last:pb-0">
          {index !== steps.length - 1 ? <span className="absolute right-[13px] top-7 h-[calc(100%-20px)] w-px bg-line" /> : null}
          <span
            className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[10px] ${
              step.state === 'done'
                ? 'border-success bg-success text-white'
                : step.state === 'current'
                  ? 'border-brand bg-brand-tint text-brand ring-4 ring-brand-tint/60'
                  : 'border-line bg-white text-muted'
            }`}
          >
            {step.state === 'done' ? <Check size={14} /> : <span className="h-2 w-2 rounded-full bg-current" />}
          </span>
          <div className="pt-0.5">
            <p className={`text-xs font-bold ${step.state === 'upcoming' ? 'text-muted' : 'text-ink'}`}>{step.label}</p>
            <p className="mt-1 text-[10px] text-muted western-digits">{step.time}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
