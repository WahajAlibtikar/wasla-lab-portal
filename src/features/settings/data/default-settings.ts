import type { LabSettings } from '../types/settings.types';

export const defaultSettings: LabSettings = {
  labName: 'معمل الابتسامة الذهبية للأسنان',
  licenseNumber: 'L-2039485',
  city: 'الرياض',
  phone: '0501234567',
  whatsapp: '0501234567',
  address: 'حي العليا، شارع التحلية، الرياض',
  hours: [
    { day: 'الأحد', enabled: true, from: '8:00 ص', to: '6:00 م' },
    { day: 'الاثنين', enabled: true, from: '8:00 ص', to: '6:00 م' },
    { day: 'الثلاثاء', enabled: true, from: '8:00 ص', to: '6:00 م' },
    { day: 'الأربعاء', enabled: true, from: '8:00 ص', to: '6:00 م' },
    { day: 'الخميس', enabled: true, from: '8:00 ص', to: '4:00 م' },
    { day: 'الجمعة', enabled: false, from: '—', to: '—' },
    { day: 'السبت', enabled: false, from: '—', to: '—' },
  ],
  services: [
    {
      id: 'service-1',
      name: 'تاج زركونيا عالي الشفافية',
      price: '680',
      turnaround: '5 أيام',
      active: true,
    },
    {
      id: 'service-2',
      name: 'جسر إيماكس تجميلي',
      price: '1,200',
      turnaround: '7 أيام',
      active: true,
    },
    {
      id: 'service-3',
      name: 'طقم جزئي مرن',
      price: '920',
      turnaround: '8 أيام',
      active: true,
    },
    {
      id: 'service-4',
      name: 'دليل جراحي رقمي',
      price: '850',
      turnaround: '4 أيام',
      active: false,
    },
  ],
  notifications: {
    newOrders: true,
    urgentCases: true,
    payments: true,
    deliveries: false,
  },
};

export const teamMembers = [
  {
    name: 'أحمد العتيبي',
    initials: 'أع',
    role: 'منسق الحالات',
    email: 'ahmed@golden-smile.sa',
  },
  {
    name: 'سارة العتيبي',
    initials: 'سع',
    role: 'فنية تصميم رقمي',
    email: 'sara@golden-smile.sa',
  },
  {
    name: 'خالد محمد',
    initials: 'خم',
    role: 'فني تركيبات ثابتة',
    email: 'khaled@golden-smile.sa',
  },
] as const;
