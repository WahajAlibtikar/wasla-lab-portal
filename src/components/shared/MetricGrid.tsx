import type { LucideIcon } from 'lucide-react';

export type MetricTone = 'brand' | 'medical' | 'success' | 'warning' | 'danger';

export interface MetricItem {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  tone: MetricTone;
}

const toneClasses: Record<MetricTone, string> = {
  brand: 'bg-brand-tint text-brand',
  medical: 'bg-medical-tint text-medical',
  success: 'bg-success-tint text-success',
  warning: 'bg-warning-tint text-warning',
  danger: 'bg-danger-tint text-danger',
};

export function MetricGrid({ items }: { items: MetricItem[] }) {
  return (
    <section
      className="grid grid-cols-2 gap-3 xl:grid-cols-4"
      aria-label="مؤشرات التشغيل"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <article
            key={item.label}
            className="flex min-w-0 items-center gap-3 rounded-[18px] border border-line bg-white p-4 shadow-tactile"
          >
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${toneClasses[item.tone]}`}
            >
              <Icon size={21} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-muted sm:text-xs">
                {item.label}
              </p>
              <p className="western-digits mt-1 truncate text-xl font-extrabold leading-none text-ink">
                {item.value}
              </p>
              <p className="mt-1 hidden truncate text-[10px] text-muted sm:block">
                {item.note}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
