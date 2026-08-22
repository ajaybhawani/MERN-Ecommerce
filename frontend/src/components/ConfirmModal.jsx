import { AlertTriangle } from "lucide-react";

import Button from "./Button";

const ConfirmModal = ({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onClose,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div
      className="animate-backdrop-in fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!loading) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="animate-modal-in w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-7 w-7 text-red-600" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">{title}</h2>

        {message && (
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            {message}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            variant="secondary"
            fullWidth
            disabled={loading}
            onClick={() => onClose?.()}
          >
            {cancelLabel}
          </Button>

          <Button
            variant="danger"
            fullWidth
            loading={loading}
            loadingText="Deleting..."
            onClick={() => onConfirm?.()}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
