import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, MessageSquareText, Save } from 'lucide-react';
import { Modal } from '../../../components/shared/Modal';
import type { LabOrder, QuoteDraft } from '../types/order.types';

const emptyQuote: QuoteDraft = {
  price: '',
  workingDays: '5',
  promisedDate: '',
  internalNote: '',
};

interface QuoteFormProps {
  order: LabOrder;
  onSave: (quote: QuoteDraft) => void;
  onAccept: (quote: QuoteDraft) => void;
  onRequestClarification: () => void;
  onReject: () => void;
  onNotify: (message: string) => void;
}

export function QuoteForm({ order, onSave, onAccept, onRequestClarification, onReject, onNotify }: QuoteFormProps) {
  const [quote, setQuote] = useState<QuoteDraft>(order.quote ?? { ...emptyQuote, promisedDate: order.requestedDelivery });
  const [error, setError] = useState('');
  const [action, setAction] = useState<'clarify' | 'reject' | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    setQuote(order.quote ?? { ...emptyQuote, promisedDate: order.requestedDelivery });
    setError('');
  }, [order]);

  const setField = (field: keyof QuoteDraft, value: string) => setQuote((current) => ({ ...current, [field]: value }));

  const validate = () => {
    if (!quote.price || Number(quote.price) <= 0) return 'أدخل سعرًا صحيحًا للخدمة.';
    if (!quote.workingDays || Number(quote.workingDays) <= 0) return 'حدد مدة التنفيذ المتوقعة.';
    if (!quote.promisedDate.trim()) return 'حدد تاريخ التسليم المتوقع.';
    return '';
  };

  const handleSave = () => {
    onSave(quote);
    onNotify('تم حفظ مسودة العرض على هذا الجهاز.');
  };

  const handleAccept = () => {
    const validationError = validate();
    setError(validationError);
    if (validationError) return;
    onAccept(quote);
    onNotify('تم قبول الحالة وإرسال عرض السعر للطبيب.');
  };

  const completeSecondaryAction = () => {
    if (!reason.trim()) return;
    if (action === 'clarify') {
      onRequestClarification();
      onNotify('تم إرسال طلب التوضيح إلى الطبيب.');
    } else {
      onReject();
      onNotify('تم رفض الطلب وتسجيل السبب.');
    }
    setAction(null);
    setReason('');
  };

  return (
    <section className="rounded-[20px] border border-line bg-canvas/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-ink">عرض السعر وقرار القبول</h3>
          <p className="mt-1 text-xs leading-6 text-muted">أدخل مدة وسعرًا واضحين قبل إرسال العرض للطبيب.</p>
        </div>
        {order.status === 'quote_sent' ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-tint px-3 py-1.5 text-xs font-bold text-success">
            <CheckCircle2 size={14} /> أُرسل العرض
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-xs font-bold text-muted">سعر الخدمة</span>
          <span className="flex h-[52px] items-center rounded-xl border border-line bg-white px-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10">
            <input
              type="number"
              min="0"
              inputMode="decimal"
              value={quote.price}
              onChange={(event) => setField('price', event.target.value)}
              placeholder="680"
              className="western-digits min-w-0 flex-1 bg-transparent text-left text-sm font-bold outline-none"
            />
            <span className="text-xs font-bold text-muted">ر.س</span>
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold text-muted">مدة التنفيذ</span>
          <span className="flex h-[52px] items-center rounded-xl border border-line bg-white px-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10">
            <input
              type="number"
              min="1"
              value={quote.workingDays}
              onChange={(event) => setField('workingDays', event.target.value)}
              className="western-digits min-w-0 flex-1 bg-transparent text-left text-sm font-bold outline-none"
            />
            <span className="text-xs font-bold text-muted">أيام عمل</span>
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold text-muted">التسليم المتوقع</span>
          <input
            value={quote.promisedDate}
            onChange={(event) => setField('promisedDate', event.target.value)}
            className="h-[52px] w-full rounded-xl border border-line bg-white px-3 text-sm font-bold text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
            placeholder="22 أغسطس 2026"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-xs font-bold text-muted">ملاحظة داخلية للفنيين — اختيارية</span>
        <textarea
          rows={2}
          value={quote.internalNote}
          onChange={(event) => setField('internalNote', event.target.value)}
          className="w-full resize-none rounded-xl border border-line bg-white p-3 text-sm leading-7 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
          placeholder="مثال: مراجعة سماكة الإطباق قبل بدء التفريز"
        />
      </label>

      {error ? (
        <p className="mt-3 flex items-center gap-2 rounded-xl bg-danger-tint px-3 py-2 text-xs font-bold text-danger">
          <AlertTriangle size={15} /> {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col-reverse gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAction('clarify')}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-xs font-bold text-muted transition hover:bg-canvas"
          >
            <MessageSquareText size={16} /> طلب توضيح
          </button>
          <button
            type="button"
            onClick={() => setAction('reject')}
            className="min-h-11 rounded-xl border border-danger/40 bg-white px-4 text-xs font-bold text-danger transition hover:bg-danger-tint"
          >
            رفض الطلب
          </button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-brand/30 bg-white px-5 text-sm font-bold text-brand transition hover:bg-brand-tint active:scale-[0.98]"
          >
            <Save size={17} /> حفظ المسودة
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-white transition hover:bg-brand-pressed active:scale-[0.98]"
          >
            <CheckCircle2 size={18} /> قبول وإرسال العرض
          </button>
        </div>
      </div>

      <Modal
        open={Boolean(action)}
        title={action === 'clarify' ? 'طلب توضيح من الطبيب' : 'رفض الطلب'}
        description={
          action === 'clarify'
            ? 'اكتب المعلومة الناقصة بوضوح حتى يستطيع الطبيب الرد بسرعة.'
            : 'اذكر سببًا مهنيًا واضحًا ليظهر للطبيب مع قرار الرفض.'
        }
        onClose={() => {
          setAction(null);
          setReason('');
        }}
      >
        <textarea
          autoFocus
          rows={4}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="w-full resize-none rounded-xl border border-line p-3 text-sm leading-7 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          placeholder={action === 'clarify' ? 'مثال: نحتاج اسم نظام الزراعة وقطر المنصة...' : 'مثال: الخدمة المطلوبة غير متاحة ضمن جدول الإنتاج الحالي...'}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setAction(null)} className="min-h-11 rounded-xl border border-line px-4 text-sm font-bold text-muted">
            إلغاء
          </button>
          <button
            type="button"
            onClick={completeSecondaryAction}
            disabled={!reason.trim()}
            className={`min-h-11 rounded-xl px-5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-45 ${
              action === 'reject' ? 'bg-danger' : 'bg-brand hover:bg-brand-pressed'
            }`}
          >
            {action === 'clarify' ? 'إرسال الطلب' : 'تأكيد الرفض'}
          </button>
        </div>
      </Modal>
    </section>
  );
}
