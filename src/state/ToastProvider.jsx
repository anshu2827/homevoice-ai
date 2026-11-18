import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import ConfirmationToast from '../components/ConfirmationToast.jsx';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone, key: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && <ConfirmationToast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} />}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
