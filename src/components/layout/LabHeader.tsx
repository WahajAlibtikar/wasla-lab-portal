import { Bell, CheckCircle2, Menu } from 'lucide-react';
import { useState } from 'react';

export function LabHeader({ title, onOpenMenu }: { title: string; onOpenMenu: () => void }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between border-b border-line bg-white/95 px-4 backdrop-blur md:px-6 xl:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line text-muted lg:hidden"
          aria-label="فتح القائمة"
        >
          <Menu size={21} />
        </button>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-brand">معمل الابتسامة الذهبية للأسنان</p>
          <h1 className="truncate text-lg font-extrabold text-ink md:text-xl">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((current) => !current)}
            className="relative grid h-11 w-11 place-items-center rounded-xl border border-line text-muted transition hover:bg-canvas hover:text-ink"
            aria-label="الإشعارات — يوجد إشعاران جديدان"
            aria-expanded={notificationsOpen}
          >
            <Bell size={20} />
            <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
          </button>
          {notificationsOpen ? (
            <div className="absolute left-0 top-14 w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-line bg-white shadow-floating">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="text-sm font-extrabold text-ink">الإشعارات</span>
                <span className="western-digits rounded-full bg-danger-tint px-2 py-0.5 text-[10px] font-bold text-danger">2 جديد</span>
              </div>
              <div className="space-y-1 p-2">
                <div className="rounded-xl bg-brand-tint/60 p-3 text-xs leading-6 text-ink">وصل طلب جديد <b className="western-digits">WSL-2048</b> من عيادات صفوة الابتسامة.</div>
                <div className="rounded-xl bg-brand-tint/60 p-3 text-xs leading-6 text-ink">اعتمدت د. نورة السبيعي عرض الحالة <b className="western-digits">WSL-2039</b>.</div>
                <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-success"><CheckCircle2 size={14} /> لا توجد تنبيهات حرجة.</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
