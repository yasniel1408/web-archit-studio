"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Square } from '@/app/components/atoms/square/square';
import { ConnectionPoint, ConnectionPosition } from '@/app/components/atoms/connection-point/connection-point';

interface CanvasNodeProps {
  id: string;
  type: string;
  position: { x: number; y: number };
  text?: string;
  onConnectionStart: (nodeId: string, position: ConnectionPosition, x: number, y: number) => void;
  onConnectionEnd: (targetNodeId: string) => void;
  onNodeMove: (nodeId: string, position: { x: number, y: number }) => void;
  onNodeResize: (nodeId: string, size: { width: number, height: number }) => void;
  onDeleteNode?: (nodeId: string) => void;
  disabled?: boolean;
}

type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export function CanvasNode({ 
  id, 
  type, 
  position, 
  text = "",
  onConnectionStart,
  onConnectionEnd,
  onNodeMove,
  onNodeResize,
  onDeleteNode,
  disabled = false
}: CanvasNodeProps) {
  const [pos, setPos] = useState(position);
  const [size, setSize] = useState({ width: 120, height: 120 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeHandle | null>(null);
  
  const nodeRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const resizeStartRef = useRef<{ handle: ResizeHandle; x: number; y: number; width: number; height: number; startX: number; startY: number } | null>(null);
  const initializedRef = useRef<boolean>(false);

  // Buscar tamaño del nodo en el DOM si no está definido
  useEffect(() => {
    if (!initializedRef.current && nodeRef.current) {
      // Obtener el tamaño actual del nodo desde el DOM
      const nodeElement = nodeRef.current;
      const { width, height } = nodeElement.getBoundingClientRect();
      
      // Solo actualizar si es diferente del valor predeterminado o si no hay tamaño definido
      if (width > 0 && height > 0 && (width !== size.width || height !== size.height)) {
        setSize({ width, height });
      }
      
      initializedRef.current = true;
    }
  }, []);

  // Actualizar posición y tamaño si las props cambian
  useEffect(() => {
    setPos(position);
  }, [position]);
  
  // También actualizar el tamaño si viene como propiedad en el type (para nodos que vienen del localStorage)
  useEffect(() => {
    // Si el nodo tiene una propiedad size definida, usarla para inicializar el tamaño
    const sizeMatch = type.match(/size:(\d+)x(\d+)/);
    if (sizeMatch) {
      const width = parseInt(sizeMatch[1], 10);
      const height = parseInt(sizeMatch[2], 10);
      if (width > 0 && height > 0) {
        setSize({ width, height });
      }
    }
  }, [type]);
  
  // Limpiar listeners globales al desmontar
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStartRef.current) {
        e.preventDefault();
        const newX = dragStartRef.current.startX + (e.clientX - dragStartRef.current.x);
        const newY = dragStartRef.current.startY + (e.clientY - dragStartRef.current.y);
        const newPos = { x: newX, y: newY };
        setPos(newPos);
        onNodeMove(id, newPos);
      } else if (isResizing && resizeStartRef.current) {
        e.preventDefault();
        handleResizeMove(e);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        dragStartRef.current = null;
      }
      if (isResizing) {
        setIsResizing(null);
        resizeStartRef.current = null;
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    } else {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, isResizing, id, onNodeMove, onNodeResize]);

  // Manejadores para arrastrar el nodo
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.classList.contains('connection-point') ||
      target.classList.contains('resize-handle') ||
      target.closest('input') // Usar closest para detectar clics dentro del input
    ) {
      return;
    }
    
    if (e.button !== 0) return; // Solo botón izquierdo
    
    e.stopPropagation();
    e.preventDefault();
    
    dragStartRef.current = { x: e.clientX, y: e.clientY, startX: pos.x, startY: pos.y };
    setIsDragging(true);
  };
  
  // Manejadores para redimensionar el nodo
  const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    e.preventDefault();
    
    resizeStartRef.current = {
      handle,
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      startX: pos.x,
      startY: pos.y
    };
    setIsResizing(handle);
  };

  const handleResizeMove = (moveEvent: MouseEvent) => {
    if (!resizeStartRef.current) return;
    
    const { handle, x, y, width, height, startX, startY } = resizeStartRef.current;
    
    const deltaX = moveEvent.clientX - x;
    const deltaY = moveEvent.clientY - y;
    
    let newWidth = width;
    let newHeight = height;
    let newPosX = startX;
    let newPosY = startY;
    
    // Aplicar cambios según el controlador
    if (handle.includes('left')) {
      newWidth = Math.max(60, width - deltaX);
      newPosX = startX + (width - newWidth);
    } else if (handle.includes('right')) {
      newWidth = Math.max(60, width + deltaX);
    }

    if (handle.includes('top')) {
      newHeight = Math.max(60, height - deltaY);
      newPosY = startY + (height - newHeight);
    } else if (handle.includes('bottom')) {
      newHeight = Math.max(60, height + deltaY);
    }
    
    // Actualizar tamaño y posición
    const newSize = { width: newWidth, height: newHeight };
    const newPos = { x: newPosX, y: newPosY };
    
    setSize(newSize);
    setPos(newPos);
    
    // Notificar al padre
    onNodeMove(id, newPos);
    onNodeResize(id, newSize);
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteNode) onDeleteNode(id);
  };
  
  // Iniciar una conexión desde un punto de conexión
  const handleConnectionStart = (connectionPosition: ConnectionPosition) => {
    if (disabled || !onConnectionStart) return;
    
    let x = pos.x;
    let y = pos.y;
    
    switch (connectionPosition) {
      case 'top': x += size.width / 2; break;
      case 'right': x += size.width; y += size.height / 2; break;
      case 'bottom': x += size.width / 2; y += size.height; break;
      case 'left': y += size.height / 2; break;
    }
    
    onConnectionStart(id, connectionPosition, x, y);
  };
  
  // Cuando soltamos el ratón sobre este nodo, puede ser el destino de una conexión
  const handleMouseUp = () => {
    if (disabled || !onConnectionEnd) return;
    
    if (!isDragging && !isResizing) { // Solo finalizar conexión si no estábamos arrastrando/redimensionando
        onConnectionEnd(id);
    }
  };

  // Determinar las clases CSS para el nodo según su estado
  const nodeClasses = `
    absolute 
    node 
    rounded-lg
    shadow-sm
    bg-white/95
    backdrop-filter 
    backdrop-blur-md
    border 
    border-border/40
    transition-all
    duration-250
    select-none
    ${isDragging ? 'cursor-grabbing shadow-md' : 'cursor-move glow-hover'}
    ${isDragging || isResizing ? 'z-30' : (isHovered ? 'z-20 shadow-md' : 'z-10')}
    ${disabled ? 'opacity-80 pointer-events-none filter grayscale' : ''}
  `;

  return (
    <div
      ref={nodeRef}
      className={nodeClasses}
      style={{ 
        left: `${pos.x}px`, 
        top: `${pos.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        touchAction: 'none',
        userSelect: 'none',
        overflow: 'visible',
      }}
      onMouseDown={handleMouseDown} // Inicia el arrastre del nodo
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp} // Podría finalizar una conexión
    >
      <div className="w-full h-full p-2 overflow-hidden rounded-md">
        <Square editable={true} initialText={text} />
      </div>
      
      {/* Mostrar puntos de conexión cuando el ratón está sobre el nodo */}
      {isHovered && !isDragging && !isResizing && (
        <>
          <ConnectionPoint position="top" onConnectionStart={handleConnectionStart} />
          <ConnectionPoint position="right" onConnectionStart={handleConnectionStart} />
          <ConnectionPoint position="bottom" onConnectionStart={handleConnectionStart} />
          <ConnectionPoint position="left" onConnectionStart={handleConnectionStart} />
          
          {/* Botón de eliminar */}
          <button
            className="absolute -top-3 -right-3 bg-red-400 hover:bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors shadow-sm"
            onClick={handleDelete}
            title="Eliminar nodo"
          >
            ×
          </button>
        </>
      )}
      
      {/* Controladores de redimensionamiento */}
      {isHovered && !isDragging && !isResizing && (
        <>
          {[{'top-left': {top: -4, left: -4}}, {'top-right': {top: -4, right: -4}}, {'bottom-left': {bottom: -4, left: -4}}, {'bottom-right': {bottom: -4, right: -4}}].map(handleObj => {
            const handle = Object.keys(handleObj)[0] as ResizeHandle;
            const style = Object.values(handleObj)[0];
            let cursorClass = 'cursor-nwse-resize';
            if (handle === 'top-right' || handle === 'bottom-left') {
              cursorClass = 'cursor-nesw-resize';
            }
            
            return (
              <div 
                key={handle}
                className={`resize-handle absolute w-3 h-3 bg-primary rounded-full ${cursorClass} z-40 border border-white shadow-sm`}
                style={style}
                onMouseDown={(e) => handleResizeStart(e, handle)}
              />
            );
          })}
        </>
      )}
      
      {/* Indicador visual durante el arrastre */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 z-0 pointer-events-none rounded-md" />
      )}
      
      {/* Indicador visual durante el redimensionamiento */}
      {isResizing && (
        <div className="absolute inset-0 border-2 border-primary z-0 pointer-events-none rounded-md" />
      )}
    </div>
  );
}
