import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { ToastContext } from "./toastContext";
import Button from "./Button";

const AUTO_DISMISS_MS = 3500;

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    wrapper: "border-green-200 bg-white",
    accent: "bg-green-500",
    iconColor: "text-green-600",
  },
  error: {
    icon: AlertCircle,
    wrapper: "border-red-200 bg-white",
    accent: "bg-red-500",
    iconColor: "text-red-600",
  },
  info: {
    icon: Info,
    wrapper: "border-blue-200 bg-white",
    accent: "bg-blue-500",
    iconColor: "text-blue-600",
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

    const timer = timersRef.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message, type = "info") => {
      if (!message) {
        return;
      }

      idRef.current += 1;
      const id = idRef.current;

      setToasts((prev) => [...prev, { id, message, type }]);

      timersRef.current.set(
        id,
        setTimeout(() => dismiss(id), AUTO_DISMISS_MS),
      );

      return id;
    },
    [dismiss],
  );

  // Clear any pending timers if the provider unmounts
  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      dismiss,
      success: (message) => showToast(message, "success"),
      error: (message) => showToast(message, "error"),
      info: (message) => showToast(message, "info"),
    }),
    [showToast, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const variant = VARIANTS[toast.type] || VARIANTS.info;
          const Icon = variant.icon;

          return (
            <div
              key={toast.id}
              role="status"
              aria-live="polite"
              className={`animate-toast-in pointer-events-auto flex items-start gap-3 overflow-hidden rounded-xl border py-3 pr-3 shadow-lg shadow-slate-900/10 ${variant.wrapper}`}
            >
              <span className={`-my-3 w-1 self-stretch ${variant.accent}`} />

              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${variant.iconColor}`} />

              <p className="flex-1 text-sm font-medium text-slate-800">
                {toast.message}
              </p>

              <Button
                variant="ghostSlate"
                size="iconSm"
                aria-label="Dismiss notification"
                onClick={() => dismiss(toast.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
