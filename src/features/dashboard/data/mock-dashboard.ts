import { CircleDollarSign, Factory, Inbox, Truck } from 'lucide-react';
import type { MetricItem } from '../../../components/shared/MetricGrid';

export const dashboardMetrics: MetricItem[] = [
  {
    label: 'طلبات جديدة',
    value: '12',
    note: '3 وصلت اليوم',
    icon: Inbox,
    tone: 'brand',
  },
  {
    label: 'قيد الإنتاج',
    value: '45',
    note: 'في 4 مراحل',
    icon: Factory,
    tone: 'medical',
  },
  {
    label: 'تسليمات اليوم',
    value: '6',
    note: 'حالتان عاجلتان',
    icon: Truck,
    tone: 'success',
  },
  {
    label: 'مبالغ معلقة',
    value: '24,850 ر.س',
    note: '7 فواتير',
    icon: CircleDollarSign,
    tone: 'warning',
  },
];

export const attentionItems = [
  {
    id: 'WSL-2042',
    title: 'ملفات ناقصة',
    subtitle: 'د. ريم الفهد · دليل جراحي',
    action: 'طلب توضيح',
    tone: 'danger',
  },
  {
    id: 'WSL-2038',
    title: 'بانتظار التسعير',
    subtitle: 'د. سارة فهد · جسر خزفي 11–13',
    action: 'تقديم عرض',
    tone: 'warning',
  },
  {
    id: 'WSL-2035',
    title: 'بانتظار الاعتماد',
    subtitle: 'د. فيصل العبدالله · طقم جزئي',
    action: 'فتح الحالة',
    tone: 'medical',
  },
] as const;

export const productionLoad = [
  { label: 'قيد التصميم', value: 14, percent: 64, color: 'bg-warning' },
  { label: 'قيد التصنيع', value: 22, percent: 86, color: 'bg-medical' },
  { label: 'فحص الجودة', value: 5, percent: 38, color: 'bg-brand' },
  { label: 'جاهز للتسليم', value: 4, percent: 28, color: 'bg-success' },
] as const;

export const dueToday = [
  {
    id: 'WSL-2015',
    clinic: 'مجمع الابتسامة',
    status: 'متأخرة يومًا',
    time: '9:30 ص',
    urgent: true,
  },
  {
    id: 'WSL-2022',
    clinic: 'عيادات المدار',
    status: 'فحص الجودة',
    time: '11:00 ص',
    urgent: false,
  },
  {
    id: 'WSL-2035',
    clinic: 'مركز د. نورة',
    status: 'جاهزة للتسليم',
    time: '2:30 م',
    urgent: false,
  },
] as const;

export const recentActivity = [
  {
    id: 'WSL-2048',
    text: 'اعتمد الطبيب عرض السعر وبدأت الحالة في التصميم.',
    time: 'منذ 12 دقيقة',
  },
  {
    id: 'WSL-2047',
    text: 'أضافت د. نورة السبيعي صورة مرجع اللون.',
    time: 'منذ 35 دقيقة',
  },
  {
    id: 'WSL-2046',
    text: 'تم تحصيل الدفعة المقدمة وإصدار الإيصال.',
    time: 'منذ ساعة',
  },
] as const;
