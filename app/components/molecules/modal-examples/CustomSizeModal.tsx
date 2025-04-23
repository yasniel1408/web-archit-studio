import React, { useState } from 'react';
import { Modal, ModalSize } from '@/app/components/atoms/modal';

export const CustomSizeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState<ModalSize>('medium');

  const openModal = (selectedSize: ModalSize) => {
    setSize(selectedSize);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => openModal('small')}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Modal Pequeño
        </button>
        <button
          type="button"
          onClick={() => openModal('medium')}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Modal Mediano
        </button>
        <button
          type="button"
          onClick={() => openModal('large')}
          className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Modal Grande
        </button>
        <button
          type="button"
          onClick={() => openModal('fullscreen')}
          className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          Modal Pantalla Completa
        </button>
      </div>
      
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={`Modal de tamaño ${size}`}
        size={size}
      >
        <div className="flex flex-col gap-4">
          <p className="text-lg">Este modal tiene un tamaño configurado a: <strong>{size}</strong></p>
          <p>
            Puedes elegir entre diferentes tamaños para adaptarse a tus necesidades:
            small, medium, large y fullscreen.
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