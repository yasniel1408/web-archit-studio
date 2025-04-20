"use client";

import React, { useState } from 'react';
import { DraggableItem } from '@/app/components/molecules/draggable-item/draggable-item';

export function SidePanel() {
  const [activeTab, setActiveTab] = useState<'components' | 'templates'>('components');

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Pestañas de navegación */}
      <div className="flex border-b border-border/20">
        <button 
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'components' ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50 text-gray-600'}`}
          onClick={() => setActiveTab('components')}
        >
          Componentes
        </button>
        <button 
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'templates' ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50 text-gray-600'}`}
          onClick={() => setActiveTab('templates')}
        >
          Plantillas
        </button>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="p-4 flex-1 overflow-y-auto">
        {activeTab === 'components' ? (
          <div className="space-y-4">
            <h3 className="text-sm uppercase font-medium text-gray-500 mb-2">Componentes</h3>
            <div className="space-y-2">
              <DraggableItem 
                id="test-square" 
                type="square" 
                label="Cuadrado" 
                text=""
              />
            </div>
            
            <div className="mt-8 p-3 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">
              <h3 className="font-medium text-center mb-2">Instrucciones</h3>
              <p className="text-xs">
                1. Arrastra elementos desde aquí al lienzo<br/>
                2. Haz clic en el elemento para seleccionarlo<br/>
                3. Usa el botón X para eliminar elementos
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-center p-4 text-gray-500">
            <p>Plantillas en desarrollo</p>
            <div className="text-xs mt-4 p-3 bg-gray-50 rounded-lg">
              Las plantillas te permitirán crear diagramas predefinidos como arquitecturas de microservicios, patrones de diseño, etc.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
