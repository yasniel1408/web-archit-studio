"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ConnectionPosition } from '@/app/components/atoms/connection-point/connection-point';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

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
  const [currentStyle, setCurrentStyle] = useState<ArrowStyle>(style);
  const [currentAnimation, setCurrentAnimation] = useState<ArrowAnimation>(animation);
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
    
    // Inicializar puntos de control en los puntos de inicio/fin exactos
    // para garantizar que la curva comience y termine exactamente en los puntos dados
    let controlPoint1X = startX;
    let controlPoint1Y = startY;
    let controlPoint2X = endX;
    let controlPoint2Y = endY;
    
    // Ajustar punto de control según la posición de inicio - manteniendo el punto de partida exacto
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
    
    // Ajustar punto de control según la posición final - manteniendo el punto final exacto
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
    // ajustar para evitar curvas demasiado planas, pero mantener los extremos exactos
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
    
    // Dirección según el punto de conexión - Corregir para que apunte correctamente
    let dx = 0;
    let dy = 0;
    
    switch (position) {
      case 'top':
        dy = 1; // Apuntar hacia abajo (hacia el nodo)
        break;
      case 'right':
        dx = -1; // Apuntar hacia la izquierda (hacia el nodo)
        break;
      case 'bottom':
        dy = -1; // Apuntar hacia arriba (hacia el nodo)
        break;
      case 'left':
        dx = 1; // Apuntar hacia la derecha (hacia el nodo)
        break;
    }
    
    // Incrementamos el tamaño para mayor visibilidad
    const arrowSize = 18; // Aumentado de 14 a 18 para mayor visibilidad
    const angle = Math.atan2(dy, dx);
    
    // Aseguramos que el punto exacto sea el extremo de la línea
    const exactX = x;
    const exactY = y;
    
    // Render arrowhead based on type
    switch (type) {
      case 'arrow': {
        // Puntos para la punta de flecha clásica - optimizada para mejor estética
        // Modificamos los ángulos para una flecha más estilizada
        const point1 = {
          x: exactX - arrowSize * Math.cos(angle - Math.PI/5),
          y: exactY - arrowSize * Math.sin(angle - Math.PI/5)
        };
        
        const point2 = {
          x: exactX - arrowSize * Math.cos(angle + Math.PI/5),
          y: exactY - arrowSize * Math.sin(angle + Math.PI/5)
        };
        
        return (
          <polygon 
            points={`${exactX},${exactY} ${point1.x},${point1.y} ${point2.x},${point2.y}`} 
            fill={color}
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            style={{
              zIndex: 60, 
              filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.2))'
            }}
            data-animation={currentAnimation}
            key={`${id}-arrowhead-${type}`}
          />
        );
      }
      
      case 'circle': {
        return (
          <circle 
            cx={exactX} 
            cy={exactY} 
            r={arrowSize/2} 
            fill={color}
            stroke={color}
            strokeWidth="2"
            style={{
              zIndex: 60,
              filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.2))'
            }}
            data-animation={currentAnimation}
            key={`${id}-arrowhead-${type}`}
          />
        );
      }
      
      case 'diamond': {
        // Puntos para un diamante - ajustados para mejor apariencia
        const diamondSize = arrowSize * 0.8; // Ajuste del tamaño para mejor proporción
        
        const point1 = {
          x: exactX - diamondSize * Math.cos(angle),
          y: exactY - diamondSize * Math.sin(angle)
        };
        
        const point2 = {
          x: exactX - diamondSize * Math.cos(angle - Math.PI/2),
          y: exactY - diamondSize * Math.sin(angle - Math.PI/2)
        };
        
        const point3 = {
          x: exactX - diamondSize * Math.cos(angle - Math.PI),
          y: exactY - diamondSize * Math.sin(angle - Math.PI)
        };
        
        const point4 = {
          x: exactX - diamondSize * Math.cos(angle - 3*Math.PI/2),
          y: exactY - diamondSize * Math.sin(angle - 3*Math.PI/2)
        };
        
        return (
          <polygon 
            points={`${point1.x},${point1.y} ${point2.x},${point2.y} ${point3.x},${point3.y} ${point4.x},${point4.y}`} 
            fill={color}
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            style={{
              zIndex: 60,
              filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.2))'
            }}
            data-animation={currentAnimation}
            key={`${id}-arrowhead-${type}`}
          />
        );
      }
      
      default:
        return null;
    }
  };
  
  // Obtener color base y calcular color de hover
  const baseColor = useMemo(() => {
    return isSelected ? "#3B82F6" : color || '#000000';
  }, [isSelected, color]);
  
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
  
  const [currentColor, setCurrentColor] = useState<string>(color);
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState<number>(strokeWidth);
  
  // Update state when props change
  useEffect(() => {
    setCurrentColor(color);
    setCurrentStrokeWidth(strokeWidth);
  }, [color, strokeWidth]);
  
  // Calcular camino de la Bezier
  const { controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y } = getBezierControlPoints();
  const pathCommand = `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`;

  // Calcular cabezas de flecha
  const arrowHeadStart = startArrowHead !== 'none' ? calculateArrowHead(startPosition, startX, startY, true, startArrowHead) : null;
  const arrowHeadEnd = currentArrowHead !== 'none' ? calculateArrowHead(endPosition, endX, endY, false, currentArrowHead) : null;

  // Función auxiliar para calcular path de cabeza de flecha
  function calculateArrowHead(position: ConnectionPosition, x: number, y: number, isStart: boolean, type: ArrowHeadType): string {
    // Dirección según el punto de conexión - Corregir para que apunte correctamente
    let dx = 0;
    let dy = 0;
    
    switch (position) {
      case 'top':
        dy = 1; // Apuntar hacia abajo (hacia el nodo)
        break;
      case 'right':
        dx = -1; // Apuntar hacia la izquierda (hacia el nodo)
        break;
      case 'bottom':
        dy = -1; // Apuntar hacia arriba (hacia el nodo)
        break;
      case 'left':
        dx = 1; // Apuntar hacia la derecha (hacia el nodo)
        break;
    }
    
    // Mantener coherencia con el tamaño en getArrowHead
    const arrowSize = 18;
    const angle = Math.atan2(dy, dx);
    
    // Aseguramos que el punto exacto sea el extremo de la línea
    const exactX = x;
    const exactY = y;
    
    switch (type) {
      case 'arrow': {
        const point1 = {
          x: exactX - arrowSize * Math.cos(angle - Math.PI/5),
          y: exactY - arrowSize * Math.sin(angle - Math.PI/5)
        };
        
        const point2 = {
          x: exactX - arrowSize * Math.cos(angle + Math.PI/5),
          y: exactY - arrowSize * Math.sin(angle + Math.PI/5)
        };
        
        return `M ${exactX},${exactY} L ${point1.x},${point1.y} L ${point2.x},${point2.y} Z`;
      }
      case 'circle': {
        // Aumentamos el tamaño y mejoramos el trazo para circle
        return `M ${exactX},${exactY} m ${-arrowSize/2},0 a ${arrowSize/2},${arrowSize/2} 0 1,0 ${arrowSize},0 a ${arrowSize/2},${arrowSize/2} 0 1,0 ${-arrowSize},0`;
      }
      case 'diamond': {
        // Ajustamos el tamaño y proporciones del diamante para mejor estética
        const diamondSize = arrowSize * 0.8; // Ajuste del tamaño para mejor proporción
        
        const point1 = {
          x: exactX - diamondSize * Math.cos(angle),
          y: exactY - diamondSize * Math.sin(angle)
        };
        
        const point2 = {
          x: exactX - diamondSize * Math.cos(angle - Math.PI/2),
          y: exactY - diamondSize * Math.sin(angle - Math.PI/2)
        };
        
        const point3 = {
          x: exactX - diamondSize * Math.cos(angle - Math.PI),
          y: exactY - diamondSize * Math.sin(angle - Math.PI)
        };
        
        const point4 = {
          x: exactX - diamondSize * Math.cos(angle - 3*Math.PI/2),
          y: exactY - diamondSize * Math.sin(angle - 3*Math.PI/2)
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

  // Obtener atributo de animación para la exportación GIF
  function getAnimationAttribute(): string {
    return currentAnimation !== 'none' ? currentAnimation : '';
  }

  // Clases para el menú de opciones
  const optionsMenuClass = "absolute bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden min-w-[200px] text-xs fade-in z-50 pointer-events-auto";
  const optionButtonClass = "flex items-center justify-between w-full px-3 py-2 text-gray-600 hover:bg-gray-50";

  const pathClass = `${getStrokeAnimation()} pointer-events-none ${isSelected ? 'connection-selected' : ''}`;

  // Renderizar punto viajero para las animaciones de tipo traveling-dot
  const renderTravelingDot = () => {
    if (currentAnimation !== 'traveling-dot' && 
        currentAnimation !== 'traveling-dot-fast' && 
        currentAnimation !== 'traveling-dot-fastest') {
      return null;
    }
    
    // Calcular la posición del punto en la curva
    const dotPos = getPointOnCurve(dotPosition);
    
    // Determinar color del punto basado en la velocidad
    let dotColor = baseColor;
    if (currentAnimation === 'traveling-dot-fast') {
      dotColor = '#4F46E5'; // Índigo para velocidad rápida
    } else if (currentAnimation === 'traveling-dot-fastest') {
      dotColor = '#EF4444'; // Rojo para velocidad muy rápida
    }
    
    // Aumentar el tamaño del punto para mayor visibilidad
    const dotSize = strokeWidth * 2.5; // Aumentamos considerablemente el tamaño del punto
    const shadowSize = dotSize + 2; // Sombra ligeramente más grande que el punto
    
    return (
      <>
        {/* Sombra del punto para mejor visibilidad */}
        <circle
          cx={dotPos.x}
          cy={dotPos.y}
          r={shadowSize}
          fill="#FFFFFF"
          opacity={0.6}
          style={{ zIndex: 45 }}
          data-animation={currentAnimation}
          className="traveling-dot-shadow"
        />
        {/* Punto principal */}
        <circle
          cx={dotPos.x}
          cy={dotPos.y}
          r={dotSize}
          fill={dotColor}
          style={{ 
            zIndex: 50,
            filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.3))'
          }}
          data-animation={currentAnimation}
          className="traveling-dot"
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

  // Actualizar estado local cuando cambian las props
  useEffect(() => {
    // Sincronizar estado local con las props
    if (style !== currentStyle) setCurrentStyle(style);
    if (animation !== currentAnimation) setCurrentAnimation(animation);
    if (endArrowHead !== currentArrowHead) setCurrentArrowHead(endArrowHead);
    if (startArrowHead !== currentStartArrowHead) setCurrentStartArrowHead(startArrowHead);
    
    console.log(`Arrow ${id}: Props actualizadas - style=${style}, animation=${animation}, startArrowHead=${startArrowHead}, endArrowHead=${endArrowHead}`);
  }, [id, style, animation, startArrowHead, endArrowHead]);

  // Efecto para actualizar propiedades cuando cambian
  useEffect(() => {
    if (onPropertiesChange && (
      currentStyle !== style || 
      currentAnimation !== animation || 
      currentArrowHead !== endArrowHead ||
      currentStartArrowHead !== startArrowHead
    )) {
      console.log(`Arrow ${id}: Enviando cambios al componente padre - style=${currentStyle}, animation=${currentAnimation}, startArrowHead=${currentStartArrowHead}, endArrowHead=${currentArrowHead}`);
      
      onPropertiesChange({
        style: currentStyle,
        animation: currentAnimation,
        endArrowHead: currentArrowHead,
        startArrowHead: currentStartArrowHead
      });
    }
  }, [currentStyle, currentAnimation, currentArrowHead, currentStartArrowHead, style, animation, endArrowHead, startArrowHead, onPropertiesChange, id]);

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

  // Calcular clase y estilo para la flecha principal
  const getArrowClass = () => {
    let classes = pathClass;
    return classes;
  };

  // Calcular estilo para la flecha principal
  const getArrowStyle = () => {
    const styles: React.CSSProperties = { 
      transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
      filter: isSelected 
        ? 'drop-shadow(0 0 3px rgba(0,0,0,0.3))' 
        : 'drop-shadow(0 0 2px rgba(0,0,0,0.2))',
      pointerEvents: 'none',
      zIndex: 40
    };
    
    return styles;
  };
  
  // Generar el path para la curva de Bezier
  const getBezierPath = (sX: number, sY: number, eX: number, eY: number, 
                         sPos: ConnectionPosition, ePos: ConnectionPosition): string => {
    const { controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y } = getBezierControlPoints();
    return `M ${sX} ${sY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${eX} ${eY}`;
  };
  
  // Calcular punto en la curva de Bezier usando un parámetro t
  const getPointOnPath = (pathStr: string, t: number) => {
    return getPointOnCurve(t);
  };

  // Generar path para la curva de Bezier
  const path = useMemo(() => {
    return getBezierPath(startX, startY, endX, endY, startPosition, endPosition);
  }, [startX, startY, endX, endY, startPosition, endPosition]);
  
  // Obtener puntos medios para posicionar el menú contextual
  const { midX, midY } = useMemo(() => {
    const pathMiddle = path.split('C')[1].split(' ');
    const x = parseFloat(pathMiddle[pathMiddle.length-2]);
    const y = parseFloat(pathMiddle[pathMiddle.length-1]);
    return { midX: x, midY: y };
  }, [path]);

  // Función para manejar el cambio en las propiedades
  const handlePropertyChange = (property: string, value: string | number | boolean) => {
    switch (property) {
      case 'style':
        setCurrentStyle(value as ArrowStyle);
        break;
      case 'animation':
        setCurrentAnimation(value as ArrowAnimation);
        break;
      case 'startArrowHead':
        setCurrentStartArrowHead(value as ArrowHeadType);
        break;
      case 'endArrowHead':
        setCurrentArrowHead(value as ArrowHeadType);
        break;
      case 'color':
        setCurrentColor(value as string);
        break;
      case 'strokeWidth':
        setCurrentStrokeWidth(value as number);
        break;
    }
    
    // Notificar cambios al componente padre
    if (onPropertiesChange) {
      const properties: Record<string, any> = {};
      properties[property] = value;
      onPropertiesChange(properties);
    }
  };

  // Clases para la apariencia de la línea
  const getPathClasses = () => {
    let classes = "arrow-path transition-all duration-200 ";
    
    // Animaciones basadas en el estilo
    switch (currentAnimation) {
      case 'pulse':
        classes += "animate-pulse ";
        break;
      case 'flow':
        classes += "animate-flow ";
        break;
      case 'dash':
        classes += "animate-dash ";
        break;
      default:
        break;
    }
    
    return classes;
  };
  
  // Estilos para la apariencia de la línea
  const getPathStyles = () => {
    let dashArray = "none";
    
    switch (currentStyle) {
      case 'dashed':
        dashArray = "6,4";
        break;
      case 'dotted':
        dashArray = "1,5";
        break;
      default:
        dashArray = "none";
    }
    
    return {
      stroke: currentColor,
      strokeWidth: currentStrokeWidth,
      strokeDasharray: dashArray,
      strokeLinecap: 'round',
      fill: 'none',
      cursor: 'pointer',
    };
  };

  return (
    <div 
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: isOptionsModalOpen ? 25 : 15 }} // Aumentamos el z-index base
    >
      <svg 
        width="100%" 
        height="100%" 
        className={`pointer-events-none absolute top-0 left-0 ${isSelected ? 'z-40' : 'z-35'}`}
        style={{ 
          overflow: 'visible',
          filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))'
        }}
        preserveAspectRatio="none"
      >
        {/* Área invisible más ancha para facilitar clic/interacción */}
        <path
          id={`arrow-path-${id}`}
          d={path}
          stroke="transparent"
          strokeWidth={Math.max(strokeWidth + 14, 18)}
          fill="none"
          style={{ cursor: 'pointer', pointerEvents: 'stroke', zIndex: 30 }}
          className="pointer-events-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleArrowClick}
          onDoubleClick={handleArrowDoubleClick}
        />
        
        {/* Efecto de resplandor/sombra para la flecha */}
        <path
          d={path}
          fill="none"
          stroke="#ffffff"
          strokeWidth={isSelected ? strokeWidth + 3 : strokeWidth + 2} 
          strokeOpacity="0.5"
          strokeDasharray={getDashArray()}
          style={{ 
            pointerEvents: 'none',
            zIndex: 39
          }}
        />
        
        {/* Trazo visible de la flecha - Línea más fina */}
        <path
          d={path}
          fill="none"
          stroke={isSelected ? hoverColor : baseColor}
          strokeWidth={isSelected ? strokeWidth + 0.5 : strokeWidth} // Línea más fina
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={getDashArray()}
          className={getArrowClass()}
          data-animation={getAnimationAttribute()}
          style={getArrowStyle()}
        />
        
        {/* Grupo de primer plano para los elementos animados y flechas */}
        <g style={{ zIndex: 50 }}>
          {/* Flecha de inicio */}
          {arrowHeadStart && (
            <path
              d={arrowHeadStart}
              fill={isSelected ? hoverColor : baseColor}
              stroke={isSelected ? hoverColor : baseColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
              className={currentAnimation === 'pulse' ? 'pulsing' : ''}
              data-animation={currentAnimation}
              style={{ 
                transition: 'fill 0.2s ease', 
                pointerEvents: 'none', 
                zIndex: 55
              }}
            />
          )}
          
          {/* Flecha de fin */}
          {arrowHeadEnd && (
            <path
              d={arrowHeadEnd}
              fill={isSelected ? hoverColor : baseColor}
              stroke={isSelected ? hoverColor : baseColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
              className={currentAnimation === 'pulse' ? 'pulsing' : ''}
              data-animation={currentAnimation}
              style={{ 
                transition: 'fill 0.2s ease', 
                pointerEvents: 'none', 
                zIndex: 55
              }}
            />
          )}
          
          {/* Punto viajero para animación traveling-dot */}
          {(currentAnimation === 'traveling-dot' || 
            currentAnimation === 'traveling-dot-fast' || 
            currentAnimation === 'traveling-dot-fastest') && renderTravelingDot()}
        </g>
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
                          d={calculateArrowHead('right', 50, 30, true, currentStartArrowHead)}
                          fill={baseColor}
                          strokeWidth="0"
                        />
                      )}
                      
                      {/* Punta final */}
                      {currentArrowHead !== 'none' && (
                        <path
                          d={calculateArrowHead('left', 250, 30, false, currentArrowHead)}
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
                                currentAnimation === 'traveling-dot-fast' ? "#FF9500" : "#000000"}
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
                          onClick={() => {
                            setCurrentStartArrowHead(headOption);
                            if (onPropertiesChange) {
                              onPropertiesChange({ startArrowHead: headOption });
                            }
                          }}
                        >
                          <div className="flex items-center justify-center h-6">
                            {headOption === 'none' ? (
                              <div className="w-6 h-0.5 bg-gray-300"></div>
                            ) : headOption === 'arrow' ? (
                              <svg width="24" height="10" viewBox="0 0 24 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 5H22M22 5L18 1M22 5L18 9" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            ) : headOption === 'circle' ? (
                              <svg width="24" height="10" viewBox="0 0 24 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="5" cy="5" r="4" fill="currentColor"/>
                                <line x1="5" y1="5" x2="22" y2="5" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            ) : (
                              <svg width="24" height="10" viewBox="0 0 24 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 5H22M4 1L0 5L4 9" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            )}
                          </div>
                          <div className="mt-2 text-center text-xs">{getArrowHeadName(headOption)}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Selector de punta final */}
                  <div className="mt-6">
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
                          <div className="flex items-center justify-center h-6">
                            {/* Icono representativo de la punta */}
                            {headOption === 'none' && <span className="h-1 w-16 bg-gray-700"></span>}
                            {headOption === 'arrow' && <span className="text-lg">→</span>}
                            {headOption === 'circle' && <span className="text-lg">◯</span>}
                            {headOption === 'diamond' && <span className="text-lg">♦</span>}
                          </div>
                          <div className="text-sm mt-2 text-center">{getArrowHeadName(headOption)}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Botón para eliminar la conexión */}
                  {onDelete && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-8 border-t pt-6 border-gray-200"
                    >
                      <button
                        onClick={handleDelete}
                        className="w-full flex items-center justify-center py-2.5 px-4 bg-red-50 text-red-600 rounded-md border border-red-200 hover:bg-red-100 transition-colors font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                        Eliminar conexión
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      , document.body)}
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