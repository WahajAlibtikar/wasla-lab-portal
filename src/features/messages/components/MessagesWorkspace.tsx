import {
  ArrowLeft,
  File,
  LockKeyhole,
  Paperclip,
  Search,
  Send,
  Stethoscope,
} from 'lucide-react';
import { useState } from 'react';
import { Toast } from '../../../components/shared/Toast';
import { useConversations } from '../hooks/use-conversations';
import type { Conversation } from '../types/message.types';

function ConversationList({
  conversations,
  selectedId,
  query,
  onQueryChange,
  onSelect,
}: {
  conversations: Conversation[];
  selectedId: string;
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="flex min-h-[650px] flex-col overflow-hidden rounded-[22px] border border-line bg-white shadow-tactile">
      <div className="border-b border-line p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-ink">المحادثات</h2>
            <p className="mt-1 text-xs text-muted">مرتبطة بالحالات وملفاتها.</p>
          </div>
          <span className="western-digits rounded-full bg-brand-tint px-2.5 py-1 text-xs font-bold text-brand">
            {conversations.length}
          </span>
        </div>
        <label className="mt-4 flex h-12 items-center gap-2 rounded-xl border border-line bg-canvas px-3 focus-within:border-brand focus-within:bg-white">
          <Search size={18} className="text-muted" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="ابحث في المحادثات"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>
      </div>
      <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto p-3">
        {conversations.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`w-full rounded-2xl border p-4 text-right transition ${item.id === selectedId ? 'border-brand bg-brand-tint/70' : 'border-line hover:bg-canvas'}`}
          >
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-medical-tint text-xs font-extrabold text-medical">
                {item.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-extrabold text-ink">
                    {item.doctor}
                  </p>
                  <span className="western-digits mr-auto text-[10px] text-muted">
                    {item.lastTime}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-muted">
                  {item.clinic} ·{' '}
                  <span className="western-digits">{item.caseId}</span>
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <p className="truncate text-xs text-ink">
                    {item.lastMessage}
                  </p>
                  {item.unread ? (
                    <span className="western-digits mr-auto grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                      {item.unread}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export function MessagesWorkspace() {
  const {
    filtered,
    selected,
    selectedId,
    query,
    setQuery,
    selectConversation,
    sendMessage,
  } = useConversations();
  const [composer, setComposer] = useState('');
  const [internal, setInternal] = useState(false);
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const submit = () => {
    if (!composer.trim()) return;
    sendMessage(composer, internal);
    setComposer('');
    setNotice(
      internal ? 'تمت إضافة الملاحظة الداخلية.' : 'تم إرسال الرسالة للطبيب.',
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-ink">محادثات الحالات</h2>
        <p className="mt-1 text-sm text-muted">
          تواصل واضح مع الطبيب دون فصل الرسائل عن رقم الحالة.
        </p>
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(300px,.72fr)_minmax(0,1.4fr)]">
        <div className={mobileThreadOpen ? 'hidden lg:block' : 'block'}>
          <ConversationList
            conversations={filtered}
            selectedId={selectedId}
            query={query}
            onQueryChange={setQuery}
            onSelect={(id) => {
              selectConversation(id);
              setMobileThreadOpen(true);
            }}
          />
        </div>
        <section
          className={`${mobileThreadOpen ? 'flex' : 'hidden lg:flex'} min-h-[650px] min-w-0 flex-col overflow-hidden rounded-[22px] border border-line bg-white shadow-tactile`}
        >
          <header className="flex items-start gap-3 border-b border-line bg-canvas/70 p-4 sm:p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-medical-tint text-xs font-extrabold text-medical">
              {selected.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-extrabold text-ink">
                  {selected.doctor}
                </h3>
                <span className="western-digits rounded-full bg-brand-tint px-2 py-1 text-[10px] font-bold text-brand">
                  {selected.caseId}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-muted">
                {selected.clinic} · {selected.service}
              </p>
              <p className="mt-1 text-[11px] font-bold text-warning">
                {selected.status}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileThreadOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-muted lg:hidden"
              aria-label="العودة إلى المحادثات"
            >
              <ArrowLeft size={19} />
            </button>
          </header>
          <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto bg-canvas/30 p-4 sm:p-5">
            {selected.messages.map((message) => (
              <div
                key={message.id}
                className={`${message.sender === 'lab' ? 'mr-auto' : ''} ${message.sender === 'internal' ? 'mx-auto max-w-[92%]' : 'max-w-[88%]'}`}
              >
                <article
                  className={`rounded-2xl px-4 py-3 ${message.sender === 'internal' ? 'border border-warning/25 bg-warning-tint' : message.sender === 'lab' ? 'rounded-bl-md bg-medical-tint' : 'rounded-br-md border border-line bg-white'}`}
                >
                  {message.sender === 'internal' ? (
                    <p className="mb-2 flex items-center gap-1.5 text-[10px] font-extrabold text-warning">
                      <LockKeyhole size={12} /> ملاحظة داخلية — لا يراها الطبيب
                    </p>
                  ) : null}
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[11px] font-extrabold text-ink">
                      {message.author}
                    </span>
                    <span className="western-digits text-[10px] text-muted">
                      {message.time}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-7 text-ink">
                    {message.body}
                  </p>
                  {message.attachments ? (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {message.attachments.map((attachment) => (
                        <button
                          type="button"
                          key={attachment.name}
                          onClick={() =>
                            setNotice(
                              `معاينة ${attachment.name} تجريبية في هذا الـMVP.`,
                            )
                          }
                          className="flex min-w-0 items-center gap-2 rounded-xl border border-line bg-white p-2 text-right"
                        >
                          <File size={16} className="shrink-0 text-medical" />
                          <span className="min-w-0">
                            <b className="western-digits block truncate text-[10px] text-ink">
                              {attachment.name}
                            </b>
                            <span className="western-digits text-[9px] text-muted">
                              {attachment.size}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </article>
              </div>
            ))}
          </div>
          <footer className="border-t border-line p-4">
            <button
              type="button"
              onClick={() => setInternal((current) => !current)}
              className={`mb-3 inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[11px] font-bold ${internal ? 'bg-warning-tint text-warning ring-1 ring-warning/25' : 'bg-canvas text-muted'}`}
            >
              <LockKeyhole size={13} />{' '}
              {internal ? 'ملاحظة داخلية مفعّلة' : 'إضافة ملاحظة داخلية'}
            </button>
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setNotice('رفع الملفات تجريبي في نسخة الـMVP.')}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line text-muted"
                aria-label="إرفاق ملف"
              >
                <Paperclip size={19} />
              </button>
              <textarea
                rows={2}
                value={composer}
                onChange={(event) => setComposer(event.target.value)}
                placeholder={
                  internal
                    ? 'اكتب ملاحظة لفريق المعمل فقط...'
                    : 'اكتب رسالة واضحة للطبيب...'
                }
                className="min-h-12 min-w-0 flex-1 resize-none rounded-xl border border-line px-3 py-2 text-sm leading-7 outline-none focus:border-brand"
              />
              <button
                type="button"
                onClick={submit}
                disabled={!composer.trim()}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand text-white transition disabled:opacity-40"
                aria-label="إرسال"
              >
                <Send size={19} />
              </button>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-[10px] text-muted">
              <Stethoscope size={12} /> الرسائل الخارجية تُحفظ ضمن سجل الحالة.
            </p>
          </footer>
        </section>
      </div>
      {notice ? <Toast message={notice} onClose={() => setNotice('')} /> : null}
    </div>
  );
}
