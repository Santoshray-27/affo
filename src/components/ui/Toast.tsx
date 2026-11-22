import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  undoAction?: () => void;
  undoLabel?: string;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  success: (title: string, message?: string, options?: Partial<ToastItem>) => string;
  error: (title: string, message?: string, options?: Partial<ToastItem>) => string;
  info: (title: string, message?: string, options?: Partial<ToastItem>) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 4000, undoAction, undoLabel = 'Undo' }: Omit<ToastItem, 'id'>) => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration, undoAction, undoLabel };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss]
  );

  const success = useCallback(
    (title: string, message?: string, options?: Partial<ToastItem>) =>
      showToast({ type: 'success', title, message, ...options }),
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string, options?: Partial<ToastItem>) =>
      showToast({ type: 'error', title, message, ...options }),
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string, options?: Partial<ToastItem>) =>
      showToast({ type: 'info', title, message, ...options }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, dismiss }}>
      {children}
      {/* Toast viewport */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto bg-surface border border-border shadow-floating rounded-2xl p-4 flex items-start gap-3 text-app-text"
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-success" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-brand-red" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-primary" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm leading-tight text-app-text">{toast.title}</div>
                {toast.message && (
                  <div className="text-xs text-muted mt-0.5 leading-relaxed">{toast.message}</div>
                )}
                {toast.undoAction && (
                  <button
                    onClick={() => {
                      toast.undoAction?.();
                      dismiss(toast.id);
                    }}
                    className="mt-2 text-xs font-semibold text-brand-red hover:underline block"
                  >
                    {toast.undoLabel}
                  </button>
                )}
              </div>

              <button
                onClick={() => dismiss(toast.id)}
                className="shrink-0 text-muted hover:text-app-text p-1 rounded-full hover:bg-mint/40 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

