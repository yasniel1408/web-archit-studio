"use client";

import React, { useState, useRef } from 'react';
import { CanvasNode } from '@/app/components/molecules/canvas-node/canvas-node';

type NodeType = {
  id: string;
  type: string;
  position: { x: number; y: number };
  text?: string;
};

export function DiagramCanvas() {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const data = e.dataTransfer.getData('application/reactflow');
    if (!data) return;

    try {
      const { id, type } = JSON.parse(data);
      
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      // Calcular posición relativa al canvas
      const position = {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      };

      // Generar ID único agregando timestamp
      const uniqueId = `${id}-${Date.now()}`;

      // Determinar si tiene texto
      const hasText = id.includes('text');

      // Agregar el nuevo nodo al canvas
      setNodes(prevNodes => [
        ...prevNodes,
        { 
          id: uniqueId, 
          type, 
          position,
          text: hasText ? "Texto editable" : ""
        }
      ]);
    } catch (error) {
      console.error('Error al procesar datos de arrastre:', error);
    }
  };

  return (
    <div 
      ref={canvasRef}
      className="flex-1 bg-slate-100 relative overflow-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {nodes.map(node => (
        <CanvasNode 
          key={node.id} 
          id={node.id} 
          type={node.type} 
          position={node.position}
          text={node.text}
        />
      ))}
    </div>
  );
}
