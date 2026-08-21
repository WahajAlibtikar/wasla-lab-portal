import { CalendarDays, MapPin, MessageSquare, ShieldCheck, Stethoscope, UserRound } from 'lucide-react';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import type { LabOrder, QuoteDraft } from '../types/order.types';
import { AttachmentGrid } from './AttachmentGrid';
import { OrderTimeline } from './OrderTimeline';
import { QuoteForm } from './QuoteForm';

interface OrderDetailsProps {
  order: LabOrder | null;
  onSaveQuote: (quote: QuoteDraft) => void;
  onAcceptQuote: (quote: QuoteDraft) => void;
  onRequestClarification: () => void;
  onReject: () => void;
  onNotify: (message: string) => void;
}

function DetailItem({ label, value, ltr = false }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line py-3 last:border-b-0">
      <dt className="text-xs font-semibold text-muted">{label}</dt>
      <dd className={`text-left text-xs font-extrabold text-ink ${ltr ? 'western-digits' : ''}`}>{value}</dd>
    </div>
  );
}

export function OrderDetails({
  order,
  onSaveQuote,
  onAcceptQuote,
  onRequestClarification,
  onReject,
  onNotify,
}: OrderDetailsProps) {
  if (!order) {
    return (
      <section className="grid min-h-[620px] place-items-center rounded-[22px] border border-line bg-white p-8 text-center shadow-tactile">
        <div>
          <Stethoscope size={36} className="mx-auto text-muted/60" />
          <h2 className="mt-4 text-lg font-extrabold text-ink">اختر طلبًا لمراجعته</h2>
          <p className="mt-2 text-sm leading-7 text-muted">ستظهر هنا بيانات الحالة والمرفقات وخيارات التسعير.</p>
        </div>
      </section>
    );
  }

  return (
    <article className="min-w-0 overflow-hidden rounded-[22px] border border-line bg-white shadow-tactile">
      <header className="border-b border-line bg-canvas/70 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="western-digits text-xl font-extrabold text-ink sm:text-2xl">{order.id}</span>
              <StatusBadge status={order.status} />
              {order.priority === 'urgent' ? (
                <span className="rounded-full bg-danger-tint px-3 py-1.5 text-xs font-bold text-danger">تسليم عاجل</span>
              ) : null}
            </div>
            <h2 className="mt-3 text-lg font-extrabold text-ink">{order.service}</h2>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted">
              <span className="inline-flex items-center gap-1.5"><Stethoscope size={15} /> {order.doctorName}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {order.clinicName}</span>
            </div>
          </div>
          <div className="rounded-xl border border-line bg-white px-4 py-3 sm:text-left">
            <p className="text-[11px] font-semibold text-muted">موعد التسليم المطلوب</p>
            <p className="western-digits mt-1 flex items-center gap-1.5 text-sm font-extrabold text-ink sm:justify-end">
              <CalendarDays size={16} className="text-brand" /> {order.requestedDelivery}
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-5 p-4 sm:p-6">
        <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_minmax(290px,.72fr)]">
          <section className="rounded-[18px] border border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-ink">
                <UserRound size={18} className="text-brand" /> بيانات الحالة
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-success-tint px-2.5 py-1 text-[10px] font-bold text-success">
                <ShieldCheck size={12} /> بيانات المريض مخفية
              </span>
            </div>
            <dl className="mt-3 grid gap-x-6 sm:grid-cols-2">
              <DetailItem label="رمز المريض" value={order.patientInitials} />
              <DetailItem label="العمر" value={order.patientAge} />
              <DetailItem label="السن أو المنطقة" value={order.teeth} ltr />
              <DetailItem label="درجة اللون" value={order.shade} ltr />
              <DetailItem label="العيادة" value={order.clinicName} />
              <DetailItem label="الموقع" value={order.clinicCity} />
            </dl>
          </section>

          <section className="rounded-[18px] border border-line p-4">
            <h3 className="text-sm font-extrabold text-ink">تسلسل الطلب</h3>
            <div className="mt-4">
              <OrderTimeline steps={order.timeline} />
            </div>
          </section>
        </div>

        <div className="grid gap-5 2xl:grid-cols-2">
          <section className="rounded-[18px] border border-line p-4">
            <h3 className="text-sm font-extrabold text-ink">وصفة الطبيب</h3>
            <p className="mt-3 rounded-xl bg-canvas px-4 py-3 text-sm leading-8 text-ink">{order.prescription}</p>
          </section>

          <section className="rounded-[18px] border border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-extrabold text-ink">المرفقات الفنية</h3>
              <span className="text-xs font-semibold text-muted">
                <span className="western-digits inline-block">{order.attachments.length}</span> ملفات
              </span>
            </div>
            <div className="mt-3">
              <AttachmentGrid attachments={order.attachments} />
            </div>
          </section>
        </div>

        <section className="rounded-[18px] border border-line p-4">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-ink">
            <MessageSquare size={17} className="text-brand" /> محادثة الحالة
          </h3>
          <div className="mt-3 space-y-2">
            {order.messages.length ? (
              order.messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                    message.sender === 'lab' ? 'mr-auto rounded-bl-md bg-medical-tint' : 'rounded-br-md bg-brand-tint'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[11px] font-extrabold text-ink">{message.author}</span>
                    <span className="western-digits text-[10px] text-muted">{message.time}</span>
                  </div>
                  <p className="mt-1 text-xs leading-6 text-ink">{message.body}</p>
                </div>
              ))
            ) : (
              <p className="rounded-xl bg-canvas px-4 py-3 text-xs text-muted">لا توجد رسائل على هذه الحالة حتى الآن.</p>
            )}
          </div>
        </section>

        <QuoteForm
          order={order}
          onSave={onSaveQuote}
          onAccept={onAcceptQuote}
          onRequestClarification={onRequestClarification}
          onReject={onReject}
          onNotify={onNotify}
        />
      </div>
    </article>
  );
}
