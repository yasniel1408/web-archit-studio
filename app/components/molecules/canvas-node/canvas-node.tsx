"use client";

import React, { useState, useRef } from 'react';
import { Square } from '@/app/components/atoms/square/square';

interface CanvasNodeProps {
  id: string;
  type: string;
  position: { x: number; y: number };
  text?: string;
}

// Tipo para las manijas de redimensionamiento
type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export function CanvasNode({ 
  id, 
  type, 
  position, 
  text = "" 
}: CanvasNodeProps) {
  const [pos, setPos] = useState(position);
  const [size, setSize] = useState({ width: 120, height: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeHandle | null>(null);
  
  const nodeRef = useRef<HTMLDivElement>(null);
  
  // Manejar el desplazamiento del nodo
  const handleMouseDown = (e: React.MouseEvent) => {
    // Evitar que se active el arrastre cuando se está editando texto o usando una manija de redimensionamiento
    if ((e.target as HTMLElement).tagName === 'INPUT' || 
        (e.target as HTMLElement).classList.contains('resize-handle')) {
      return;
    }
    
    setIsDragging(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = pos.x;
    const startPosY = pos.y;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      setPos({
        x: startPosX + (moveEvent.clientX - startX),
        y: startPosY + (moveEvent.clientY - startY)
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Manejar el redimensionamiento con las manijas
  const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    setIsResizing(handle);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startPosX = pos.x;
    const startPosY = pos.y;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;
      
      // Ajustar tamaño y posición según la manija que se está usando
      switch (handle) {
        case 'top-left':
          newWidth = Math.max(30, startWidth - deltaX);
          newHeight = Math.max(30, startHeight - deltaY);
          newX = startPosX + (startWidth - newWidth);
          newY = startPosY + (startHeight - newHeight);
          break;
        case 'top-right':
          newWidth = Math.max(30, startWidth + deltaX);
          newHeight = Math.max(30, startHeight - deltaY);
          newY = startPosY + (startHeight - newHeight);
          break;
        case 'bottom-left':
          newWidth = Math.max(30, startWidth - deltaX);
          newHeight = Math.max(30, startHeight + deltaY);
          newX = startPosX + (startWidth - newWidth);
          break;
        case 'bottom-right':
          newWidth = Math.max(30, startWidth + deltaX);
          newHeight = Math.max(30, startHeight + deltaY);
          break;
      }
      
      setSize({ width: newWidth, height: newHeight });
      setPos({ x: newX, y: newY });
    };
    
    const handleMouseUp = () => {
      setIsResizing(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const renderNode = () => {
    switch (type) {
      case 'square':
        return (
          <div className="w-full h-full">
            <Square editable={true} initialText={text} />
          </div>
        );
      default:
        return (
          <div className="w-full h-full">
            <Square editable={true} initialText={text} />
          </div>
        );
    }
  };

  return (
    <div
      ref={nodeRef}
      className={`absolute ${isDragging || isResizing ? 'z-10' : 'z-0'}`}
      style={{ 
        left: `${pos.x}px`, 
        top: `${pos.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      {renderNode()}
      
      {/* Manijas de redimensionamiento en las esquinas */}
      <div 
        className="resize-handle top-left absolute w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize -translate-x-1/2 -translate-y-1/2 z-20"
        style={{ top: 0, left: 0 }}
        onMouseDown={(e) => handleResizeStart(e, 'top-left')}
      />
      <div 
        className="resize-handle top-right absolute w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize translate-x-1/2 -translate-y-1/2 z-20"
        style={{ top: 0, right: 0 }}
        onMouseDown={(e) => handleResizeStart(e, 'top-right')}
      />
      <div 
        className="resize-handle bottom-left absolute w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize -translate-x-1/2 translate-y-1/2 z-20"
        style={{ bottom: 0, left: 0 }}
        onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
      />
      <div 
        className="resize-handle bottom-right absolute w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize translate-x-1/2 translate-y-1/2 z-20"
        style={{ bottom: 0, right: 0 }}
        onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
      />
    </div>
  );
}
