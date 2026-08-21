import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  File,
  Search,
  StickyNote,
} from 'lucide-react';
import { useState } from 'react';
import { Toast } from '../../../components/shared/Toast';
import { productionStages } from '../data/mock-production';
import { useProductionBoard } from '../hooks/use-production-board';
import type {
  ProductionCase,
  ProductionStage,
} from '../types/production.types';

const technicians = ['خالد محمد', 'سارة العتيبي', 'محمد النمر', 'عمر الراشد'];

function ProductionCard({
  item,
  onMove,
}: {
  item: ProductionCase;
  onMove: (stage: ProductionStage) => void;
}) {
  const currentIndex = productionStages.findIndex(
    (stage) => stage.id === item.stage,
  );
  const nextStage = productionStages[currentIndex + 1];
  return (
    <article
      className={`rounded-2xl border bg-white p-4 shadow-sm ${item.priority === 'overdue' ? 'border-danger/35' : item.priority === 'urgent' ? 'border-warning/50' : 'border-line'}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="western-digits rounded-lg bg-canvas px-2 py-1 text-[11px] font-extrabold text-brand">
          {item.id}
        </span>
        {item.priority !== 'normal' ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${item.priority === 'overdue' ? 'bg-danger-tint text-danger' : 'bg-warning-tint text-warning'}`}
          >
            <AlertTriangle size={11} />
            {item.priority === 'overdue' ? 'متأخر' : 'عاجل'}
          </span>
        ) : null}
      </div>
      <h4 className="mt-3 text-sm font-extrabold leading-6 text-ink">
        {item.service}
      </h4>
      <p className="mt-1 text-xs font-semibold text-muted">{item.doctor}</p>
      <p className="mt-0.5 text-[11px] text-muted">{item.clinic}</p>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-canvas px-3 py-2 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1">
          <CalendarDays size={13} /> {item.due}
        </span>
        <span className="inline-flex items-center gap-1">
          <File size={13} />
          <b className="western-digits">{item.attachments}</b>
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-medical-tint text-[10px] font-extrabold text-medical">
          {item.technicianInitials}
        </span>
        <span className="min-w-0 flex-1 truncate text-[11px] font-bold text-ink">
          {item.technician}
        </span>
        {nextStage ? (
          <button
            type="button"
            onClick={() => onMove(nextStage.id)}
            className="grid h-9 w-9 place-items-center rounded-xl bg-brand-tint text-brand transition hover:bg-brand hover:text-white"
            aria-label={`نقل إلى ${nextStage.label}`}
          >
            <ArrowLeft size={16} />
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function ProductionWorkspace() {
  const {
    filteredCases,
    query,
    setQuery,
    technician,
    setTechnician,
    moveCase,
  } = useProductionBoard();
  const [notice, setNotice] = useState('');

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-ink">لوحة مراحل الإنتاج</h2>
        <p className="mt-1 text-sm text-muted">
          تابع كل حالة وانقلها للمرحلة التالية دون فقدان موعد التسليم.
        </p>
      </div>
      <section className="flex flex-col gap-3 rounded-[20px] border border-line bg-white p-4 shadow-tactile lg:flex-row lg:items-center">
        <label className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-canvas px-3 focus-within:border-brand focus-within:bg-white">
          <Search size={18} className="text-muted" />
          <span className="sr-only">بحث الإنتاج</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="رقم الحالة، الطبيب أو العيادة"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>
        <select
          value={technician}
          onChange={(event) => setTechnician(event.target.value)}
          className="min-h-12 rounded-xl border border-line bg-white px-3 text-sm font-bold text-ink outline-none focus:border-brand"
        >
          <option value="all">جميع الفنيين</option>
          {technicians.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() =>
            setNotice('تمت إضافة الملاحظة التشغيلية إلى سجل اليوم.')
          }
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-brand/30 px-4 text-sm font-bold text-brand transition hover:bg-brand-tint"
        >
          <StickyNote size={17} /> إضافة ملاحظة
        </button>
      </section>
      <section
        className="scrollbar-thin grid gap-4 overflow-x-auto pb-2 md:grid-cols-2 2xl:grid-cols-4"
        aria-label="مراحل الإنتاج"
      >
        {productionStages.map((stage) => {
          const stageCases = filteredCases.filter(
            (item) => item.stage === stage.id,
          );
          return (
            <div
              key={stage.id}
              className="min-w-[280px] rounded-[20px] border border-line bg-canvas/70 p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-ink">
                  {stage.label}
                </h3>
                <span
                  className={`western-digits rounded-full px-2.5 py-1 text-[11px] font-bold ${stage.tone}`}
                >
                  {stageCases.length}
                </span>
              </div>
              <div className="space-y-3">
                {stageCases.map((item) => (
                  <ProductionCard
                    key={item.id}
                    item={item}
                    onMove={(next) => {
                      moveCase(item.id, next);
                      setNotice(
                        `تم نقل الحالة ${item.id} إلى ${productionStages.find((entry) => entry.id === next)?.label}.`,
                      );
                    }}
                  />
                ))}
                {stageCases.length === 0 ? (
                  <div className="grid min-h-36 place-items-center rounded-2xl border border-dashed border-line bg-white text-center text-xs text-muted">
                    لا توجد حالات مطابقة
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </section>
      {notice ? <Toast message={notice} onClose={() => setNotice('')} /> : null}
    </div>
  );
}
