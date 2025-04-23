import { useState, useEffect } from 'react';
import { NodeType, MinimapBounds } from '../types';

/**
 * Hook para calcular y gestionar los límites del diagrama en el minimapa
 */
export function useMinimapBounds(nodes: NodeType[]): MinimapBounds {
  const [bounds, setBounds] = useState<MinimapBounds>({ 
    minX: 0, 
    minY: 0, 
    maxX: 0, 
    maxY: 0, 
    width: 0, 
    height: 0 
  });
  
  useEffect(() => {
    if (nodes.length === 0) return;
    
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    // Encontrar los límites del diagrama basados en las posiciones de los nodos
    nodes.forEach(node => {
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + node.size.width);
      maxY = Math.max(maxY, node.position.y + node.size.height);
    });
    
    // Añadir margen extra para poder ver más contexto
    const margin = 10;
    minX -= margin;
    minY -= margin;
    maxX += margin;
    maxY += margin;
    
    setBounds({
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY
    });
  }, [nodes]);
  
  return bounds;
} 