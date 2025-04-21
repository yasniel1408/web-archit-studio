"use client";

import React from 'react';
import { DraggableItem } from "@/app/components/molecules/draggable-item/draggable-item";

export function SidePanel() {
  const elementTypes = [
    { id: 'square', type: 'square', label: 'Cuadrado' },
    { id: 'database', type: 'square icon:database', label: 'Base de datos' },
    { id: 'cloud', type: 'square icon:cloud', label: 'Nube' },
    { id: 'api', type: 'square icon:api', label: 'API' },
    { id: 'service', type: 'square icon:service', label: 'Servicio' },
    { id: 'user', type: 'square icon:user', label: 'Usuario' },
    { id: 'server', type: 'square icon:server', label: 'Servidor' },
    { id: 'network', type: 'square icon:network', label: 'Red' }
  ];

  return (
    <div className="w-64 bg-slate-800 text-white p-4 border-r border-slate-700 overflow-y-auto">
      <h2 className="text-lg font-medium mb-4">Componentes</h2>
      <div className="space-y-3">
        {elementTypes.map(element => (
          <DraggableItem 
            key={element.id}
            id={`${element.id}-component`} 
            type={element.type} 
            label={element.label}
          />
        ))}
      </div>
      <div className="mt-6 p-3 bg-slate-700 rounded text-xs text-indigo-300">
        Arrastra y suelta los componentes al lienzo para crear tu diagrama.
      </div>
    </div>
  );
}
