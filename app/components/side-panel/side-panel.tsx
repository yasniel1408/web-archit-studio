"use client";

import React from 'react';
import {DraggableItem} from "@/app/components/molecules/draggable-item/draggable-item";

export function SidePanel() {
  return (
    <div className="w-64 bg-slate-800 text-white p-4 border-r border-slate-700 overflow-y-auto">
      <h2 className="text-lg font-medium mb-4">Componentes</h2>
      <div className="space-y-3">
        <DraggableItem id="square-component" type="square" />
      </div>
    </div>
  );
}
