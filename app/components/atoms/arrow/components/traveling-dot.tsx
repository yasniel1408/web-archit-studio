import React from 'react';
import { ArrowAnimation } from '../types';

interface TravelingDotProps {
  dotPosition: number;
  x: number;
  y: number;
  strokeWidth: number;
  animation: ArrowAnimation;
  baseColor: string;
  getDotColor?: (baseColor: string) => string;
}

export const TravelingDot: React.FC<TravelingDotProps> = ({
  dotPosition,
  x,
  y,
  strokeWidth,
  animation,
  baseColor,
  getDotColor = (color) => color
}) => {
  if (animation !== 'traveling-dot' && 
      animation !== 'traveling-dot-fast' && 
      animation !== 'traveling-dot-fastest') {
    return null;
  }
  
  // Determinar color del punto basado en la velocidad
  const dotColor = getDotColor(baseColor);
  
  // Aumentar el tamaño del punto para mayor visibilidad
  const dotSize = strokeWidth * 2.5;
  const shadowSize = dotSize + 2; // Sombra ligeramente más grande que el punto
  
  return (
    <>
      {/* Sombra del punto para mejor visibilidad */}
      <circle
        cx={x}
        cy={y}
        r={shadowSize}
        fill="#FFFFFF"
        opacity={0.6}
        style={{ zIndex: 45 }}
        data-animation={animation}
        className="traveling-dot-shadow"
      />
      {/* Punto principal */}
      <circle
        cx={x}
        cy={y}
        r={dotSize}
        fill={dotColor}
        style={{ 
          zIndex: 50,
          filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.3))'
        }}
        data-animation={animation}
        className="traveling-dot"
      />
    </>
  );
}; 