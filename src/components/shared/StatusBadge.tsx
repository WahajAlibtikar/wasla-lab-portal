import { AlertCircle, CheckCircle2, Clock3, Factory, HelpCircle, XCircle } from 'lucide-react';
import type { OrderStatus } from '../../features/orders/types/order.types';

const statusMap: Record<
  OrderStatus,
  { label: string; classes: string; icon: typeof Clock3 }
> = {
  new: { label: 'طلب جديد', classes: 'bg-warning-tint text-warning', icon: AlertCircle },
  awaiting_review: { label: 'بانتظار المراجعة', classes: 'bg-medical-tint text-medical', icon: Clock3 },
  needs_clarification: { label: 'يحتاج توضيح', classes: 'bg-warning-tint text-warning', icon: HelpCircle },
  quote_sent: { label: 'تم إرسال العرض', classes: 'bg-success-tint text-success', icon: CheckCircle2 },
  in_production: { label: 'قيد الإنتاج', classes: 'bg-medical-tint text-medical', icon: Factory },
  rejected: { label: 'مرفوض', classes: 'bg-danger-tint text-danger', icon: XCircle },
};

export function StatusBadge({ status, compact = false }: { status: OrderStatus; compact?: boolean }) {
  const config = statusMap[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-bold ${config.classes} ${
        compact ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
      }`}
    >
      <Icon size={compact ? 12 : 14} strokeWidth={2.2} aria-hidden="true" />
      {config.label}
    </span>
  );
}
