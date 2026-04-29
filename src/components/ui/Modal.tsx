import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel?: string;
}

export default function Modal({ open, onClose, children, ariaLabel }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      aria-modal="true"
      role="dialog"
      aria-label={ariaLabel || "Modal dialog"}
      tabIndex={-1}
      onClick={onClose}
      data-testid="modal-overlay"
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-full relative max-sm:w-full"
        onClick={e => e.stopPropagation()}
        data-testid="modal-content"
      >
        <button
          className="cursor-pointer absolute top-5 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
          data-testid="modal-close"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
