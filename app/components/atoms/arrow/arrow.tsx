"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ConnectionPosition } from '@/app/components/atoms/connection-point/connection-point';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  PaintBrushIcon, 
  Square2StackIcon, 
  ArrowPathIcon,
  CheckIcon
} from '@heroicons/react/24/solid';

// Estilos personalizados para la barra de desplazamiento
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  @media (max-width: 640px) {
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
  }
`;

export type ArrowStyle = 'solid' | 'dashed' | 'dotted';
export type ArrowAnimation = 'none' | 'pulse' | 'flow' | 'dash' | 'traveling-dot' | 'traveling-dot-fast' | 'traveling-dot-fastest';
export type ArrowHeadType = 'none' | 'arrow' | 'circle' | 'diamond';

interface ArrowProps {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startPosition: ConnectionPosition;
  endPosition: ConnectionPosition;
  startArrowHead?: ArrowHeadType;
  endArrowHead?: ArrowHeadType;
  style?: ArrowStyle;
  animation?: ArrowAnimation;
  color?: string;
  strokeWidth?: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onPropertiesChange?: (properties: {
    style?: ArrowStyle;
    animation?: ArrowAnimation;
    startArrowHead?: ArrowHeadType;
    endArrowHead?: ArrowHeadType;
    color?: string;
    strokeWidth?: number;
  }) => void;
  onDelete?: (id: string) => void;
}

export function Arrow({ 
  id,
  startX, 
  startY, 
  endX, 
  endY, 
  startPosition, 
  endPosition,
  startArrowHead = 'none',
  endArrowHead = 'arrow',
  style = 'solid',
  animation = 'none',
  color = '#000000',
  strokeWidth = 2,
  isSelected = false,
  onSelect,
  onPropertiesChange,
  onDelete
}: ArrowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimationsMenuOpen, setIsAnimationsMenuOpen] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<ArrowStyle>(style || 'solid');
  const [currentAnimation, setCurrentAnimation] = useState<ArrowAnimation>(animation || 'none');
  const [currentArrowHead, setCurrentArrowHead] = useState<ArrowHeadType>(endArrowHead || 'arrow');
  const [currentStartArrowHead, setCurrentStartArrowHead] = useState<ArrowHeadType>(startArrowHead || 'none');
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const animationsMenuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Para animación de punto recorriendo (traveling-dot)
  const [dotPosition, setDotPosition] = useState(0);
  
  // Update dot position for traveling-dot animation
  useEffect(() => {
    if (currentAnimation !== 'traveling-dot' && 
        currentAnimation !== 'traveling-dot-fast' && 
        currentAnimation !== 'traveling-dot-fastest') return;
    
    let speedFactor = 0.005; // Velocidad base (normal)
    
    if (currentAnimation === 'traveling-dot-fast') {
      speedFactor = 0.01; // 2x velocidad
    } else if (currentAnimation === 'traveling-dot-fastest') {
      speedFactor = 0.02; // 4x velocidad
    }
    
    console.log(`Arrow ${id}: Iniciando animación de punto recorriendo - velocidad: ${
      currentAnimation === 'traveling-dot-fastest' ? 'muy rápida' : 
      currentAnimation === 'traveling-dot-fast' ? 'rápida' : 'normal'
    }`);
    
    const interval = setInterval(() => {
      setDotPosition(prev => {
        const newPos = prev + speedFactor;
        return newPos >= 1 ? 0 : newPos;
      });
    }, 16); // 60fps para animación más fluida
    
    return () => {
      console.log(`Arrow ${id}: Limpiando animación de punto`);
      clearInterval(interval);
    };
  }, [currentAnimation, id]);
  
  console.log(`Arrow ${id}: Rendering with animation = ${currentAnimation}, style = ${currentStyle}`);

  // Calcular los puntos de control para la curva Bezier
  const getBezierControlPoints = () => {
    // Calcular distancia para los puntos de control
    const dx = Math.abs(endX - startX);
    const dy = Math.abs(endY - startY);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Ajustar distancia de control basada en la distancia total
    // Usamos una fórmula que escala proporcionalmente pero con un límite superior
    const controlDistance = Math.min(
      distance * 0.4, // 40% de la distancia total como máximo
      Math.max(50, distance * 0.2) // Al menos 50px o 20% de la distancia
    );
    
    // Vectores direccionales desde los puntos de inicio/fin hacia el centro
    const dirXStart = endX - startX;
    const dirYStart = endY - startY;
    const dirXEnd = startX - endX;
    const dirYEnd = startY - endY;
    
    // Normalizar los vectores
    const lenStart = Math.sqrt(dirXStart * dirXStart + dirYStart * dirYStart) || 1;
    const lenEnd = Math.sqrt(dirXEnd * dirXEnd + dirYEnd * dirYEnd) || 1;
    
    // Inicializar puntos de control en los puntos de inicio/fin
    let controlPoint1X = startX;
    let controlPoint1Y = startY;
    let controlPoint2X = endX;
    let controlPoint2Y = endY;
    
    // Ajustar punto de control según la posición de inicio
    switch (startPosition) {
      case 'top':
        // Si sale por arriba, mover punto de control hacia arriba
        controlPoint1X += (dirXStart / lenStart) * controlDistance * 0.1;
        controlPoint1Y -= controlDistance;
        break;
      case 'right':
        // Si sale por la derecha, mover punto de control hacia la derecha
        controlPoint1X += controlDistance;
        controlPoint1Y += (dirYStart / lenStart) * controlDistance * 0.1;
        break;
      case 'bottom':
        // Si sale por abajo, mover punto de control hacia abajo
        controlPoint1X += (dirXStart / lenStart) * controlDistance * 0.1;
        controlPoint1Y += controlDistance;
        break;
      case 'left':
        // Si sale por la izquierda, mover punto de control hacia la izquierda
        controlPoint1X -= controlDistance;
        controlPoint1Y += (dirYStart / lenStart) * controlDistance * 0.1;
        break;
    }
    
    // Ajustar punto de control según la posición final
    switch (endPosition) {
      case 'top':
        // Si entra por arriba, mover punto de control hacia arriba
        controlPoint2X += (dirXEnd / lenEnd) * controlDistance * 0.1;
        controlPoint2Y -= controlDistance;
        break;
      case 'right':
        // Si entra por la derecha, mover punto de control hacia la derecha
        controlPoint2X += controlDistance;
        controlPoint2Y += (dirYEnd / lenEnd) * controlDistance * 0.1;
        break;
      case 'bottom':
        // Si entra por abajo, mover punto de control hacia abajo
        controlPoint2X += (dirXEnd / lenEnd) * controlDistance * 0.1;
        controlPoint2Y += controlDistance;
        break;
      case 'left':
        // Si entra por la izquierda, mover punto de control hacia la izquierda
        controlPoint2X -= controlDistance;
        controlPoint2Y += (dirYEnd / lenEnd) * controlDistance * 0.1;
        break;
    }
    
    // Caso especial: si los puntos están casi alineados horizontal o verticalmente,
    // ajustar para evitar curvas demasiado planas
    if (dx < dy * 0.1) { // Casi vertical
      controlPoint1X -= controlDistance * 0.5;
      controlPoint2X += controlDistance * 0.5;
    } else if (dy < dx * 0.1) { // Casi horizontal
      controlPoint1Y -= controlDistance * 0.5;
      controlPoint2Y += controlDistance * 0.5;
    }
    
    return {
      controlPoint1X,
      controlPoint1Y,
      controlPoint2X,
      controlPoint2Y
    };
  };
  
  // Calcular punto en la curva Bezier según t [0..1]
  const getPointOnCurve = (t: number) => {
    const { controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y } = getBezierControlPoints();
    
    // Fórmula para punto en curva Bezier cúbica
    const x = Math.pow(1-t, 3) * startX + 
              3 * Math.pow(1-t, 2) * t * controlPoint1X + 
              3 * (1-t) * Math.pow(t, 2) * controlPoint2X + 
              Math.pow(t, 3) * endX;
              
    const y = Math.pow(1-t, 3) * startY + 
              3 * Math.pow(1-t, 2) * t * controlPoint1Y + 
              3 * (1-t) * Math.pow(t, 2) * controlPoint2Y + 
              Math.pow(t, 3) * endY;
              
    return { x, y };
  };
  
  // Calcular la dirección y puntos para la punta de flecha
  const getArrowHead = (
    position: ConnectionPosition, 
    x: number, 
    y: number, 
    isStart: boolean,
    type: ArrowHeadType
  ) => {
    if (type === 'none') return null;
    
    // Dirección según el punto de conexión
    let dx = 0;
    let dy = 0;
    
    switch (position) {
      case 'top':
        dy = isStart ? 1 : -1;
        break;
      case 'right':
        dx = isStart ? -1 : 1;
        break;
      case 'bottom':
        dy = isStart ? -1 : 1;
        break;
      case 'left':
        dx = isStart ? 1 : -1;
        break;
    }
    
    const arrowSize = 10;
    const angle = Math.atan2(dy, dx);
    
    // Render arrowhead based on type
    switch (type) {
      case 'arrow': {
        // Puntos para la punta de flecha clásica
        const point1 = {
          x: x - arrowSize * Math.cos(angle - Math.PI/6),
          y: y - arrowSize * Math.sin(angle - Math.PI/6)
        };
        
        const point2 = {
          x: x - arrowSize * Math.cos(angle + Math.PI/6),
          y: y - arrowSize * Math.sin(angle + Math.PI/6)
        };
        
        return (
          <polygon 
            points={`${x},${y} ${point1.x},${point1.y} ${point2.x},${point2.y}`} 
            fill={color} 
            key={`${id}-arrowhead-${type}`}
          />
        );
      }
      
      case 'circle': {
        return (
          <circle 
            cx={x} 
            cy={y} 
            r={arrowSize/2} 
            fill={color} 
            key={`${id}-arrowhead-${type}`}
          />
        );
      }
      
      case 'diamond': {
        // Puntos para un diamante
        const point1 = {
          x: x - arrowSize/2 * Math.cos(angle),
          y: y - arrowSize/2 * Math.sin(angle)
        };
        
        const point2 = {
          x: x - arrowSize/2 * Math.cos(angle - Math.PI/2),
          y: y - arrowSize/2 * Math.sin(angle - Math.PI/2)
        };
        
        const point3 = {
          x: x - arrowSize/2 * Math.cos(angle - Math.PI),
          y: y - arrowSize/2 * Math.sin(angle - Math.PI)
        };
        
        const point4 = {
          x: x - arrowSize/2 * Math.cos(angle - 3*Math.PI/2),
          y: y - arrowSize/2 * Math.sin(angle - 3*Math.PI/2)
        };
        
        return (
          <polygon 
            points={`${point1.x},${point1.y} ${point2.x},${point2.y} ${point3.x},${point3.y} ${point4.x},${point4.y}`} 
            fill={color} 
            key={`${id}-arrowhead-${type}`}
          />
        );
      }
      
      default:
        return null;
    }
  };
  
  // Obtener color base y calcular color de hover
  const baseColor = useMemo(() => isSelected ? "#3B82F6" : (color || 'rgba(99, 102, 241, 0.8)'), [color, isSelected]);
  const hoverColor = useMemo(() => {
    if (baseColor.startsWith('#')) {
      // Convertir color hexadecimal a rgba
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.95)`;
    } else if (baseColor.startsWith('rgba')) {
      // Aumentar opacidad si es rgba
      return baseColor.replace(/[\d\.]+\)$/, '0.95)');
    } else if (baseColor.startsWith('rgb')) {
      // Convertir rgb a rgba
      return baseColor.replace('rgb', 'rgba').replace(')', ', 0.95)');
    }
    return "#3B82F6"; // Color de hover predeterminado
  }, [baseColor]);

  // Calcular camino de la Bezier
  const { controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y } = getBezierControlPoints();
  const pathCommand = `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`;

  // Calcular cabezas de flecha
  const arrowHeadStart = startArrowHead !== 'none' ? calculateArrowHead(startPosition, startX, startY, true, startArrowHead) : null;
  const arrowHeadEnd = currentArrowHead !== 'none' ? calculateArrowHead(endPosition, endX, endY, false, currentArrowHead) : null;

  // Función auxiliar para calcular path de cabeza de flecha
  function calculateArrowHead(position: ConnectionPosition, x: number, y: number, isStart: boolean, type: ArrowHeadType): string {
    // Dirección según el punto de conexión
    let dx = 0;
    let dy = 0;
    
    switch (position) {
      case 'top':
        dy = isStart ? 1 : -1;
        break;
      case 'right':
        dx = isStart ? -1 : 1;
        break;
      case 'bottom':
        dy = isStart ? -1 : 1;
        break;
      case 'left':
        dx = isStart ? 1 : -1;
        break;
    }
    
    const arrowSize = 10;
    const angle = Math.atan2(dy, dx);
    
    switch (type) {
      case 'arrow': {
        const point1 = {
          x: x - arrowSize * Math.cos(angle - Math.PI/6),
          y: y - arrowSize * Math.sin(angle - Math.PI/6)
        };
        
        const point2 = {
          x: x - arrowSize * Math.cos(angle + Math.PI/6),
          y: y - arrowSize * Math.sin(angle + Math.PI/6)
        };
        
        return `M ${x},${y} L ${point1.x},${point1.y} L ${point2.x},${point2.y} Z`;
      }
      case 'circle': {
        return `M ${x},${y} m ${-arrowSize/2},0 a ${arrowSize/2},${arrowSize/2} 0 1,0 ${arrowSize},0 a ${arrowSize/2},${arrowSize/2} 0 1,0 ${-arrowSize},0`;
      }
      case 'diamond': {
        const point1 = {
          x: x - arrowSize/2 * Math.cos(angle),
          y: y - arrowSize/2 * Math.sin(angle)
        };
        
        const point2 = {
          x: x - arrowSize/2 * Math.cos(angle - Math.PI/2),
          y: y - arrowSize/2 * Math.sin(angle - Math.PI/2)
        };
        
        const point3 = {
          x: x - arrowSize/2 * Math.cos(angle - Math.PI),
          y: y - arrowSize/2 * Math.sin(angle - Math.PI)
        };
        
        const point4 = {
          x: x - arrowSize/2 * Math.cos(angle - 3*Math.PI/2),
          y: y - arrowSize/2 * Math.sin(angle - 3*Math.PI/2)
        };
        
        return `M ${point1.x},${point1.y} L ${point2.x},${point2.y} L ${point3.x},${point3.y} L ${point4.x},${point4.y} Z`;
      }
      default:
        return '';
    }
  }

  // Obtener estilo de trazo según el tipo seleccionado
  function getDashArray(): string {
    if (currentAnimation === 'traveling-dot' || 
        currentAnimation === 'traveling-dot-fast' || 
        currentAnimation === 'traveling-dot-fastest') {
      return "2, 4"; // Estilo discontinuo fino para el punto viajero
    }
    
    switch (currentStyle) {
      case 'dashed': return "8, 4";
      case 'dotted': return "2, 2";
      default: return ""; // Solid
    }
  }

  // Obtener clase CSS para animación
  function getStrokeAnimation(): string {
    if (currentAnimation === 'dash') {
      return 'animate-dash';
    } else if (currentAnimation === 'flow') {
      return 'animate-flow';
    }
    return '';
  }

  // Clases para el menú de opciones
  const optionsMenuClass = "absolute bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden min-w-[200px] text-xs fade-in z-50 pointer-events-auto";
  const optionButtonClass = "flex items-center justify-between w-full px-3 py-2 text-gray-600 hover:bg-gray-50";

  const pathClass = `${getStrokeAnimation()} pointer-events-none ${isSelected ? 'connection-selected' : ''}`;

  // Render traveling dot animation
  const renderTravelingDot = () => {
    if (currentAnimation !== 'traveling-dot' && 
        currentAnimation !== 'traveling-dot-fast' &&
        currentAnimation !== 'traveling-dot-fastest') return null;
    
    // Calcular posición actual del punto
    const { x, y } = getPointOnCurve(dotPosition);
    
    // Color basado en velocidad
    let dotColor = "#FF0000"; // Rojo para normal
    
    if (currentAnimation === 'traveling-dot-fast') {
      dotColor = "#FF9500"; // Naranja para 2x
    } else if (currentAnimation === 'traveling-dot-fastest') {
      dotColor = "#FFCB00"; // Amarillo para 4x
    }
    
    console.log(`Arrow ${id}: Rendering dot at position ${dotPosition}, coords: ${x}, ${y}`);
    
    return (
      <>
        {/* Punto grande para asegurar visibilidad */}
        <circle
          cx={x}
          cy={y}
          r={8} // Aumentado considerablemente
          fill={dotColor} // Color depende de la velocidad
          stroke="#FFFFFF" // Borde blanco para contrastar
          strokeWidth={2}
        />
        {/* Resplandor para mejor visibilidad */}
        <circle
          cx={x}
          cy={y}
          r={12}
          fill="none"
          stroke={dotColor}
          strokeWidth={1}
          opacity={0.5}
        />
      </>
    );
  };
  
  const handleMouseEnter = () => {
    // Ya no abrimos el menú flotante al hacer hover
    // setIsMenuOpen(true);
  };
  
  const handleMouseLeave = () => {
    // Ya no cerramos el menú flotante al quitar el hover
    // setIsMenuOpen(false);
  };
  
  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onSelect) {
      onSelect(id);
    }
    
    // Abrir el modal completo con un solo clic (antes abríamos el menú de opciones)
    setIsOptionsModalOpen(true);
    
    // Añadimos una clase al body para prevenir scroll cuando el modal está abierto
    document.body.classList.add('overflow-hidden');
    
    // Cerrar los submenús si están abiertos
    setIsAnimationsMenuOpen(false);
    setIsMenuOpen(false);
  };
  
  // Manejador para doble clic que ya no es necesario, pero lo mantenemos por compatibilidad
  const handleArrowDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Ya no abrimos el modal aquí, sino en el clic simple
  };

  // Al cerrar el modal, reestablecemos el scroll
  const closeModal = () => {
    setIsOptionsModalOpen(false);
    document.body.classList.remove('overflow-hidden');
  };

  // Efecto para cerrar el menú y el modal al hacer clic fuera
  useEffect(() => {
    // Función para detectar clics fuera del menú
    function handleClickOutside(event: MouseEvent) {
      // Si el menú de opciones está abierto y el clic fue fuera del menú
      if (isMenuOpen && 
          optionsMenuRef.current && 
          !optionsMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsAnimationsMenuOpen(false);
      }
      
      // Si el menú de animaciones está abierto y el clic fue fuera de ese menú
      if (isAnimationsMenuOpen && 
          animationsMenuRef.current && 
          !animationsMenuRef.current.contains(event.target as Node)) {
        setIsAnimationsMenuOpen(false);
      }
      
      // Si el modal de opciones está abierto y el clic fue fuera del modal
      if (isOptionsModalOpen && 
          modalRef.current && 
          !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    }
    
    // Agregar el event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Limpiar el event listener al desmontar
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isAnimationsMenuOpen, isOptionsModalOpen]);
  
  const getAnimationIcon = (anim: ArrowAnimation) => {
    switch (anim) {
      case 'none':
        return <span>⊘</span>;
      case 'pulse':
        return <span>⊙</span>;
      case 'flow':
        return <span>⇢</span>;
      case 'dash':
        return <span>⁃</span>;
      case 'traveling-dot':
      case 'traveling-dot-fast':
      case 'traveling-dot-fastest':
        return <span>•</span>;
      default:
        return <span>?</span>;
    }
  };
  
  // Log de las props calculadas antes de renderizar
  console.log(`Arrow ${id}: Calculated strokeWidth=${strokeWidth}, strokeDasharray='${getDashArray()}', pathAnimVariants=${getStrokeAnimation()}`);

  // Efecto para actualizar propiedades cuando cambian
  useEffect(() => {
    if (onPropertiesChange && (
      currentStyle !== style || 
      currentAnimation !== animation || 
      currentArrowHead !== endArrowHead
    )) {
      onPropertiesChange({
        style: currentStyle,
        animation: currentAnimation,
        endArrowHead: currentArrowHead
      });
    }
  }, [currentStyle, currentAnimation, currentArrowHead, style, animation, endArrowHead, onPropertiesChange]);

  // Manejadores para los botones de opciones
  const handleStyleChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Rotar entre los estilos de línea
    const styles: ArrowStyle[] = ['solid', 'dashed', 'dotted'];
    const currentIndex = styles.indexOf(currentStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    const nextStyle = styles[nextIndex];
    
    setCurrentStyle(nextStyle);
    
    if (onPropertiesChange) {
      onPropertiesChange({ style: nextStyle });
    }
    
    // No cerramos el menú para permitir más interacciones
  };

  const handleAnimationButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Alternar menú de animaciones sin cerrar el menú principal
    setIsAnimationsMenuOpen(!isAnimationsMenuOpen);
  };

  const handleAnimationSelect = (anim: ArrowAnimation) => (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setCurrentAnimation(anim);
    setIsAnimationsMenuOpen(false); // Cerrar el submenú
    
    if (onPropertiesChange) {
      onPropertiesChange({ animation: anim });
    }
    
    // No cerramos el menú principal para permitir más interacciones
  };

  const handleArrowHeadChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Rotar entre los tipos de punta de flecha
    const types: ArrowHeadType[] = ['none', 'arrow', 'circle', 'diamond'];
    const currentIndex = types.indexOf(currentArrowHead);
    const nextIndex = (currentIndex + 1) % types.length;
    const nextType = types[nextIndex];
    
    setCurrentArrowHead(nextType);
    
    if (onPropertiesChange) {
      onPropertiesChange({ endArrowHead: nextType });
    }
    
    // No cerramos el menú para permitir más interacciones
  };

  // Manejador para cambiar la punta de flecha inicial
  const handleStartArrowHeadChange = (type: ArrowHeadType) => {
    console.log(`Arrow ${id}: Start arrow head changed to ${type}`);
    setCurrentStartArrowHead(type);
    
    // Aplicamos los cambios inmediatamente
    if (onPropertiesChange) {
      onPropertiesChange({
        startArrowHead: type
      });
    }
  };

  // Manejador para eliminar la conexión
  const handleDelete = () => {
    // Confirmar antes de eliminar
    if (window.confirm('¿Estás seguro de que quieres eliminar esta conexión?')) {
      if (onDelete) {
        onDelete(id);
      }
    }
    
    // Cerrar menús después de eliminar o cancelar
    setIsMenuOpen(false);
    setIsOptionsModalOpen(false);
  };

  return (
    <div 
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: isOptionsModalOpen ? 25 : 5 }} // Eliminamos isMenuOpen de la condición
    >
      <svg 
        width="100%" 
        height="100%" 
        className="pointer-events-none" 
        overflow="visible"
        preserveAspectRatio="none"
      >
        {/* Trazo invisible más ancho para facilitar la selección - solo permite eventos en el propio trazo */}
        <path
          id={`arrow-path-${id}`}
          d={pathCommand}
          fill="none"
          stroke="transparent"
          strokeWidth={Math.max(strokeWidth + 10, 12)}
          style={{ cursor: 'pointer' }}
          className="pointer-events-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleArrowClick}
          onDoubleClick={handleArrowDoubleClick}
        />
        
        {/* Trazo visible de la flecha */}
        <path
          d={pathCommand}
          fill="none"
          stroke={isSelected ? hoverColor : baseColor} // Cambiamos para mostrar el color hover solo si está seleccionado
          strokeWidth={isSelected ? strokeWidth + 0.5 : strokeWidth} // Cambiamos para aumentar grosor solo si está seleccionado
          strokeDasharray={getDashArray()}
          className={pathClass}
          style={{ 
            transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
            filter: isSelected ? 'drop-shadow(0 0 2px rgba(0,0,0,0.1))' : 'none',
            pointerEvents: 'none'
          }}
        />
        
        {/* Flecha de inicio */}
        {arrowHeadStart && (
          <path
            d={arrowHeadStart}
            fill={isSelected ? hoverColor : baseColor} // Cambiamos para usar el color hover solo si está seleccionado
            strokeWidth="0"
            className={currentAnimation === 'pulse' ? 'pulsing' : ''}
            style={{ transition: 'fill 0.2s ease', pointerEvents: 'none' }}
          />
        )}
        
        {/* Flecha de fin */}
        {arrowHeadEnd && (
          <path
            d={arrowHeadEnd}
            fill={isSelected ? hoverColor : baseColor} // Cambiamos para usar el color hover solo si está seleccionado
            strokeWidth="0"
            className={currentAnimation === 'pulse' ? 'pulsing' : ''}
            style={{ transition: 'fill 0.2s ease', pointerEvents: 'none' }}
          />
        )}
        
        {/* Punto viajero para animación traveling-dot */}
        {(currentAnimation === 'traveling-dot' || 
          currentAnimation === 'traveling-dot-fast' || 
          currentAnimation === 'traveling-dot-fastest') && renderTravelingDot()}
      </svg>
      
      {/* Eliminamos el menú flotante que aparecía al hacer hover */}
      
      {/* Modal completo de opciones que ahora se muestra con un solo clic */}
      {isOptionsModalOpen && typeof window === 'object' && createPortal(
        <>
          {/* Estilos personalizados para la barra de desplazamiento */}
          <style>{scrollbarStyles}</style>
          
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] pointer-events-auto backdrop-blur-sm p-2 sm:p-4 md:p-6"
            onClick={closeModal} // Cierra al hacer clic en el backdrop
          >
            <motion.div 
              ref={modalRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 18, stiffness: 500, delay: 0.1 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl pointer-events-auto connection-modal flex flex-col max-h-[95vh] sm:max-h-[90vh]"
              onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal cierre el modal
            >
              {/* Cabecera fija */}
              <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg z-10">
                <motion.h3 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg sm:text-xl font-semibold text-gray-900"
                >
                  Opciones de conexión
                </motion.h3>
                <motion.button 
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  onClick={closeModal}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {/* Contenido con scroll */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar">
                {/* Vista previa de la conexión */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-gray-700">Vista previa de la conexión</h4>
                  </div>
                  
                  <div className="flex justify-center py-6">
                    <svg width="300" height="60" className="pointer-events-none">
                      {/* Previsualización de la línea con estilo actual */}
                      <path
                        d="M 50,30 C 100,30 200,30 250,30"
                        fill="none"
                        stroke={baseColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={getDashArray()}
                        className={getStrokeAnimation()}
                      />
                      
                      {/* Punta inicial */}
                      {currentStartArrowHead !== 'none' && (
                        <path
                          d={calculateArrowHead('left', 50, 30, true, currentStartArrowHead)}
                          fill={baseColor}
                          strokeWidth="0"
                        />
                      )}
                      
                      {/* Punta final */}
                      {currentArrowHead !== 'none' && (
                        <path
                          d={calculateArrowHead('right', 250, 30, false, currentArrowHead)}
                          fill={baseColor}
                          strokeWidth="0"
                        />
                      )}
                      
                      {/* Punto viajero para animación traveling-dot */}
                      {(currentAnimation === 'traveling-dot' || 
                        currentAnimation === 'traveling-dot-fast' || 
                        currentAnimation === 'traveling-dot-fastest') && (
                        <circle
                          cx={50 + dotPosition * 200}
                          cy={30}
                          r={5}
                          fill={currentAnimation === 'traveling-dot-fastest' ? "#FFCB00" : 
                                currentAnimation === 'traveling-dot-fast' ? "#FF9500" : "#FF0000"}
                          stroke="#FFFFFF"
                          strokeWidth={1}
                        />
                      )}
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Estilo:</span> {getStyleName(currentStyle)}
                    </div>
                    <div>
                      <span className="font-medium">Animación:</span> {getAnimationName(currentAnimation)}
                    </div>
                    <div>
                      <span className="font-medium">Punta inicial:</span> {getArrowHeadName(currentStartArrowHead)}
                    </div>
                    <div>
                      <span className="font-medium">Punta final:</span> {getArrowHeadName(currentArrowHead)}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Selector de estilo de línea */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Estilo de línea</label>
                    <div className="flex space-x-3">
                      {(['solid', 'dashed', 'dotted'] as ArrowStyle[]).map((styleOption) => (
                        <button
                          key={styleOption}
                          className={`flex-1 py-3 border rounded-md connection-option transition-colors ${currentStyle === styleOption ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
                          onClick={() => {
                            setCurrentStyle(styleOption);
                            if (onPropertiesChange) {
                              onPropertiesChange({ style: styleOption });
                            }
                          }}
                        >
                          <div className={`w-full mx-auto h-1 ${
                            styleOption === 'solid' ? 'bg-gray-700' : 
                            styleOption === 'dashed' ? 'border-t-2 border-dashed border-gray-700' : 
                            'border-t-2 border-dotted border-gray-700'
                          }`} />
                          <div className="text-sm mt-2 text-center">{getStyleName(styleOption)}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Selector de animación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Animación</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(['none', 'dash', 'traveling-dot', 'traveling-dot-fast', 'traveling-dot-fastest'] as ArrowAnimation[]).map((animOption) => (
                        <button
                          key={animOption}
                          className={`py-3 px-2 border rounded-md text-sm connection-option transition-colors ${currentAnimation === animOption ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
                          onClick={() => {
                            setCurrentAnimation(animOption);
                            if (onPropertiesChange) {
                              onPropertiesChange({ animation: animOption });
                            }
                          }}
                        >
                          <div className="flex items-center justify-center h-6 text-xl">
                            {getAnimationIcon(animOption)}
                          </div>
                          <div className="mt-2 text-center truncate">{getAnimationName(animOption)}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Selector de punta inicial */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Punta inicial</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(['none', 'arrow', 'circle', 'diamond'] as ArrowHeadType[]).map((headOption) => (
                        <button
                          key={headOption}
                          className={`py-3 px-2 border rounded-md connection-option transition-colors ${currentStartArrowHead === headOption ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
                          onClick={() => handleStartArrowHeadChange(headOption)}
                        >
                          <div className="flex items-center justify-center h-6 text-lg">
                            {headOption === 'none' ? '⊘' :
                             headOption === 'arrow' ? '←' :
                             headOption === 'circle' ? '◯' : '◇'}
                          </div>
                          <div className="text-sm mt-2 text-center">{getArrowHeadName(headOption)}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Selector de punta final */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Punta final</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(['none', 'arrow', 'circle', 'diamond'] as ArrowHeadType[]).map((headOption) => (
                        <button
                          key={headOption}
                          className={`py-3 px-2 border rounded-md connection-option transition-colors ${currentArrowHead === headOption ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
                          onClick={() => {
                            setCurrentArrowHead(headOption);
                            if (onPropertiesChange) {
                              onPropertiesChange({ endArrowHead: headOption });
                            }
                          }}
                        >
                          <div className="flex items-center justify-center h-6 text-lg">
                            {headOption === 'none' ? '⊘' :
                             headOption === 'arrow' ? '→' :
                             headOption === 'circle' ? '◯' : '◇'}
                          </div>
                          <div className="text-sm mt-2 text-center">{getArrowHeadName(headOption)}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sección para opciones adicionales en el futuro */}
                  <div className="border-t border-dashed border-gray-200 pt-5">
                    <div className="flex items-center gap-3 text-gray-500 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Espacio reservado para opciones adicionales</span>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Pie fijo */}
              <motion.div 
                className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 sticky bottom-0 rounded-b-lg z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <motion.button
                    className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    onClick={handleDelete}
                    title="Eliminar esta conexión"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Eliminar
                  </motion.button>
                  
                  <div className="flex space-x-3 justify-end">
                    <motion.button
                      className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                      onClick={closeModal}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        // Aplicar todos los cambios
                        if (onPropertiesChange) {
                          onPropertiesChange({
                            style: currentStyle,
                            animation: currentAnimation,
                            startArrowHead: currentStartArrowHead,
                            endArrowHead: currentArrowHead
                          });
                        }
                        closeModal();
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Aplicar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>,
        document.body
      )}
    </div>
  );
}

// Función para obtener el nombre legible de las animaciones
function getAnimationName(animation: ArrowAnimation): string {
  switch (animation) {
    case 'none': return 'Ninguna';
    case 'pulse': return 'Pulso';
    case 'flow': return 'Flujo';
    case 'dash': return 'Líneas';
    case 'traveling-dot': return 'Punto';
    case 'traveling-dot-fast': return 'Punto rápido';
    case 'traveling-dot-fastest': return 'Punto veloz';
    default: return 'Desconocida';
  }
}

// Función para obtener el nombre legible del estilo de línea
function getStyleName(style: ArrowStyle): string {
  switch (style) {
    case 'solid': return 'Sólida';
    case 'dashed': return 'Rayada';
    case 'dotted': return 'Punteada';
    default: return 'Desconocida';
  }
}

// Función para obtener el nombre legible del tipo de punta de flecha
function getArrowHeadName(arrowHead: ArrowHeadType): string {
  switch (arrowHead) {
    case 'none': return 'Ninguna';
    case 'arrow': return 'Flecha';
    case 'circle': return 'Círculo';
    case 'diamond': return 'Diamante';
    default: return 'Desconocida';
  }
}
