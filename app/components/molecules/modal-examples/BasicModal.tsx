import React, { useRef, useState } from "react";

import { Modal, ModalRef } from "@/app/components/atoms/modal";

export const BasicModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<ModalRef>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={openModal}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Abrir Modal Básico
      </button>

      <Modal ref={modalRef} isOpen={isOpen} onClose={closeModal} title="Modal Básico">
        <div className="flex flex-col gap-4">
          <p>Este es un modal básico con un título y contenido simple.</p>
          <p>
            Puedes cerrar este modal haciendo clic en el botón de cerrar, presionando ESC o haciendo
            clic fuera del modal.
          </p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
