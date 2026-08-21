import { useState } from 'react';
import { LabHeader } from '../components/layout/LabHeader';
import { LabSidebar, type LabSection } from '../components/layout/LabSidebar';
import { DashboardWorkspace } from '../features/dashboard/components/DashboardWorkspace';
import { DeliveryWorkspace } from '../features/delivery/components/DeliveryWorkspace';
import { FinanceWorkspace } from '../features/finance/components/FinanceWorkspace';
import { MessagesWorkspace } from '../features/messages/components/MessagesWorkspace';
import { OrdersWorkspace } from '../features/orders/components/OrdersWorkspace';
import { ProductionWorkspace } from '../features/production/components/ProductionWorkspace';
import { SettingsWorkspace } from '../features/settings/components/SettingsWorkspace';

const sectionTitles: Record<LabSection, string> = {
  dashboard: 'لوحة المتابعة',
  orders: 'الطلبات الواردة',
  production: 'إدارة الإنتاج',
  messages: 'الرسائل',
  finance: 'المالية والفواتير',
  delivery: 'التوصيل والتسليم',
  settings: 'إعدادات المعمل',
};

function SectionContent({
  section,
  onNavigate,
}: {
  section: LabSection;
  onNavigate: (section: LabSection) => void;
}) {
  switch (section) {
    case 'dashboard':
      return <DashboardWorkspace onOpenOrders={() => onNavigate('orders')} />;
    case 'orders':
      return <OrdersWorkspace />;
    case 'production':
      return <ProductionWorkspace />;
    case 'messages':
      return <MessagesWorkspace />;
    case 'finance':
      return <FinanceWorkspace />;
    case 'delivery':
      return <DeliveryWorkspace />;
    case 'settings':
      return <SettingsWorkspace />;
  }
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
        <LabHeader
          title={sectionTitles[activeSection]}
          onOpenMenu={() => setSidebarOpen(true)}
        />
        <main className="p-4 md:p-6 xl:p-8">
          <SectionContent
            section={activeSection}
            onNavigate={setActiveSection}
          />
        </main>
      </div>
    </div>
  );
}
