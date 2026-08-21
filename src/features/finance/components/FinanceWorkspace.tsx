import { Download, Filter, Mail, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MetricGrid } from '../../../components/shared/MetricGrid';
import { Toast } from '../../../components/shared/Toast';
import { financeMetrics, invoices } from '../data/mock-finance';
import type { Invoice, InvoiceStatus } from '../types/finance.types';

const statusLabels: Record<InvoiceStatus, { label: string; classes: string }> =
  {
    paid: { label: 'مكتملة', classes: 'bg-success-tint text-success' },
    balance_due: {
      label: 'متبقي دفعة',
      classes: 'bg-warning-tint text-warning',
    },
    overdue: { label: 'متأخرة', classes: 'bg-danger-tint text-danger' },
  };
const money = (value: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);

function InvoiceSummary({
  invoice,
  onNotify,
}: {
  invoice: Invoice;
  onNotify: (message: string) => void;
}) {
  const total = invoice.subtotal + invoice.tax;
  const balance = total - invoice.paid;
  return (
    <aside className="rounded-[22px] border border-line bg-white p-5 shadow-tactile">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="western-digits text-xl font-extrabold text-ink">
            {invoice.id}
          </span>
          <p className="western-digits mt-1 text-xs text-muted">
            حالة {invoice.caseId}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusLabels[invoice.status].classes}`}
        >
          {statusLabels[invoice.status].label}
        </span>
      </div>
      <div className="mt-5 rounded-2xl bg-canvas p-4">
        <p className="text-xs font-bold text-muted">العيادة والطبيب</p>
        <p className="mt-2 text-sm font-extrabold text-ink">{invoice.clinic}</p>
        <p className="mt-1 text-xs text-muted">{invoice.doctor}</p>
      </div>
      <dl className="mt-5 space-y-3 text-xs">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">الخدمة</dt>
          <dd className="max-w-[60%] text-left font-bold text-ink">
            {invoice.service}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">السعر قبل الضريبة</dt>
          <dd className="western-digits font-bold text-ink">
            {money(invoice.subtotal)} ر.س
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">ضريبة القيمة المضافة 15%</dt>
          <dd className="western-digits font-bold text-ink">
            {money(invoice.tax)} ر.س
          </dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3">
          <dt className="font-extrabold text-ink">الإجمالي</dt>
          <dd className="western-digits font-extrabold text-brand">
            {money(total)} ر.س
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-success">المدفوع</dt>
          <dd className="western-digits font-bold text-success">
            {money(invoice.paid)} ر.س
          </dd>
        </div>
        <div className="flex justify-between rounded-xl bg-warning-tint p-3">
          <dt className="font-extrabold text-warning">المتبقي</dt>
          <dd className="western-digits font-extrabold text-warning">
            {money(balance)} ر.س
          </dd>
        </div>
      </dl>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onNotify(`تم تجهيز ${invoice.id} للتنزيل التجريبي.`)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line text-xs font-bold text-muted hover:bg-canvas"
        >
          <Download size={16} /> تنزيل PDF
        </button>
        <button
          type="button"
          onClick={() => onNotify('تم إرسال تذكير دفع تجريبي للطبيب.')}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand text-xs font-bold text-white hover:bg-brand-pressed"
        >
          <Mail size={16} /> إرسال تذكير
        </button>
      </div>
    </aside>
  );
}

export function FinanceWorkspace() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | InvoiceStatus>('all');
  const [selectedId, setSelectedId] = useState(invoices[0].id);
  const [notice, setNotice] = useState('');
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('ar');
    return invoices.filter(
      (invoice) =>
        (status === 'all' || invoice.status === status) &&
        (!normalized ||
          [invoice.id, invoice.caseId, invoice.clinic, invoice.doctor]
            .join(' ')
            .toLocaleLowerCase('ar')
            .includes(normalized)),
    );
  }, [query, status]);
  const selected =
    invoices.find((invoice) => invoice.id === selectedId) ?? invoices[0];
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-ink">
            المالية والفواتير
          </h2>
          <p className="mt-1 text-sm text-muted">
            إدارة المستحقات والمبالغ المحصلة من العيادات.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setNotice('تم تجهيز تقرير أغسطس 2026 للتنزيل التجريبي.')
          }
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-bold text-muted"
        >
          <Download size={17} /> تصدير التقرير
        </button>
      </div>
      <MetricGrid items={financeMetrics} />
      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,.72fr)]">
        <div className="overflow-hidden rounded-[22px] border border-line bg-white shadow-tactile">
          <div className="flex flex-col gap-3 border-b border-line p-4 md:flex-row">
            <label className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-canvas px-3 focus-within:border-brand">
              <Search size={17} className="text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="رقم الفاتورة، الحالة أو العيادة"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </label>
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-line px-3">
              <Filter size={16} className="text-muted" />
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as 'all' | InvoiceStatus)
                }
                className="bg-transparent text-sm font-bold outline-none"
              >
                <option value="all">كل الحالات</option>
                <option value="paid">مكتملة</option>
                <option value="balance_due">متبقي دفعة</option>
                <option value="overdue">متأخرة</option>
              </select>
            </label>
          </div>
          <div className="scrollbar-thin overflow-x-auto">
            <table className="min-w-[760px] w-full text-right">
              <thead className="bg-canvas text-[11px] font-bold text-muted">
                <tr>
                  <th className="px-4 py-3">الفاتورة / الحالة</th>
                  <th className="px-4 py-3">العيادة والطبيب</th>
                  <th className="px-4 py-3">الإجمالي</th>
                  <th className="px-4 py-3">المتبقي</th>
                  <th className="px-4 py-3">الاستحقاق</th>
                  <th className="px-4 py-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((invoice) => {
                  const total = invoice.subtotal + invoice.tax;
                  const balance = total - invoice.paid;
                  return (
                    <tr
                      key={invoice.id}
                      className={`text-xs transition hover:bg-canvas ${invoice.id === selectedId ? 'bg-brand-tint/40' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedId(invoice.id)}
                          className="rounded-lg text-right focus-visible:outline-brand"
                          aria-label={`عرض الفاتورة ${invoice.id}`}
                        >
                          <b className="western-digits block text-ink">
                            {invoice.id}
                          </b>
                          <span className="western-digits mt-1 block text-[10px] text-muted">
                            {invoice.caseId}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <b className="block text-ink">{invoice.clinic}</b>
                        <span className="mt-1 block text-[10px] text-muted">
                          {invoice.doctor}
                        </span>
                      </td>
                      <td className="western-digits px-4 py-4 font-bold text-ink">
                        {money(total)} ر.س
                      </td>
                      <td
                        className={`western-digits px-4 py-4 font-extrabold ${balance > 0 ? 'text-warning' : 'text-success'}`}
                      >
                        {money(balance)} ر.س
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {invoice.dueDate}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusLabels[invoice.status].classes}`}
                        >
                          {statusLabels[invoice.status].label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <InvoiceSummary invoice={selected} onNotify={setNotice} />
      </section>
      {notice ? <Toast message={notice} onClose={() => setNotice('')} /> : null}
    </div>
  );
}
