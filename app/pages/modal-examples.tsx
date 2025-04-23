import React from 'react';
import { BasicModal, CustomSizeModal } from '@/app/components/molecules/modal-examples';

export default function ModalExamplesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Ejemplos de Modales</h1>
      
      <div className="mb-12 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Modal Básico</h2>
        <p className="mb-4 text-gray-600">
          Un ejemplo simple de un modal con título y contenido básico.
        </p>
        <BasicModal />
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Modal con Diferentes Tamaños</h2>
        <p className="mb-4 text-gray-600">
          Ejemplo de modal con opciones para cambiar su tamaño.
        </p>
        <CustomSizeModal />
      </div>
    </div>
  );
} 