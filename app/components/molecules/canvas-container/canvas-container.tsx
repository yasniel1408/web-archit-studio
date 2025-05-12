"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Container } from '@/app/components/atoms/container/container';
import { IconType } from '@/app/components/atoms/icon-selector/types';
import { ConnectionPoint, ConnectionPosition } from '@/app/components/atoms/connection-point/connection-point';

type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface CanvasContainerProps {
  id: string;
  type: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  text?: string;
  iconType?: IconType;
  backgroundColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  zIndex?: number;
  onConnectionStart: (nodeId: string, position: ConnectionPosition, x: number, y: number) => void;
  onConnectionEnd: (targetNodeId: string, targetPosition: ConnectionPosition, x: number, y: number) => void;
  onNodeMove: (nodeId: string, position: { x: number, y: number }) => void;
  onNodeResize: (nodeId: string, size: { width: number, height: number }) => void;
  onDeleteNode?: (nodeId: string) => void;
  onPropertiesChange?: (properties: { [key: string]: any }) => void;
  disabled?: boolean;
}

export function CanvasContainer({ 
  id, 
  type, 
  position, 
  size: initialSize = { width: 400, height: 300 },
  text = "",
  iconType,
  backgroundColor = "rgba(240, 249, 255, 0.3)",
  borderStyle = "dashed",
  zIndex = 0,
  onConnectionStart,
  onConnectionEnd,
  onNodeMove,
  onNodeResize,
  onDeleteNode,
  onPropertiesChange,
  disabled = false
}: CanvasContainerProps) {
  const [pos, setPos] = useState(position);
  const [size, setSize] = useState(initialSize);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeHandle | null>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const resizeStartRef = useRef<{ handle: ResizeHandle; x: number; y: number; width: number; height: number; startX: number; startY: number } | null>(null);
  const initializedRef = useRef<boolean>(false);

  // Buscar tamaño del nodo en el DOM si no está definido
  useEffect(() => {
    if (!initializedRef.current && containerRef.current) {
      // Obtener el tamaño actual del nodo desde el DOM
      const nodeElement = containerRef.current;
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
    console.log(`CanvasContainer ${id} - backgroundColor recibido:`, backgroundColor);
  }, [id, backgroundColor]);
  
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
        if (containerRef.current) {
          // Asignación directa de posiciones usando left/top
          containerRef.current.style.left = `${newX}px`;
          containerRef.current.style.top = `${newY}px`;
          
          // Notificar al padre
          onNodeMove(id, { x: newX, y: newY });
        }
        
        // Actualizar estado
        setPos({ x: newX, y: newY });
      } else if (isResizing && resizeStartRef.current) {
        e.preventDefault();
        handleResizeMove(e);
      }
    };
    
    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isDragging || isResizing) {
        e.preventDefault();
        setIsDragging(false);
        setIsResizing(null);
        dragStartRef.current = null;
        resizeStartRef.current = null;
      }
    };
    
    // Agregar escuchas para eventos globales del ratón
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    
    // Limpieza al desmontar
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [id, isDragging, isResizing]);
  
  // Manejar inicio de arrastre del nodo
  const handleMouseDown = (e: React.MouseEvent) => {
    // Verificar que el clic no sea en un control o se esté utilizando
    if (disabled || isResizing || isColorPickerOpen || isIconSelectorOpen) return;
    
    // Solo iniciar arrastre con clic primario y no en elementos interactivos
    if (e.button !== 0 || (e.target as HTMLElement).tagName === 'INPUT') return;
    
    // Evitar iniciar arrastre si hacemos clic en un punto de conexión o botón de eliminar
    const target = e.target as HTMLElement;
    if (
      target.closest('.connection-point') || 
      target.closest('button') || 
      target.tagName === 'INPUT'
    ) {
      return;
    }
    
    // Iniciar operación de arrastre
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    
    // Guardar posición inicial para cálculos de desplazamiento
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startX: pos.x,
      startY: pos.y
    };
  };
  
  // Manejar el redimensionamiento al mover el ratón
  const handleResizeMove = (moveEvent: MouseEvent) => {
    if (!resizeStartRef.current || !containerRef.current) return;
    
    const { handle, x, y, width, height, startX, startY } = resizeStartRef.current;
    
    const deltaX = moveEvent.clientX - x;
    const deltaY = moveEvent.clientY - y;
    
    let newWidth = width;
    let newHeight = height;
    let newPosX = startX;
    let newPosY = startY;
    
    // Aplicar cambios según el controlador
    if (handle.includes('left')) {
      newWidth = Math.max(100, width - deltaX);
      newPosX = startX + (width - newWidth);
    } else if (handle.includes('right')) {
      newWidth = Math.max(100, width + deltaX);
    }

    if (handle.includes('top')) {
      newHeight = Math.max(100, height - deltaY);
      newPosY = startY + (height - newHeight);
    } else if (handle.includes('bottom')) {
      newHeight = Math.max(100, height + deltaY);
    }
    
    // Actualizar directamente en el DOM para un redimensionado fluido
    containerRef.current.style.left = `${newPosX}px`;
    containerRef.current.style.top = `${newPosY}px`;
    containerRef.current.style.width = `${newWidth}px`;
    containerRef.current.style.height = `${newHeight}px`;
    
    // Actualizar el estado en tiempo real para mantener la coherencia
    setPos({ x: newPosX, y: newPosY });
    setSize({ width: newWidth, height: newHeight });
    
    // Notificar al padre en tiempo real
    onNodeMove(id, { x: newPosX, y: newPosY });
    onNodeResize(id, { width: newWidth, height: newHeight });
  };
  
  // Iniciar redimensionamiento desde un control específico
  const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsResizing(handle);
    resizeStartRef.current = {
      handle,
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      startX: pos.x,
      startY: pos.y
    };
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
  const handleMouseUp = (e: React.MouseEvent) => {
    if (disabled || !onConnectionEnd) return;
    
    if (!isDragging && !isResizing) { // Solo finalizar conexión si no estábamos arrastrando/redimensionando
      // Determinar la posición de conexión más cercana al punto donde se soltó el ratón
      const rect = containerRef.current?.getBoundingClientRect();
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
      
      console.log(`Container ${id}: Conexión terminada en posición ${connectionPosition}`);
      
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
      
      onConnectionEnd(id, connectionPosition, connectionX, connectionY);
    }
  };

  // Función para manejar cambios en el ícono
  const handleIconChange = (newIcon: IconType) => {
    // Notificar al padre del cambio
    console.log("Icono cambiado en contenedor:", id, newIcon);
    
    // Propagar cambio al componente padre
    if (onPropertiesChange) {
      onPropertiesChange({ icon: newIcon });
    }
    
    // Actualizar estado para rastrear cuando el selector está abierto
    setIsIconSelectorOpen(false);
  };

  // Función para manejar cambios en el color de fondo
  const handleColorChange = (newColor: string, newZIndex?: number) => {
    // Notificar al padre del cambio
    console.log("Color cambiado en contenedor:", id, newColor, "zIndex:", newZIndex);
    
    // Propagar cambio al componente padre
    if (onPropertiesChange) {
      onPropertiesChange({ 
        backgroundColor: newColor,
        ...(newZIndex !== undefined && { zIndex: newZIndex })
      });
    }
    
    // Actualizar estado para rastrear cuando el selector está abierto
    setIsColorPickerOpen(false);
  };

  // Función para manejar cambios en el texto del contenedor
  const handleTextChange = (newText: string) => {
    // Notificar al padre del cambio
    console.log("Texto cambiado en contenedor:", id, newText);
    
    // Propagar cambio al componente padre
    if (onPropertiesChange) {
      onPropertiesChange({ text: newText });
    }
  };

  // Manejar clics fuera del nodo para ocultar los controles
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
  const containerClasses = `
    absolute 
    node 
    container-node
    rounded-lg
    shadow-sm
    bg-transparent
    backdrop-filter 
    backdrop-blur-sm
    border-2
    border-dashed
    border-border/40
    select-none
    ${isDragging ? 'cursor-grabbing' : 'cursor-move'}
    ${disabled ? 'opacity-80 pointer-events-none filter grayscale' : ''}
  `;
  
  // Estilos adicionales aplicados directamente en el style
  const containerStyle = {
    left: `${pos.x}px`, 
    top: `${pos.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    touchAction: 'none',
    userSelect: 'none' as 'none',
    overflow: 'visible',
    transition: 'none',
    animation: 'none',
    borderStyle: borderStyle || 'dashed',
    // Ajustar z-index para respetar la prioridad absoluta
    // Los incrementos por estado deben ser más pequeños que la diferencia entre niveles de prioridad
    zIndex: zIndex * 100 + (isDragging ? 30 : (isResizing ? 20 : (isHovered ? 10 : 0))),
  };

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={containerStyle}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
    >
      <div className="w-full h-full p-2 overflow-hidden rounded-md" style={{ transition: 'none' }}>
        <Container 
          editable={true} 
          initialText={text} 
          icon={iconType}
          backgroundColor={backgroundColor}
          borderStyle={borderStyle as any}
          zIndex={zIndex}
          onIconChange={handleIconChange}
          onColorChange={handleColorChange}
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
            title="Eliminar contenedor"
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