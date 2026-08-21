import {
  BarChart3,
  Factory,
  Inbox,
  MessageSquare,
  Settings,
  Truck,
  WalletCards,
  X,
} from 'lucide-react';

export type LabSection = 'dashboard' | 'orders' | 'production' | 'messages' | 'finance' | 'delivery' | 'settings';

const navigation: Array<{ id: LabSection; label: string; icon: typeof Inbox; badge?: string }> = [
  { id: 'dashboard', label: 'لوحة المتابعة', icon: BarChart3 },
  { id: 'orders', label: 'الطلبات الواردة', icon: Inbox, badge: '12' },
  { id: 'production', label: 'الإنتاج', icon: Factory, badge: '45' },
  { id: 'messages', label: 'الرسائل', icon: MessageSquare, badge: '3' },
  { id: 'finance', label: 'المالية', icon: WalletCards },
  { id: 'delivery', label: 'التوصيل', icon: Truck },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
];

interface LabSidebarProps {
  activeSection: LabSection;
  open: boolean;
  onClose: () => void;
  onNavigate: (section: LabSection) => void;
}

export function LabSidebar({ activeSection, open, onClose, onNavigate }: LabSidebarProps) {
  return (
    <>
      {open ? <button className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={onClose} aria-label="إغلاق القائمة" /> : null}
      <aside
        className={`fixed inset-y-0 right-0 z-40 flex w-64 flex-col border-l border-line bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex min-h-20 items-center justify-between border-b border-line px-6">
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-brand">وصلة</span>
            <p className="mt-1 text-xs font-medium text-muted">بوابة معامل الأسنان</p>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-xl text-muted lg:hidden" onClick={onClose} aria-label="إغلاق القائمة">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="التنقل الرئيسي">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeSection;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`relative flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-sm font-semibold transition ${
                  active ? 'bg-brand-tint text-brand' : 'text-muted hover:bg-canvas hover:text-ink'
                }`}
              >
                {active ? <span className="absolute inset-y-2 right-0 w-[3px] rounded-full bg-brand" /> : null}
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                <span>{item.label}</span>
                {item.badge ? (
                  <span className={`mr-auto rounded-full px-2 py-0.5 text-[11px] font-bold western-digits ${active ? 'bg-white text-brand' : 'bg-canvas text-muted'}`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-canvas p-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-medical-tint text-sm font-extrabold text-medical">أع</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">أحمد العتيبي</p>
              <p className="truncate text-xs text-muted">منسق الحالات</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
