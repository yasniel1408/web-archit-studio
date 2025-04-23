import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { ModalProps, ModalRef } from './types';
import { ANIMATION_DURATION } from './constants';
import { useModal } from './hooks/useModal';

/**
 * Componente Modal reutilizable con diferentes tamaños y animación
 */
export const Modal = forwardRef<ModalRef, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      size = 'medium',
      closeOnOverlayClick = true,
      overlayClassName = '',
      showCloseButton = true,
      className = '',
    },
    ref,
  ) => {
    const { 
      modalRef, 
      getModalSizeClasses, 
      handleOverlayClick, 
      handleKeyDown 
    } = useModal({
      onClose,
      closeOnOverlayClick,
      isOpen,
    });

    useImperativeHandle(ref, () => ({
      close: () => onClose(),
      open: () => {}, // Este método está en la interfaz pero no lo implementamos aquí
    }));

    // Solo renderizamos en el cliente
    if (typeof window === 'undefined') return null;

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayClassName}`}
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
            role="presentation"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: ANIMATION_DURATION / 1000 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: ANIMATION_DURATION / 1000 }}
              className={`relative z-10 flex flex-col rounded-lg bg-white shadow-xl ${getModalSizeClasses(size)} ${className}`}
            >
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  {title && <h3 className="text-lg font-medium">{title}</h3>}
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={() => onClose()}
                      className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Cerrar"
                    >
                      <FiX size={20} />
                    </button>
                  )}
                </div>
              )}
              <div className="flex-1 overflow-auto p-6">{children}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body,
    );
  },
);

Modal.displayName = 'Modal'; 