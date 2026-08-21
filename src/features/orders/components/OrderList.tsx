import { AlertTriangle, File, Search, SlidersHorizontal } from 'lucide-react';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import type { LabOrder, OrderFilter } from '../types/order.types';

const filters: Array<{ id: OrderFilter; label: string }> = [
  { id: 'all', label: 'الكل' },
  { id: 'attention', label: 'تحتاج إجراء' },
  { id: 'urgent', label: 'عاجلة' },
  { id: 'quote_sent', label: 'أُرسل العرض' },
];

interface OrderListProps {
  orders: LabOrder[];
  selectedOrderId: string;
  query: string;
  filter: OrderFilter;
  onQueryChange: (query: string) => void;
  onFilterChange: (filter: OrderFilter) => void;
  onSelect: (orderId: string) => void;
}

export function OrderList({
  orders,
  selectedOrderId,
  query,
  filter,
  onQueryChange,
  onFilterChange,
  onSelect,
}: OrderListProps) {
  return (
    <section className="flex min-h-[620px] flex-col overflow-hidden rounded-[22px] border border-line bg-white shadow-tactile">
      <div className="border-b border-line p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-ink">الطلبات الواردة</h2>
            <p className="mt-0.5 text-xs text-muted">
              <span className="western-digits inline-block">{orders.length}</span> طلبات ظاهرة
            </p>
          </div>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted" aria-label="خيارات التصفية">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <label className="mt-4 flex h-12 items-center gap-2 rounded-xl border border-line bg-canvas px-3 transition focus-within:border-brand focus-within:bg-white">
          <Search size={18} className="shrink-0 text-muted" aria-hidden="true" />
          <span className="sr-only">البحث في الطلبات</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted/80"
            placeholder="رقم الحالة، الطبيب أو الخدمة"
          />
        </label>

        <div className="scrollbar-thin mt-3 flex gap-2 overflow-x-auto pb-1">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onFilterChange(item.id)}
              className={`shrink-0 rounded-full border px-3 py-2 text-xs font-bold transition ${
                filter === item.id ? 'border-brand bg-brand text-white' : 'border-line bg-white text-muted hover:bg-canvas'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto p-3">
        {orders.length ? (
          orders.map((order) => {
            const selected = selectedOrderId === order.id;
            return (
              <button
                key={order.id}
                type="button"
                onClick={() => onSelect(order.id)}
                className={`relative w-full rounded-2xl border p-4 text-right transition ${
                  selected
                    ? 'border-brand bg-brand-tint/70 shadow-sm'
                    : 'border-line bg-white hover:border-brand/35 hover:bg-canvas/70'
                }`}
              >
                {order.unread ? <span className="absolute left-3 top-3 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-white" aria-label="غير مقروء" /> : null}
                <div className="flex items-center gap-2">
                  <span className="western-digits inline-flex rounded-lg bg-white px-2 py-1 text-[11px] font-extrabold text-brand ring-1 ring-line">
                    {order.id}
                  </span>
                  {order.priority === 'urgent' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-danger-tint px-2 py-1 text-[10px] font-bold text-danger">
                      <AlertTriangle size={11} /> عاجل
                    </span>
                  ) : null}
                  <span className="mr-auto text-[11px] font-medium text-muted">{order.submittedAt}</span>
                </div>

                <h3 className="mt-3 line-clamp-1 text-[15px] font-extrabold text-ink">{order.service}</h3>
                <p className="mt-1 line-clamp-1 text-xs font-semibold text-muted">{order.doctorName} · {order.clinicName}</p>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                    <File size={13} />
                    <span className="western-digits inline-block">{order.attachments.length}</span>
                    <span>مرفقات</span>
                    <span className="text-line">•</span>
                    <span>السن</span>
                    <span className="western-digits inline-block font-bold text-ink">{order.teeth}</span>
                  </div>
                  <StatusBadge status={order.status} compact />
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <Search size={30} className="text-muted/60" />
            <p className="mt-3 text-sm font-bold text-ink">لا توجد طلبات مطابقة</p>
            <p className="mt-1 text-xs leading-6 text-muted">جرّب تغيير عبارة البحث أو اختيار تصنيف آخر.</p>
          </div>
        )}
      </div>
    </section>
  );
}
