import {
  Camera,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  Search,
  Truck,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { MetricGrid } from '../../../components/shared/MetricGrid';
import { Toast } from '../../../components/shared/Toast';
import { deliveryMetrics } from '../data/mock-delivery';
import { useDeliveryTasks } from '../hooks/use-delivery-tasks';
import type { DeliveryStatus } from '../types/delivery.types';

const statusMap: Record<DeliveryStatus, { label: string; classes: string }> = {
  scheduled: {
    label: 'بانتظار المندوب',
    classes: 'bg-medical-tint text-medical',
  },
  en_route: { label: 'في الطريق', classes: 'bg-warning-tint text-warning' },
  completed: { label: 'مكتملة', classes: 'bg-success-tint text-success' },
  delayed: { label: 'متأخرة', classes: 'bg-danger-tint text-danger' },
};

export function DeliveryWorkspace() {
  const {
    filtered,
    selected,
    selectedId,
    setSelectedId,
    tab,
    setTab,
    query,
    setQuery,
    updateStatus,
  } = useDeliveryTasks();
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [notice, setNotice] = useState('');
  const complete = () => {
    if (!recipient.trim()) {
      setNotice('اكتب اسم مستلم الشحنة قبل تأكيد التسليم.');
      return;
    }
    updateStatus('completed');
    setNotice('تم تأكيد التسليم وحفظ اسم المستلم.');
  };
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-ink">التوصيل والتسليم</h2>
        <p className="mt-1 text-sm text-muted">
          إدارة الاستلام من العيادات وتسليم الأعمال الجاهزة.
        </p>
      </div>
      <MetricGrid items={deliveryMetrics} />
      <section className="flex flex-col gap-3 rounded-[20px] border border-line bg-white p-4 shadow-tactile md:flex-row md:items-center">
        <div className="flex rounded-xl bg-canvas p-1">
          {(
            [
              { id: 'today', label: 'اليوم' },
              { id: 'upcoming', label: 'القادمة' },
              { id: 'completed', label: 'المكتملة' },
            ] as const
          ).map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`min-h-10 rounded-lg px-4 text-xs font-bold transition ${tab === item.id ? 'bg-white text-brand shadow-sm' : 'text-muted'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-canvas px-3 focus-within:border-brand">
          <Search size={17} className="text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="رقم الحالة، العيادة أو الحي"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>
      </section>
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
        <section className="space-y-3">
          {filtered.map((task) => (
            <button
              type="button"
              key={task.id}
              onClick={() => setSelectedId(task.id)}
              className={`w-full rounded-[20px] border bg-white p-4 text-right shadow-tactile transition ${selectedId === task.id ? 'border-brand ring-1 ring-brand/15' : 'border-line hover:border-brand/35'}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="western-digits rounded-lg bg-canvas px-2 py-1 text-[11px] font-extrabold text-brand">
                  {task.caseId}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusMap[task.status].classes}`}
                >
                  {statusMap[task.status].label}
                </span>
                <span className="mr-auto text-[10px] font-bold text-muted">
                  {task.kind === 'delivery' ? 'مهمة تسليم' : 'طلب استلام'}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-extrabold text-ink">
                {task.clinic}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                <MapPin size={13} /> الرياض، {task.district}
              </p>
              <div className="mt-3 grid gap-2 rounded-xl bg-canvas p-3 text-[11px] sm:grid-cols-3">
                <span>
                  <b className="block text-muted">نوع العمل</b>
                  <span className="mt-1 block font-bold text-ink">
                    {task.work}
                  </span>
                </span>
                <span>
                  <b className="block text-muted">نافذة الوقت</b>
                  <span className="western-digits mt-1 block font-bold text-ink">
                    {task.window}
                  </span>
                </span>
                <span>
                  <b className="block text-muted">المندوب</b>
                  <span className="mt-1 block font-bold text-ink">
                    {task.courier}
                  </span>
                </span>
              </div>
            </button>
          ))}
          {filtered.length === 0 ? (
            <div className="grid min-h-52 place-items-center rounded-[20px] border border-dashed border-line bg-white text-sm text-muted">
              لا توجد مهام مطابقة.
            </div>
          ) : null}
        </section>
        <aside className="overflow-hidden rounded-[22px] border border-line bg-white shadow-tactile">
          <header className="border-b border-line bg-canvas/70 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="western-digits text-lg font-extrabold text-ink">
                  {selected.caseId}
                </span>
                <p className="mt-1 text-xs text-muted">
                  {selected.kind === 'delivery' ? 'مهمة تسليم' : 'طلب استلام'}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusMap[selected.status].classes}`}
              >
                {statusMap[selected.status].label}
              </span>
            </div>
            <h3 className="mt-4 text-base font-extrabold text-ink">
              {selected.clinic}
            </h3>
            <p className="mt-1 text-xs text-muted">
              {selected.doctor} · {selected.work}
            </p>
          </header>
          <div className="space-y-5 p-5">
            <section>
              <h4 className="text-sm font-extrabold text-ink">موقع المهمة</h4>
              <div className="mt-3 rounded-xl bg-canvas p-3 text-xs leading-6 text-ink">
                <p className="flex items-start gap-2">
                  <MapPin size={15} className="mt-1 shrink-0 text-brand" />
                  {selected.address}
                </p>
                <p className="western-digits mt-2 flex items-center gap-2">
                  <Phone size={15} className="text-brand" />
                  {selected.phone}
                </p>
              </div>
              <p className="mt-2 text-[11px] leading-6 text-muted">
                {selected.instructions}
              </p>
            </section>
            <section>
              <h4 className="text-sm font-extrabold text-ink">
                المندوب والتتبع
              </h4>
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-line p-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-medical-tint text-medical">
                  <UserRound size={18} />
                </span>
                <div>
                  <p className="text-xs font-extrabold text-ink">
                    {selected.courier}
                  </p>
                  <p className="western-digits mt-1 text-[10px] text-muted">
                    {selected.courierPhone}
                  </p>
                </div>
              </div>
              <ol className="mt-4 space-y-3">
                {selected.timeline.map((step) => (
                  <li key={`${step.label}-${step.time}`} className="flex gap-3">
                    <span
                      className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${step.done ? 'bg-success text-white' : 'border border-line bg-white text-muted'}`}
                    >
                      {step.done ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Clock3 size={13} />
                      )}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-ink">{step.label}</p>
                      <p className="western-digits mt-1 text-[10px] text-muted">
                        {step.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
            {selected.status !== 'completed' ? (
              <section className="rounded-2xl bg-canvas p-4">
                <h4 className="text-sm font-extrabold text-ink">
                  تأكيد التسليم
                </h4>
                <label className="mt-3 block">
                  <span className="mb-1.5 block text-[11px] font-bold text-muted">
                    اسم مستلم الشحنة
                  </span>
                  <input
                    value={recipient}
                    onChange={(event) => setRecipient(event.target.value)}
                    placeholder="مثال: سارة محمد — الاستقبال"
                    className="h-11 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-brand"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setNotice('تمت إضافة صورة إثبات تجريبية.')}
                  className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-white text-xs font-bold text-muted"
                >
                  <Camera size={16} /> إضافة صورة إثبات
                </button>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={2}
                  placeholder="ملاحظة التسليم — اختيارية"
                  className="mt-3 w-full resize-none rounded-xl border border-line bg-white p-3 text-xs leading-6 outline-none focus:border-brand"
                />
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateStatus('en_route');
                      setNotice('تم بدء المهمة وتحديث الحالة إلى في الطريق.');
                    }}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-brand/30 bg-white text-xs font-bold text-brand"
                  >
                    <Truck size={16} /> بدء المهمة
                  </button>
                  <button
                    type="button"
                    onClick={complete}
                    className="min-h-11 rounded-xl bg-brand text-xs font-bold text-white hover:bg-brand-pressed"
                  >
                    تأكيد إتمام التسليم
                  </button>
                </div>
              </section>
            ) : (
              <div className="rounded-2xl bg-success-tint p-4 text-center text-xs font-bold text-success">
                <CheckCircle2 className="mx-auto mb-2" size={22} /> تم تسليم هذه
                المهمة وتوثيقها.
              </div>
            )}
          </div>
        </aside>
      </div>
      {notice ? <Toast message={notice} onClose={() => setNotice('')} /> : null}
    </div>
  );
}
