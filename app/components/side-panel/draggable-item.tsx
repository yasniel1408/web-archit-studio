"use client";

import React from 'react';

interface DraggableItemProps {
  id: string;
  type: string;
}

export function DraggableItem({ id, type }: DraggableItemProps) {
  const handleDragStart = (e: React.DragEvent) => {
    // Pasamos el id y tipo del componente como datos para el arrastre
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ id, type }));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="bg-slate-700 p-3 rounded cursor-grab hover:bg-slate-600 transition-colors"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded" />
        <span>Cuadrado blanco</span>
      </div>
    </div>
  );
}
