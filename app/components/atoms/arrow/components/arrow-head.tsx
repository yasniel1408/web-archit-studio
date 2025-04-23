import React from 'react';
import { ArrowHeadProps } from '../types';

export const ArrowHead: React.FC<ArrowHeadProps> = ({
  position,
  x,
  y,
  isStart,
  type,
  color,
  animation,
  id
}) => {
  if (type === 'none') return null;
  
  // Dirección según el punto de conexión
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
  
  // Tamaño para mejor visibilidad
  const arrowSize = 18;
  const angle = Math.atan2(dy, dx);
  
  // Punto exacto en el extremo de la línea
  const exactX = x;
  const exactY = y;
  
  // Render arrowhead based on type
  switch (type) {
    case 'arrow': {
      // Puntos para la punta de flecha estilizada
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
          data-animation={animation}
          key={`${id}-arrowhead-${type}-${isStart ? 'start' : 'end'}`}
          className={animation === 'pulse' ? 'pulsing' : ''}
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
          data-animation={animation}
          key={`${id}-arrowhead-${type}-${isStart ? 'start' : 'end'}`}
          className={animation === 'pulse' ? 'pulsing' : ''}
        />
      );
    }
    
    case 'diamond': {
      // Puntos para un diamante con mejores proporciones
      const diamondSize = arrowSize * 0.8;
      
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
          data-animation={animation}
          key={`${id}-arrowhead-${type}-${isStart ? 'start' : 'end'}`}
          className={animation === 'pulse' ? 'pulsing' : ''}
        />
      );
    }
    
    default:
      return null;
  }
}; 