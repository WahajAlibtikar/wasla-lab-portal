import { Banknote, CircleDollarSign, Clock3, ReceiptText } from 'lucide-react';
import type { MetricItem } from '../../../components/shared/MetricGrid';
import type { Invoice } from '../types/finance.types';

export const financeMetrics: MetricItem[] = [
  {
    label: 'إجمالي هذا الشهر',
    value: '86,420 ر.س',
    note: 'قبل الضريبة',
    icon: CircleDollarSign,
    tone: 'brand',
  },
  {
    label: 'دفعات مقدمة',
    value: '18,750 ر.س',
    note: 'تم تحصيلها',
    icon: Banknote,
    tone: 'success',
  },
  {
    label: 'أرصدة متبقية',
    value: '24,850 ر.س',
    note: 'مستحقة',
    icon: Clock3,
    tone: 'warning',
  },
  {
    label: 'بانتظار السداد',
    value: '7 فواتير',
    note: 'من 5 عيادات',
    icon: ReceiptText,
    tone: 'danger',
  },
];

export const invoices: Invoice[] = [
  {
    id: 'INV-0842',
    caseId: 'WSL-2048',
    clinic: 'عيادات صفوة الابتسامة',
    doctor: 'د. خالد الزهراني',
    service: 'تاج زركونيا عالي الشفافية',
    subtotal: 2400,
    tax: 360,
    paid: 690,
    dueDate: '22 أغسطس 2026',
    status: 'balance_due',
  },
  {
    id: 'INV-0841',
    caseId: 'WSL-2045',
    clinic: 'مركز د. نورة السبيعي',
    doctor: 'د. نورة السبيعي',
    service: 'جسر إيماكس تجميلي',
    subtotal: 1200,
    tax: 180,
    paid: 1380,
    dueDate: '15 أغسطس 2026',
    status: 'paid',
  },
  {
    id: 'INV-0840',
    caseId: 'WSL-2041',
    clinic: 'مجمع أفق الأسنان',
    doctor: 'د. محمد عبدالسلام',
    service: 'طقم جزئي مرن',
    subtotal: 3600,
    tax: 540,
    paid: 1035,
    dueDate: '19 أغسطس 2026',
    status: 'overdue',
  },
  {
    id: 'INV-0839',
    caseId: 'WSL-2039',
    clinic: 'عيادات مدار الطبية',
    doctor: 'د. ريم الدوسري',
    service: 'تاج على زراعة',
    subtotal: 1850,
    tax: 277.5,
    paid: 531.88,
    dueDate: '27 أغسطس 2026',
    status: 'balance_due',
  },
];
