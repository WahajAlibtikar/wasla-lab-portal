import { Box, Eye, FileImage, FileText } from 'lucide-react';
import { Modal } from '../../../components/shared/Modal';
import { useState } from 'react';
import type { OrderAttachment } from '../types/order.types';

const attachmentIcons = {
  stl: Box,
  image: FileImage,
  pdf: FileText,
};

export function AttachmentGrid({ attachments }: { attachments: OrderAttachment[] }) {
  const [preview, setPreview] = useState<OrderAttachment | null>(null);

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2">
        {attachments.map((attachment) => {
          const Icon = attachmentIcons[attachment.kind];
          return (
            <button
              key={attachment.id}
              type="button"
              onClick={() => setPreview(attachment)}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-line bg-canvas/70 p-3 text-right transition hover:border-brand/40 hover:bg-brand-tint/60"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-medical ring-1 ring-line">
                <Icon size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold text-ink">{attachment.label}</span>
                <span className="western-digits mt-0.5 block truncate text-[10px] text-muted">{attachment.name} · {attachment.size}</span>
              </span>
              <Eye size={16} className="shrink-0 text-muted transition group-hover:text-brand" />
            </button>
          );
        })}
      </div>

      <Modal
        open={Boolean(preview)}
        title={preview?.label ?? ''}
        description="معاينة تجريبية للمرفق داخل نموذج الواجهة."
        onClose={() => setPreview(null)}
      >
        <div className="grid min-h-60 place-items-center rounded-2xl border border-dashed border-line bg-canvas p-8 text-center">
          {preview ? (
            <div>
              {(() => {
                const Icon = attachmentIcons[preview.kind];
                return <Icon size={44} className="mx-auto text-medical" />;
              })()}
              <p className="mt-4 text-sm font-bold text-ink western-digits">{preview.name}</p>
              <p className="mt-1 text-xs text-muted western-digits">{preview.size}</p>
              <p className="mt-4 text-xs leading-6 text-muted">سيُربط عارض الملفات الحقيقي بخدمة التخزين في نسخة الباك اند.</p>
            </div>
          ) : null}
        </div>
      </Modal>
    </>
  );
}
