import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  tone: 'ok' | 'error';
  action?: { label: string; run: () => void };
}
type Push = (message: string, opts?: { tone?: Toast['tone']; action?: Toast['action']; ms?: number }) => void;

const Ctx = createContext<Push>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const seq = useRef(0);
  const dismiss = useCallback((id: number) => setItems((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback<Push>(
    (message, opts = {}) => {
      const id = ++seq.current;
      setItems((t) => [...t.slice(-2), { id, message, tone: opts.tone ?? 'ok', action: opts.action }]);
      setTimeout(() => dismiss(id), opts.ms ?? (opts.action ? 7000 : 3500));
    },
    [dismiss],
  );
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className="toast">
            {t.tone === 'ok' ? <CheckCircle2 size={18} className="text-brand shrink-0" /> : <AlertTriangle size={18} className="text-danger shrink-0" />}
            <span className="min-w-0 flex-1">{t.message}</span>
            {t.action && (
              <button
                className="font-bold text-brand hover:underline"
                onClick={() => {
                  t.action!.run();
                  dismiss(t.id);
                }}
              >
                {t.action.label}
              </button>
            )}
            <button aria-label="Fechar aviso" className="opacity-60 hover:opacity-100" onClick={() => dismiss(t.id)}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
