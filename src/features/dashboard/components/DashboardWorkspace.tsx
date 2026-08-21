import { AlertTriangle, ArrowLeft, CheckCircle2, Clock3 } from 'lucide-react';
import { MetricGrid } from '../../../components/shared/MetricGrid';
import {
  attentionItems,
  dashboardMetrics,
  dueToday,
  productionLoad,
  recentActivity,
} from '../data/mock-dashboard';

export function DashboardWorkspace({
  onOpenOrders,
}: {
  onOpenOrders: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-ink">
            ملخص التشغيل اليومي
          </h2>
          <p className="mt-1 text-sm text-muted">
            الخميس، 21 أغسطس 2026 · الحالات التي تحتاج قرارًا قبل بدء الإنتاج.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenOrders}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-pressed active:scale-[0.98]"
        >
          فتح الطلبات <ArrowLeft size={17} />
        </button>
      </div>

      <MetricGrid items={dashboardMetrics} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,.75fr)]">
        <section className="rounded-[22px] border border-line bg-white shadow-tactile">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <h3 className="text-base font-extrabold text-ink">
                يحتاج انتباهك
              </h3>
              <p className="mt-1 text-xs text-muted">
                اعتمادات وملفات ناقصة وأسعار لم تُرسل.
              </p>
            </div>
            <span className="western-digits rounded-full bg-warning-tint px-2.5 py-1 text-xs font-bold text-warning">
              3 حالات
            </span>
          </div>
          <div className="divide-y divide-line">
            {attentionItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="western-digits text-xs font-extrabold text-brand">
                      {item.id}
                    </span>
                    <span
                      className={`text-xs font-bold ${item.tone === 'danger' ? 'text-danger' : item.tone === 'warning' ? 'text-warning' : 'text-medical'}`}
                    >
                      {item.title}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold text-ink">
                    {item.subtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenOrders}
                  className="min-h-10 shrink-0 rounded-xl border border-brand/30 px-4 text-xs font-bold text-brand transition hover:bg-brand-tint"
                >
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[22px] border border-line bg-white p-5 shadow-tactile">
          <h3 className="text-base font-extrabold text-ink">توزيع العمل</h3>
          <p className="mt-1 text-xs text-muted">إجمالي 45 حالة قيد الإنتاج.</p>
          <div className="mt-5 space-y-4">
            {productionLoad.map((stage) => (
              <div key={stage.label}>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-bold text-ink">{stage.label}</span>
                  <span className="western-digits font-extrabold text-muted">
                    {stage.value}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-canvas">
                  <div
                    className={`h-full rounded-full ${stage.color}`}
                    style={{ width: `${stage.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-[22px] border border-line bg-white p-5 shadow-tactile">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-ink">
                تسليمات اليوم
              </h3>
              <p className="mt-1 text-xs text-muted">
                مرتبة حسب نافذة التسليم.
              </p>
            </div>
            <Clock3 size={20} className="text-medical" />
          </div>
          <div className="mt-4 space-y-2">
            {dueToday.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-line p-3"
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-xl ${item.urgent ? 'bg-danger-tint text-danger' : 'bg-success-tint text-success'}`}
                >
                  {item.urgent ? (
                    <AlertTriangle size={17} />
                  ) : (
                    <CheckCircle2 size={17} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="western-digits text-xs font-extrabold text-ink">
                    {item.id}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {item.clinic} · {item.status}
                  </p>
                </div>
                <span className="western-digits text-xs font-bold text-muted">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[22px] border border-line bg-white p-5 shadow-tactile">
          <h3 className="text-base font-extrabold text-ink">آخر النشاطات</h3>
          <div className="mt-4 space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand ring-4 ring-brand-tint" />
                <div>
                  <p className="text-xs leading-6 text-ink">
                    <b className="western-digits">{item.id}</b> · {item.text}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
