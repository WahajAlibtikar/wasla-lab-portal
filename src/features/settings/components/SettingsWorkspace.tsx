import {
  Bell,
  Building2,
  Check,
  Clock3,
  Plus,
  Save,
  Settings2,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import { useState } from 'react';
import { Toast } from '../../../components/shared/Toast';
import { teamMembers } from '../data/default-settings';
import { useLabSettings } from '../hooks/use-lab-settings';
import type { SettingsSection } from '../types/settings.types';

const sections: Array<{
  id: SettingsSection;
  label: string;
  icon: typeof Building2;
}> = [
  { id: 'profile', label: 'ملف المعمل', icon: Building2 },
  { id: 'hours', label: 'أوقات العمل', icon: Clock3 },
  { id: 'services', label: 'الخدمات والأسعار', icon: WalletCards },
  { id: 'team', label: 'أعضاء الفريق', icon: UsersRound },
  { id: 'notifications', label: 'الإشعارات', icon: Bell },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition ${checked ? 'bg-brand' : 'bg-line'}`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${checked ? 'left-1' : 'left-6'}`}
      />
    </button>
  );
}

export function SettingsWorkspace() {
  const { settings, update, persist } = useLabSettings();
  const [section, setSection] = useState<SettingsSection>('profile');
  const [notice, setNotice] = useState('');
  const save = () => {
    persist();
    setNotice('تم حفظ إعدادات المعمل على هذا الجهاز.');
  };
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-ink">إعدادات المعمل</h2>
        <p className="mt-1 text-sm text-muted">
          حدّث الملف والخدمات والفريق والتنبيهات من مكان واحد.
        </p>
      </div>
      <div className="grid items-start gap-5 xl:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="scrollbar-thin flex gap-2 overflow-x-auto rounded-[20px] border border-line bg-white p-3 shadow-tactile xl:block xl:space-y-1">
          {sections.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex min-h-12 shrink-0 items-center gap-3 rounded-xl px-4 text-sm font-bold transition xl:w-full ${section === item.id ? 'bg-brand-tint text-brand' : 'text-muted hover:bg-canvas'}`}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>
        <section className="rounded-[22px] border border-line bg-white p-5 shadow-tactile sm:p-6">
          {section === 'profile' ? (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink">
                <Building2 size={21} className="text-brand" /> ملف المعمل
              </h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-bold text-muted">
                    اسم المعمل
                  </span>
                  <input
                    value={settings.labName}
                    onChange={(event) => update('labName', event.target.value)}
                    className="h-12 w-full rounded-xl border border-line px-3 text-sm font-bold outline-none focus:border-brand"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-xs font-bold text-muted">
                    رقم الترخيص
                  </span>
                  <input
                    dir="ltr"
                    value={settings.licenseNumber}
                    onChange={(event) =>
                      update('licenseNumber', event.target.value)
                    }
                    className="western-digits h-12 w-full rounded-xl border border-line px-3 text-left text-sm outline-none focus:border-brand"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-xs font-bold text-muted">
                    المدينة
                  </span>
                  <select
                    value={settings.city}
                    onChange={(event) => update('city', event.target.value)}
                    className="h-12 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-brand"
                  >
                    <option>الرياض</option>
                    <option>جدة</option>
                    <option>الدمام</option>
                  </select>
                </label>
                <label>
                  <span className="mb-2 block text-xs font-bold text-muted">
                    رقم الهاتف
                  </span>
                  <div className="flex h-12 items-center rounded-xl border border-line px-3 focus-within:border-brand">
                    <span className="western-digits ml-2 text-xs text-muted">
                      +966
                    </span>
                    <input
                      dir="ltr"
                      value={settings.phone}
                      onChange={(event) => update('phone', event.target.value)}
                      className="western-digits min-w-0 flex-1 text-left text-sm outline-none"
                    />
                  </div>
                </label>
                <label>
                  <span className="mb-2 block text-xs font-bold text-muted">
                    رقم واتساب
                  </span>
                  <div className="flex h-12 items-center rounded-xl border border-line px-3 focus-within:border-brand">
                    <span className="western-digits ml-2 text-xs text-muted">
                      +966
                    </span>
                    <input
                      dir="ltr"
                      value={settings.whatsapp}
                      onChange={(event) =>
                        update('whatsapp', event.target.value)
                      }
                      className="western-digits min-w-0 flex-1 text-left text-sm outline-none"
                    />
                  </div>
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-bold text-muted">
                    العنوان التفصيلي
                  </span>
                  <textarea
                    rows={3}
                    value={settings.address}
                    onChange={(event) => update('address', event.target.value)}
                    className="w-full resize-none rounded-xl border border-line p-3 text-sm leading-7 outline-none focus:border-brand"
                  />
                </label>
              </div>
            </div>
          ) : null}
          {section === 'hours' ? (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink">
                <Clock3 size={21} className="text-brand" /> أوقات العمل
              </h3>
              <p className="mt-1 text-xs text-muted">
                تظهر هذه المواعيد للأطباء عند اختيار المعمل.
              </p>
              <div className="mt-5 divide-y divide-line rounded-2xl border border-line">
                {settings.hours.map((item, index) => (
                  <div
                    key={item.day}
                    className="flex flex-wrap items-center gap-3 p-4"
                  >
                    <Toggle
                      checked={item.enabled}
                      label={`حالة دوام ${item.day}`}
                      onChange={(enabled) =>
                        update(
                          'hours',
                          settings.hours.map((entry, entryIndex) =>
                            entryIndex === index
                              ? { ...entry, enabled }
                              : entry,
                          ),
                        )
                      }
                    />
                    <span className="w-20 text-sm font-bold text-ink">
                      {item.day}
                    </span>
                    <div className="mr-auto flex items-center gap-2">
                      <span className="western-digits rounded-lg bg-canvas px-3 py-2 text-xs text-muted">
                        {item.enabled ? item.from : 'مغلق'}
                      </span>
                      {item.enabled ? (
                        <>
                          <span className="text-xs text-muted">إلى</span>
                          <span className="western-digits rounded-lg bg-canvas px-3 py-2 text-xs text-muted">
                            {item.to}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {section === 'services' ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink">
                    <WalletCards size={21} className="text-brand" /> الخدمات
                    والأسعار
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    أسعار ومدد افتراضية قابلة للتعديل في كل طلب.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNotice('إضافة خدمة جديدة متاحة في النسخة التالية.')
                  }
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-brand/30 px-4 text-xs font-bold text-brand"
                >
                  <Plus size={16} /> إضافة خدمة
                </button>
              </div>
              <div className="mt-5 space-y-3">
                {settings.services.map((service) => (
                  <div
                    key={service.id}
                    className="grid gap-3 rounded-2xl border border-line p-4 sm:grid-cols-[minmax(0,1fr)_130px_120px_auto] sm:items-center"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-ink">
                        {service.name}
                      </p>
                      <p className="mt-1 text-[11px] text-muted">
                        سعر ومدة التنفيذ الافتراضيان
                      </p>
                    </div>
                    <label className="flex h-10 items-center rounded-xl bg-canvas px-3">
                      <input
                        dir="ltr"
                        value={service.price}
                        onChange={(event) =>
                          update(
                            'services',
                            settings.services.map((entry) =>
                              entry.id === service.id
                                ? { ...entry, price: event.target.value }
                                : entry,
                            ),
                          )
                        }
                        className="western-digits min-w-0 flex-1 bg-transparent text-left text-xs font-bold outline-none"
                      />
                      <span className="text-[10px] text-muted">ر.س</span>
                    </label>
                    <span className="rounded-xl bg-canvas px-3 py-3 text-center text-xs font-bold text-muted">
                      {service.turnaround}
                    </span>
                    <Toggle
                      checked={service.active}
                      label={`تفعيل ${service.name}`}
                      onChange={(active) =>
                        update(
                          'services',
                          settings.services.map((entry) =>
                            entry.id === service.id
                              ? { ...entry, active }
                              : entry,
                          ),
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {section === 'team' ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink">
                    <UsersRound size={21} className="text-brand" /> أعضاء الفريق
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    أدوار العاملين في إدارة الحالات والإنتاج.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNotice('دعوة عضو جديد إجراء تجريبي في الـMVP.')
                  }
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-brand/30 px-4 text-xs font-bold text-brand"
                >
                  <Plus size={16} /> دعوة عضو
                </button>
              </div>
              <div className="mt-5 divide-y divide-line rounded-2xl border border-line">
                {teamMembers.map((member) => (
                  <div
                    key={member.email}
                    className="flex items-center gap-3 p-4"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-medical-tint text-xs font-extrabold text-medical">
                      {member.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-ink">
                        {member.name}
                      </p>
                      <p className="mt-1 text-[11px] text-muted">
                        {member.role} · <span dir="ltr">{member.email}</span>
                      </p>
                    </div>
                    <span className="mr-auto inline-flex items-center gap-1 rounded-full bg-success-tint px-2.5 py-1 text-[10px] font-bold text-success">
                      <Check size={12} /> نشط
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {section === 'notifications' ? (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink">
                <Bell size={21} className="text-brand" /> تفضيلات الإشعارات
              </h3>
              <p className="mt-1 text-xs text-muted">
                اختر الأحداث التي تظهر في تنبيهات بوابة المعمل.
              </p>
              <div className="mt-5 divide-y divide-line rounded-2xl border border-line">
                {(
                  [
                    {
                      key: 'newOrders',
                      label: 'الطلبات الجديدة',
                      note: 'تنبيه عند وصول طلب جديد من طبيب.',
                    },
                    {
                      key: 'urgentCases',
                      label: 'الحالات العاجلة والمتأخرة',
                      note: 'تنبيه قبل تجاوز موعد التسليم.',
                    },
                    {
                      key: 'payments',
                      label: 'الدفعات والفواتير',
                      note: 'تنبيه عند تحصيل دفعة أو تأخر فاتورة.',
                    },
                    {
                      key: 'deliveries',
                      label: 'التوصيل والتسليم',
                      note: 'تنبيه عند بدء المهمة وتأكيد الاستلام.',
                    },
                  ] as const
                ).map((item) => (
                  <div key={item.key} className="flex items-center gap-4 p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-canvas text-muted">
                      <Settings2 size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold text-ink">
                        {item.label}
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-muted">
                        {item.note}
                      </p>
                    </div>
                    <Toggle
                      checked={settings.notifications[item.key]}
                      label={`إشعارات ${item.label}`}
                      onChange={(value) =>
                        update('notifications', {
                          ...settings.notifications,
                          [item.key]: value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-6 flex justify-end border-t border-line pt-5">
            <button
              type="button"
              onClick={save}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-white transition hover:bg-brand-pressed active:scale-[0.98]"
            >
              <Save size={17} /> حفظ التعديلات
            </button>
          </div>
        </section>
      </div>
      {notice ? <Toast message={notice} onClose={() => setNotice('')} /> : null}
    </div>
  );
}
