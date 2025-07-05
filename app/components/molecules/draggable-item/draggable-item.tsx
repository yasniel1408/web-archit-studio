"use client";

import React from "react";

import { DragWrapper } from "@/app/components/atoms/drag-wrapper/drag-wrapper";
import { Square } from "@/app/components/atoms/square/square";

interface DraggableItemProps {
  id: string;
  type: string;
  label?: string;
  text?: string;
}

export function DraggableItem({ id, type, label = "Componente", text = "" }: DraggableItemProps) {
  return (
    <DragWrapper id={id} type={type} text={text}>
      <div className="group cursor-grab rounded border-2 border-transparent bg-slate-700 p-3 transition-colors hover:border-blue-400 hover:bg-slate-600">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 flex-shrink-0">
            <Square text={label} />
          </div>
          <div className="flex-1">
            <span className="truncate text-white">{label}</span>
            <div className="text-xs text-gray-400 group-hover:text-blue-300">
              🎯 Arrastra al lienzo
            </div>
          </div>
        </div>
      </div>
    </DragWrapper>
  );
}
