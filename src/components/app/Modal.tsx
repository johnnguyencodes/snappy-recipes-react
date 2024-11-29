import { useEffect, useRef, MutableRefObject, ReactElement } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  children: ReactElement;
  onClose?: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
  // Using `useRef` to keep track of the `div` we create for the modal. It will only create this element once and it ensures we get the same `div` an every re-render
  const modalRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  // Instead of calling `document.createElement("div")` on every render, you can check if the `elRef.current` already exists.
  // If it does, you reuse the same DOM element. If it doesn’t, you create it once and assign it to `elRef.current`.
  // This ensures that the `div` is only created the first time it’s needed and not on every render.
  if (!modalRef.current) {
    modalRef.current = document.createElement("div");
  }

  useEffect(() => {
    const modalRoot = document.getElementById("modal");
    if (!modalRoot || !modalRef.current) {
      console.warn("Modal root element is not found.");
      return;
    }
    modalRoot.appendChild(modalRef.current);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (modalRef.current) {
        modalRoot.removeChild(modalRef.current);
      }
    };
  }, [onClose]);

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement as HTMLElement;
    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, []);

  return createPortal(
    <div
      className="modal-container"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      tabIndex={-1}
    >
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    modalRef.current
  );
};

export default Modal;
