import { ReactNode } from "react";

export type ModalSize = "small" | "medium" | "large" | "fullscreen";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  overlayClassName?: string;
  showCloseButton?: boolean;
  className?: string;
}

export interface ModalRef {
  close: () => void;
  open?: () => void;
}

export interface UseModalProps {
  onClose?: () => void;
  closeOnOverlayClick: boolean;
  isOpen: boolean;
}

export interface UseModalReturn {
  modalRef: React.RefObject<HTMLDivElement>;
  getModalSizeClasses: (size: ModalSize) => string;
  handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}
