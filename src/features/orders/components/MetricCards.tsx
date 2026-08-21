import { AlertCircle, Clock3, Factory, Inbox } from 'lucide-react';

const metrics = [
  { label: 'طلبات جديدة', value: '12', note: '3 وصلت اليوم', icon: Inbox, tone: 'brand' },
  { label: 'بانتظار المراجعة', value: '8', note: 'تحتاج قرارًا', icon: AlertCircle, tone: 'warning' },
  { label: 'قيد الإنتاج', value: '45', note: 'في 4 مراحل', icon: Factory, tone: 'medical' },
  { label: 'تسليم خلال 48 ساعة', value: '4', note: 'حالتان عاجلتان', icon: Clock3, tone: 'danger' },
] as const;

const toneClasses = {
  brand: 'bg-brand-tint text-brand',
  warning: 'bg-warning-tint text-warning',
  medical: 'bg-medical-tint text-medical',
  danger: 'bg-danger-tint text-danger',
};

export function MetricCards() {
  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div key={metric.label} className="flex items-center gap-3 rounded-[18px] border border-line bg-white p-4 shadow-tactile">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${toneClasses[metric.tone]}`}>
              <Icon size={21} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-muted sm:text-xs">{metric.label}</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="western-digits text-xl font-extrabold leading-none text-ink">{metric.value}</span>
                <span className="hidden truncate text-[10px] text-muted sm:block">{metric.note}</span>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
