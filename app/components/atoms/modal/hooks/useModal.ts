import { useEffect, useRef } from "react";

import { ANIMATION_DURATION } from "../constants";
import { ModalSize, UseModalProps, UseModalReturn } from "../types";

/**
 * Hook personalizado para gestionar el estado de un modal
 * @returns {UseModalReturn} Funciones y estado para controlar el modal
 */
export const useModal = ({
  onClose,
  closeOnOverlayClick,
  isOpen,
}: UseModalProps): UseModalReturn => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    } else {
      // Esperar a que termine la animación antes de restaurar el scroll
      const timeout = setTimeout(() => {
        document.body.style.overflow = "";
      }, ANIMATION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isOpen && onClose) {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const getModalSizeClasses = (size: ModalSize): string => {
    switch (size) {
      case "small":
        return "w-full max-w-sm";
      case "medium":
        return "w-full max-w-md";
      case "large":
        return "w-full max-w-lg";
      case "fullscreen":
        return "w-full h-full m-4";
      default:
        return "w-full max-w-md";
    }
  };

  return {
    modalRef,
    getModalSizeClasses,
    handleOverlayClick,
    handleKeyDown,
  };
};
