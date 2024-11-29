import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/shadcnDialog.tsx";
import { useEffect, useRef, MutableRefObject } from "react";
import { IModalProps } from "types/APIResponseTypes";
import { Button } from "../ui/button";

const Modal: React.FC<IModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}) => {
  // Using `useRef` to keep track of the `div` we create for the modal. It will only create this element once and it ensures we get the same `div` an every re-render
  const modalRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  // Ensure the Escape key closes the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="fixed inset-0 bg-black/60 opacity-100" />
      <DialogContent
        ref={modalRef}
        className="fixed left-1/2 top-1/2 z-50 max-w-lg -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white p-6 opacity-100 shadow-lg"
        id="modal-content"
      >
        {title && (
          <DialogTitle id="modal-title" className="text-lg font-bold">
            {title}
          </DialogTitle>
        )}
        {description && (
          <DialogDescription
            id="modal-description"
            className="text-sm text-muted-foreground"
          >
            {description}
          </DialogDescription>
        )}
        <div>{children}</div>
        <Button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-2 text-muted-foreground hover:bg-muted-foreground/20"
          aria-label="Close"
        >
          x
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
