import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { siWhatsapp, siInstagram } from 'simple-icons';

export function WhatsAppIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" className={className}>
      <path d={siWhatsapp.path} />
    </svg>
  );
}

export function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={siInstagram.path} />
    </svg>
  );
}

let locks = 0;
function lockScroll() {
  locks++;
  document.documentElement.style.overflow = 'hidden';
  return () => {
    locks--;
    if (!locks) document.documentElement.style.overflow = '';
  };
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: 'dialog' | 'drawer' | 'sheet';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/** Janela modal acessível: Esc fecha, foco entra no painel, rolagem da página trava. */
export function Modal({ open, onClose, title, children, footer, variant = 'dialog', size = 'md' }: ModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    requestAnimationFrame(() => panel.current?.focus());
    return () => {
      unlock();
      window.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' };
  const place =
    variant === 'drawer'
      ? 'justify-end items-stretch'
      : variant === 'sheet'
        ? 'items-end sm:items-center justify-center'
        : 'items-center justify-center p-4';
  const shape =
    variant === 'drawer'
      ? `anim-drawer h-full w-full ${widths[size]} sm:rounded-l-3xl`
      : variant === 'sheet'
        ? `anim-sheet w-full ${widths[size]} max-h-[92dvh] rounded-t-3xl sm:rounded-3xl sm:m-4`
        : `anim-sheet w-full ${widths[size]} max-h-[90dvh] rounded-3xl`;
  return createPortal(
    <div className={`fixed inset-0 z-[70] flex ${place}`} role="presentation">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex flex-col bg-surface text-fg shadow-2xl outline-none ${shape}`}
        style={{ paddingBottom: variant !== 'dialog' ? 'env(safe-area-inset-bottom, 0px)' : undefined, paddingTop: variant === 'drawer' ? 'env(safe-area-inset-top, 0px)' : undefined }}
      >
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <h2 className="min-w-0 flex-1 truncate font-display text-lg font-extrabold italic">{title}</h2>
          <button className="icon-btn -mr-2" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line px-5 py-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export function ConfirmDialog({
  open, title, message, confirmLabel, onConfirm, onClose, busy,
}: { open: boolean; title: string; message: ReactNode; confirmLabel: string; onConfirm: () => void; onClose: () => void; busy?: boolean }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-[15px] text-muted">{message}</div>
    </Modal>
  );
}

export function SectionHead({ eyebrow, title, action }: { eyebrow?: string; title: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        {eyebrow && <p className="tagline mb-1 text-[13px] text-brand-text">{eyebrow}</p>}
        <h2 className="display text-[clamp(1.6rem,3.6vw,2.4rem)]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
