"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ConnectionPosition } from '@/app/components/atoms/connection-point/connection-point';
import { motion } from 'framer-motion';
import { 
  PaintBrushIcon, 
  Square2StackIcon, 
  ArrowPathIcon,
  CheckIcon
} from '@heroicons/react/24/solid';

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
  onPropertiesChange
}: ArrowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimationsMenuOpen, setIsAnimationsMenuOpen] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<ArrowStyle>(style || 'solid');
  const [currentAnimation, setCurrentAnimation] = useState<ArrowAnimation>(animation || 'none');
  const [currentArrowHead, setCurrentArrowHead] = useState<ArrowHeadType>(endArrowHead || 'arrow');
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const animationsMenuRef = useRef<HTMLDivElement>(null);
  
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
    const controlDistance = Math.min(distance * 0.5, 100);
    
    let controlPoint1X = startX;
    let controlPoint1Y = startY;
    let controlPoint2X = endX;
    let controlPoint2Y = endY;
    
    // Ajustar punto de control según la posición de inicio
    switch (startPosition) {
      case 'top':
        controlPoint1Y -= controlDistance;
        break;
      case 'right':
        controlPoint1X += controlDistance;
        break;
      case 'bottom':
        controlPoint1Y += controlDistance;
        break;
      case 'left':
        controlPoint1X -= controlDistance;
        break;
    }
    
    // Ajustar punto de control según la posición final
    switch (endPosition) {
      case 'top':
        controlPoint2Y -= controlDistance;
        break;
      case 'right':
        controlPoint2X += controlDistance;
        break;
      case 'bottom':
        controlPoint2Y += controlDistance;
        break;
      case 'left':
        controlPoint2X -= controlDistance;
        break;
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
    }
    return '';
  }

  // Clases para el menú de opciones
  const optionsMenuClass = "absolute bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden min-w-[200px] text-xs fade-in z-50 pointer-events-auto";
  const optionButtonClass = "flex items-center justify-between w-full px-3 py-2 text-gray-600 hover:bg-gray-50";

  const pathClass = `${getStrokeAnimation()} pointer-events-none`;

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
    setIsMenuOpen(true);
  };
  
  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };
  
  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Arrow ${id}: Arrow clicked. Opening menu.`);
    setIsMenuOpen(true);
    if (onSelect) {
      onSelect(id);
    }
  };
  
  // Efecto para cerrar el menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Si el menú principal está abierto y se hace clic fuera de él
      if (isMenuOpen && optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
        // Revisar si el clic fue en la propia flecha (para evitar cerrar inmediatamente)
        const svgElement = document.getElementById(`arrow-path-${id}`);
        if (svgElement && svgElement.contains(event.target as Node)) {
          return; // No cerrar si se hace clic en la flecha
        }
        
        setIsMenuOpen(false);
        setIsAnimationsMenuOpen(false);
      }
      // Si solo el menú de animaciones está abierto y se hace clic fuera
      else if (isAnimationsMenuOpen && animationsMenuRef.current && 
               !animationsMenuRef.current.contains(event.target as Node)) {
        setIsAnimationsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isAnimationsMenuOpen, id]);
  
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
    // Rotar entre los diferentes estilos de línea
    const styles: ArrowStyle[] = ['solid', 'dashed', 'dotted'];
    const currentIndex = styles.indexOf(currentStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    
    console.log(`Arrow ${id}: Style changed to ${styles[nextIndex]}`);
    setCurrentStyle(styles[nextIndex]);
    
    // Si la animación era de recorrido, la quitamos al cambiar el estilo manualmente
    if (currentAnimation === 'traveling-dot' || 
        currentAnimation === 'traveling-dot-fast' || 
        currentAnimation === 'traveling-dot-fastest') {
      setCurrentAnimation('none');
    }
  };

  const handleAnimationButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimationsMenuOpen(prev => !prev); // Toggle visibility
    console.log(`Arrow ${id}: Animations menu toggled. Visible: ${!isAnimationsMenuOpen}`);
  };

  const handleAnimationSelect = (anim: ArrowAnimation) => (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Arrow ${id}: Selecting animation: ${anim}. Previous: ${currentAnimation}`);
    setCurrentAnimation(anim);
    
    // No cerramos el menú principal al seleccionar una animación
    setIsAnimationsMenuOpen(false);
    
    // Aplicamos los cambios inmediatamente
    if (onPropertiesChange) {
      onPropertiesChange({
        animation: anim
      });
    }
  };

  const handleArrowHeadChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Rotar entre los diferentes tipos de punta de flecha
    const arrowHeads: ArrowHeadType[] = ['arrow', 'circle', 'diamond', 'none'];
    const currentIndex = arrowHeads.indexOf(currentArrowHead);
    const nextIndex = (currentIndex + 1) % arrowHeads.length;
    
    console.log(`Arrow ${id}: Arrow head changed to ${arrowHeads[nextIndex]}`);
    setCurrentArrowHead(arrowHeads[nextIndex]);
    
    // Aplicamos los cambios inmediatamente
    if (onPropertiesChange) {
      onPropertiesChange({
        endArrowHead: arrowHeads[nextIndex]
      });
    }
  };

  return (
    <div 
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: isMenuOpen ? 25 : 5 }}
    >
      <svg 
        width="100%" 
        height="100%" 
        className="pointer-events-none" 
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
        />
        
        {/* Trazo visible de la flecha */}
        <path
          d={pathCommand}
          fill="none"
          stroke={isMenuOpen ? hoverColor : baseColor}
          strokeWidth={isMenuOpen ? strokeWidth + 0.5 : strokeWidth}
          strokeDasharray={getDashArray()}
          className={pathClass}
          style={{ 
            transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
            filter: isMenuOpen ? 'drop-shadow(0 0 2px rgba(0,0,0,0.1))' : 'none',
            pointerEvents: 'none'
          }}
        />
        
        {/* Flecha de inicio */}
        {arrowHeadStart && (
          <path
            d={arrowHeadStart}
            fill={isMenuOpen ? hoverColor : baseColor}
            strokeWidth="0"
            className={currentAnimation === 'pulse' ? 'pulsing' : ''}
            style={{ transition: 'fill 0.2s ease', pointerEvents: 'none' }}
          />
        )}
        
        {/* Flecha de fin */}
        {arrowHeadEnd && (
          <path
            d={arrowHeadEnd}
            fill={isMenuOpen ? hoverColor : baseColor}
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
      
      {/* Renderizado del menú de opciones - asegurar pointer-events correcto */}
      {isMenuOpen && (
        <div 
          ref={optionsMenuRef}
          className={optionsMenuClass} 
          style={{ 
            left: (Math.max(startX, endX) + Math.min(startX, endX)) / 2, 
            top: (Math.max(startY, endY) + Math.min(startY, endY)) / 2,
            zIndex: 100, // Asegurar que está por encima de todo
            pointerEvents: 'auto' // Importante: permitir interacciones con el menú
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            <button 
              className={optionButtonClass}
              onClick={handleStyleChange}
            >
              <span>Estilo de línea: <strong>{getStyleName(currentStyle)}</strong></span>
              <ArrowPathIcon className="h-4 w-4" />
            </button>
            
            <div className="relative">
              <button 
                className={optionButtonClass}
                onClick={handleAnimationButtonClick}
              >
                <span>Animación: <strong>{getAnimationName(currentAnimation)}</strong></span>
                <ArrowPathIcon className={`h-4 w-4 transform ${isAnimationsMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAnimationsMenuOpen && (
                <div 
                  ref={animationsMenuRef}
                  className="absolute left-0 top-full bg-white rounded-md shadow-lg border border-gray-200 w-full z-10 pointer-events-auto"
                >
                  {['none', 'dash', 'traveling-dot', 'traveling-dot-fast', 'traveling-dot-fastest'].map((anim) => (
                    <button 
                      key={anim}
                      className={`${optionButtonClass} ${currentAnimation === anim ? 'bg-blue-50 text-blue-600' : ''}`}
                      onClick={handleAnimationSelect(anim as ArrowAnimation)}
                    >
                      <span>{getAnimationName(anim as ArrowAnimation)}</span>
                      {currentAnimation === anim && (
                        <CheckIcon className="h-4 w-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              className={optionButtonClass}
              onClick={handleArrowHeadChange}
            >
              <span>Punta de flecha: <strong>{getArrowHeadName(currentArrowHead)}</strong></span>
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
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
