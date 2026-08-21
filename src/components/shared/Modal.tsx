import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ open, title, description, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button className="absolute inset-0 cursor-default bg-ink/45" onClick={onClose} aria-label="إغلاق النافذة" />
      <section className="relative w-full max-w-lg rounded-[24px] border border-line bg-white p-6 shadow-floating">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="modal-title" className="text-xl font-extrabold text-ink">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm leading-7 text-muted">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-muted transition hover:bg-canvas hover:text-ink"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </section>
    </div>
  );
}
