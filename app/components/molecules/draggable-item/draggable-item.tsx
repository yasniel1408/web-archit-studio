"use client";

import React from 'react';
import { DragWrapper } from '@/app/components/atoms/drag-wrapper/drag-wrapper';
import { Square } from '@/app/components/atoms/square/square';

interface DraggableItemProps {
  id: string;
  type: string;
  label?: string;
  text?: string;
}

export function DraggableItem({ 
  id, 
  type, 
  label = "Componente", 
  text = ""
}: DraggableItemProps) {
  return (
    <DragWrapper id={id} type={type} text={text}>
      <div className="bg-slate-700 p-3 rounded hover:bg-slate-600 transition-colors cursor-grab">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex-shrink-0">
            <Square text={label} />
          </div>
          <span className="truncate">{label}</span>
        </div>
      </div>
    </DragWrapper>
  );
}
