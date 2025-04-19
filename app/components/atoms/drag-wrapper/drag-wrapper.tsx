"use client";

import React, { ReactNode } from 'react';

interface DragWrapperProps {
  id: string;
  type: string;
  children: ReactNode;
}

export function DragWrapper({ id, type, children }: DragWrapperProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ id, type }));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="cursor-grab"
      draggable
      onDragStart={handleDragStart}
    >
      {children}
    </div>
  );
}
