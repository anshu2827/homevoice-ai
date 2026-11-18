import { Check, X } from 'lucide-react';

export default function ConfirmationToast({ message, tone = 'success', onDismiss }) {
  return (
    <div className={`toast toast-${tone}`} role="status" aria-live="polite">
      <span className="toast-icon"><Check size={16} strokeWidth={2.5} /></span>
      <span>{message}</span>
      <button className="toast-close" type="button" aria-label="Dismiss notification" onClick={onDismiss}>
        <X size={15} />
      </button>
    </div>
  );
}
