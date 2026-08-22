import { useEffect } from "react";
import { X } from "lucide-react";

import Button from "./Button";

const SIZES = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
};

const Modal = ({
  open,
  onClose,
  title,
  description,
  icon,
  size = "lg",
  children,
  closeOnBackdropClick = true,
}) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="animate-backdrop-in fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={() => {
        if (closeOnBackdropClick) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        onClick={(event) => event.stopPropagation()}
        className={`animate-modal-in my-auto w-full ${SIZES[size] || SIZES.lg} rounded-2xl bg-white shadow-2xl`}
      >
        <div className="flex items-start gap-4 border-b border-gray-100 px-6 py-5">
          {icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              {icon}
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>

            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Close dialog"
            onClick={() => onClose?.()}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
