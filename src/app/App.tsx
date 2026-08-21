import { useState } from 'react';
import { BarChart3, Factory, MessageSquare, Settings, Truck, WalletCards } from 'lucide-react';
import { LabHeader } from '../components/layout/LabHeader';
import { LabSidebar, type LabSection } from '../components/layout/LabSidebar';
import { OrdersWorkspace } from '../features/orders/components/OrdersWorkspace';

const sectionTitles: Record<LabSection, string> = {
  dashboard: 'لوحة المتابعة',
  orders: 'الطلبات الواردة',
  production: 'إدارة الإنتاج',
  messages: 'الرسائل',
  finance: 'المالية والفواتير',
  delivery: 'التوصيل والتسليم',
  settings: 'إعدادات المعمل',
};

const placeholderContent = {
  dashboard: {
    icon: BarChart3,
    description: 'ملخص التشغيل اليومي، المواعيد القريبة، والحالات التي تحتاج قرارًا.',
  },
  production: {
    icon: Factory,
    description: 'لوحة مراحل التصميم والتصنيع وفحص الجودة والاستعداد للتسليم.',
  },
  messages: {
    icon: MessageSquare,
    description: 'كل محادثات الأطباء مرتبطة برقم الحالة والملفات ذات الصلة.',
  },
  finance: {
    icon: WalletCards,
    description: 'العروض المعتمدة، الدفعات، الرصيد المتبقي والفواتير التجريبية.',
  },
  delivery: {
    icon: Truck,
    description: 'طلبات الاستلام، بيانات المندوب، وحالة التسليم للعيادة.',
  },
  settings: {
    icon: Settings,
    description: 'خدمات المعمل، الأسعار الافتراضية، مدة التنفيذ وأعضاء الفريق.',
  },
} as const;

type PlaceholderSection = keyof typeof placeholderContent;

function SectionPlaceholder({ section, onOpenOrders }: { section: PlaceholderSection; onOpenOrders: () => void }) {
  const content = placeholderContent[section];
  const Icon = content.icon;

  return (
    <section className="grid min-h-[calc(100vh-12rem)] place-items-center rounded-[24px] border border-line bg-white p-8 text-center shadow-tactile">
      <div className="max-w-md">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-tint text-brand">
          <Icon size={28} />
        </span>
        <h2 className="mt-5 text-xl font-extrabold text-ink">{sectionTitles[section]}</h2>
        <p className="mt-2 text-sm leading-8 text-muted">{content.description}</p>
        <div className="mt-5 rounded-xl bg-canvas px-4 py-3 text-xs leading-6 text-muted">
          هذه الصفحة ضمن المرحلة التالية. النسخة الحالية مركزة على استقبال الطلبات ومراجعتها وتسعيرها.
        </div>
        <button
          type="button"
          onClick={onOpenOrders}
          className="mt-5 min-h-12 rounded-xl bg-brand px-6 text-sm font-bold text-white transition hover:bg-brand-pressed active:scale-[0.98]"
        >
          فتح الطلبات الواردة
        </button>
      </div>
    </section>
  );
}

export function App() {
  const [activeSection, setActiveSection] = useState<LabSection>('orders');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-canvas text-ink lg:flex">
      <LabSidebar
        activeSection={activeSection}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={setActiveSection}
      />

      <div className="min-w-0 flex-1">
        <LabHeader title={sectionTitles[activeSection]} onOpenMenu={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 xl:p-8">
          {activeSection === 'orders' ? (
            <OrdersWorkspace />
          ) : (
            <SectionPlaceholder section={activeSection} onOpenOrders={() => setActiveSection('orders')} />
          )}
        </main>
      </div>
    </div>
  );
}
