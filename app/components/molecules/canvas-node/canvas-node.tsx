"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Square } from '@/app/components/atoms/square/square';
import { IconType } from '@/app/components/atoms/icon-selector/types';
import { ConnectionPoint, ConnectionPosition } from '@/app/components/atoms/connection-point/connection-point';

interface CanvasNodeProps {
  id: string;
  type: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  text?: string;
  iconType?: IconType; // Usar el tipo importado
  backgroundColor?: string; // Añadir la propiedad backgroundColor
  zIndex?: number; // Agregar zIndex
  onConnectionStart: (nodeId: string, position: ConnectionPosition, x: number, y: number) => void;
  onConnectionEnd: (targetNodeId: string, targetPosition: ConnectionPosition, x: number, y: number, getFinalCoordinates?: (mouseX: number, mouseY: number) => { x: number; y: number; isSnapped: boolean; targetNodeId: string | null; targetPosition: ConnectionPosition | null; }) => void;
  onNodeMove: (nodeId: string, position: { x: number, y: number }) => void;
  onNodeResize: (nodeId: string, size: { width: number, height: number }) => void;
  onDeleteNode?: (nodeId: string) => void;
  onPropertiesChange?: (properties: { [key: string]: any }) => void; // Para cambios de propiedades adicionales
  disabled?: boolean;
}

type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export function CanvasNode({ 
  id, 
  type, 
  position, 
  size: initialSize = { width: 120, height: 120 },
  text = "",
  iconType,
  backgroundColor = "#FFFFFF", // Añadir valor por defecto
  zIndex = 10, // Valor por defecto para zIndex
  onConnectionStart,
  onConnectionEnd,
  onNodeMove,
  onNodeResize,
  onDeleteNode,
  onPropertiesChange,
  disabled = false
}: CanvasNodeProps) {
  // Asegurar que el ID sea válido
  const nodeId: string = id || `node-${Date.now()}`;
  
  const [pos, setPos] = useState(position);
  const [size, setSize] = useState(initialSize);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeHandle | null>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
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

  // Debugging para el color de fondo
  useEffect(() => {
    console.log(`CanvasNode ${nodeId} - backgroundColor recibido:`, backgroundColor);
  }, [nodeId, backgroundColor]);
  
  // Limpiar listeners globales al desmontar
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStartRef.current) {
        e.preventDefault();
        
        // Cálculo directo para posicionamiento instantáneo
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        const newX = dragStartRef.current.startX + dx;
        const newY = dragStartRef.current.startY + dy;
        
        // Actualizar DOM directamente sin ningún tipo de transformación o animación
        if (nodeRef.current) {
          // Asignación directa de posiciones usando left/top
          nodeRef.current.style.left = `${newX}px`;
          nodeRef.current.style.top = `${newY}px`;
          
          // Notificar al padre
          onNodeMove(nodeId, { x: newX, y: newY });
        }
        
        // Actualizar estado
        setPos({ x: newX, y: newY });
      } else if (isResizing && resizeStartRef.current) {
        e.preventDefault();
        handleResizeMove(e);
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isDragging && dragStartRef.current && nodeRef.current) {
        // Simplemente limpiar el estado
        nodeRef.current.classList.remove('dragging');
        setIsDragging(false);
        dragStartRef.current = null;
      }
      
      if (isResizing && resizeStartRef.current && nodeRef.current) {
        // Al finalizar el redimensionado, solo necesitamos limpiar el estado
        // ya que las dimensiones y posiciones ya se actualizaron en tiempo real
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
  }, [isDragging, isResizing, nodeId, onNodeMove, onNodeResize, pos.x, pos.y]);

  // Manejadores para arrastrar el nodo
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.classList.contains('connection-point') ||
      target.classList.contains('resize-handle') ||
      target.closest('input')
    ) {
      return;
    }
    
    if (e.button !== 0) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    if (nodeRef.current) {
      nodeRef.current.classList.add('dragging');
    }
    
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

  const handleResizeMove = (moveEvent: MouseEvent | PointerEvent) => {
    if (!resizeStartRef.current || !nodeRef.current) return;
    
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
    
    // Actualizar directamente en el DOM para un redimensionado fluido
    nodeRef.current.style.left = `${newPosX}px`;
    nodeRef.current.style.top = `${newPosY}px`;
    nodeRef.current.style.width = `${newWidth}px`;
    nodeRef.current.style.height = `${newHeight}px`;
    
    // Actualizar el estado en tiempo real para mantener la coherencia
    setPos({ x: newPosX, y: newPosY });
    setSize({ width: newWidth, height: newHeight });
    
    // Notificar al padre en tiempo real
    onNodeMove(nodeId, { x: newPosX, y: newPosY });
    onNodeResize(nodeId, { width: newWidth, height: newHeight });
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    // Solo mostrar controles si no hay operaciones en curso
    if (!isDragging && !isResizing && !isColorPickerOpen && !isIconSelectorOpen) {
      setShowControls(true);
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    // No ocultamos automáticamente los controles al salir para mejorar UX
    // Se ocultarán al hacer clic fuera del nodo
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteNode) {
      onDeleteNode(nodeId);
    }
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
    
    onConnectionStart(nodeId, connectionPosition, x, y);
  };
  
  // Cuando soltamos el ratón sobre este nodo, puede ser el destino de una conexión
  const handleMouseUp = (e: React.MouseEvent) => {
    if (disabled || !onConnectionEnd) return;
    
    if (!isDragging && !isResizing) { // Solo finalizar conexión si no estábamos arrastrando/redimensionando
      // Determinar la posición de conexión más cercana al punto donde se soltó el ratón
      const rect = nodeRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      // Obtener la posición relativa del ratón respecto al nodo
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      
      // Calcular distancias a cada lado
      const distToTop = relY;
      const distToRight = rect.width - relX;
      const distToBottom = rect.height - relY;
      const distToLeft = relX;
      
      // Determinar cuál es el más cercano
      const minDist = Math.min(distToTop, distToRight, distToBottom, distToLeft);
      let connectionPosition: ConnectionPosition;
      
      if (minDist === distToTop) {
        connectionPosition = 'top';
      } else if (minDist === distToRight) {
        connectionPosition = 'right';
      } else if (minDist === distToBottom) {
        connectionPosition = 'bottom';
      } else {
        connectionPosition = 'left';
      }
      
      console.log(`CanvasNode ${nodeId}: Conexión terminada en posición ${connectionPosition}`);
      
      // Calcular las coordenadas exactas del punto de conexión
      let connectionX = pos.x;
      let connectionY = pos.y;
      
      // Ajustar las coordenadas según la posición de conexión
      if (connectionPosition === 'top') {
        connectionX += size.width / 2;
      } else if (connectionPosition === 'right') {
        connectionX += size.width;
        connectionY += size.height / 2;
      } else if (connectionPosition === 'bottom') {
        connectionX += size.width / 2;
        connectionY += size.height;
      } else if (connectionPosition === 'left') {
        connectionY += size.height / 2;
      }
      
      onConnectionEnd(nodeId, connectionPosition, connectionX, connectionY);
    }
  };

  // Función para manejar cambios en el ícono
  const handleIconChange = (newIcon: IconType) => {
    // Notificar al padre del cambio
    console.log("Icono cambiado en nodo:", nodeId, newIcon);
    
    // Propagar cambio al componente padre - CORREGIR: usar 'icon' en lugar de 'iconType'
    if (onPropertiesChange) {
      onPropertiesChange({ icon: newIcon });
    }
    
    // Actualizar estado para rastrear cuando el selector está abierto
    setIsIconSelectorOpen(false);
  };

  // Función para manejar cambios en el color de fondo
  const handleColorChange = (newColor: string, newZIndex?: number) => {
    // Notificar al padre del cambio
    console.log("Color cambiado en nodo:", nodeId, newColor, "zIndex:", newZIndex);
    
    // Propagar cambio al componente padre
    if (onPropertiesChange) {
      if (newZIndex !== undefined) {
        onPropertiesChange({ 
          backgroundColor: newColor,
          zIndex: newZIndex
        });
      } else {
        onPropertiesChange({ backgroundColor: newColor });
      }
    }
    
    // Actualizar estado para rastrear cuando el selector está abierto
    setIsColorPickerOpen(false);
  };

  // Función para manejar cambios en el texto
  const handleTextChange = (newText: string) => {
    // Notificar al padre del cambio
    console.log("Texto cambiado en nodo:", nodeId, newText);
    
    // Propagar cambio al componente padre
    if (onPropertiesChange) {
      onPropertiesChange({ text: newText });
    }
  };

  // Manejar clics fuera del nodo para ocultar los controles
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (nodeRef.current && !nodeRef.current.contains(e.target as Node)) {
        setShowControls(false);
      }
    }

    // Solo añadir el listener si los controles están visibles
    if (showControls && !isDragging && !isResizing && !isColorPickerOpen && !isIconSelectorOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showControls, isDragging, isResizing, isColorPickerOpen, isIconSelectorOpen]);

  // Sincronizar el estado showControls con isHovered para mantener compatibilidad
  useEffect(() => {
    if (isHovered && !isDragging && !isResizing) {
      setShowControls(true);
    }
  }, [isHovered, isDragging, isResizing]);

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
    select-none
    ${isDragging ? 'cursor-grabbing' : 'cursor-move'}
    ${disabled ? 'opacity-80 pointer-events-none filter grayscale' : ''}
  `;
  
  // Estilos adicionales aplicados directamente en el style
  const nodeStyle = {
    left: `${pos.x}px`, 
    top: `${pos.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    touchAction: 'none',
    userSelect: 'none' as 'none',
    overflow: 'visible',
    transition: 'none',
    animation: 'none',
    // Ajustar z-index para respetar la prioridad absoluta
    // Los incrementos por estado deben ser más pequeños que la diferencia entre niveles de prioridad
    zIndex: zIndex * 100 + (isDragging ? 30 : (isResizing ? 20 : (isHovered ? 10 : 0))),
  };

  return (
    <div
      ref={nodeRef}
      className={nodeClasses}
      style={nodeStyle}
      data-node-id={id}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
    >
      <div className="w-full h-full p-2 overflow-hidden rounded-md" style={{ transition: 'none' }}>
        <Square 
          editable={true} 
          initialText={text} 
          icon={iconType || 'none'}
          backgroundColor={backgroundColor || '#FFFFFF'}
          zIndex={zIndex}
          onIconChange={handleIconChange}
          onColorChange={(newColor, newZIndex) => handleColorChange(newColor, newZIndex)}
          onTextChange={handleTextChange}
          onColorPickerOpen={() => setIsColorPickerOpen(true)}
          onColorPickerClose={() => setIsColorPickerOpen(false)}
          onIconSelectorOpen={() => setIsIconSelectorOpen(true)}
          onIconSelectorClose={() => setIsIconSelectorOpen(false)}
          className="no-transitions"
        />
      </div>
      
      {/* Mostrar puntos de conexión solo cuando los controles están visibles */}
      {showControls && !isDragging && !isResizing && !isColorPickerOpen && !isIconSelectorOpen && (
        <>
          <ConnectionPoint position="top" onConnectionStart={handleConnectionStart} />
          <ConnectionPoint position="right" onConnectionStart={handleConnectionStart} />
          <ConnectionPoint position="bottom" onConnectionStart={handleConnectionStart} />
          <ConnectionPoint position="left" onConnectionStart={handleConnectionStart} />
          
          {/* Botón de eliminar - Posición más separada para mejor visibilidad */}
          <button
            className="absolute -top-6 -right-6 bg-red-400 hover:bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors shadow-sm border border-white"
            onClick={handleDelete}
            title="Eliminar nodo"
          >
            ×
          </button>
        </>
      )}
      
      {/* Controladores de redimensionamiento - solo mostrarlos cuando los controles están visibles */}
      {showControls && !isDragging && !isResizing && !isColorPickerOpen && !isIconSelectorOpen && (
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
