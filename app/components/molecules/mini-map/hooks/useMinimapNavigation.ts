import { useState, useCallback } from 'react';
import { MinimapBounds } from '../types';

type NavigationConfig = {
  bounds: MinimapBounds;
  scale: number;
  viewportSize: { width: number; height: number };
  canvasRef: React.RefObject<HTMLCanvasElement>;
  mapWidth: number;
  mapHeight: number;
  zoomOutFactor: number;
};

/**
 * Hook para gestionar la navegación al hacer clic en el minimapa
 */
export function useMinimapNavigation({
  bounds,
  scale,
  viewportSize,
  canvasRef,
  mapWidth,
  mapHeight,
  zoomOutFactor
}: NavigationConfig) {
  const [isDragging, setIsDragging] = useState(false);
  
  const calculateMiniMapScale = useCallback(() => {
    const scaleX = (mapWidth / bounds.width) * zoomOutFactor;
    const scaleY = (mapHeight / bounds.height) * zoomOutFactor;
    return Math.min(scaleX, scaleY);
  }, [bounds.width, bounds.height, mapWidth, mapHeight, zoomOutFactor]);
  
  const calculateOffset = useCallback(() => {
    const minimapScale = calculateMiniMapScale();
    const offsetX = (mapWidth - bounds.width * minimapScale) / 2;
    const offsetY = (mapHeight - bounds.height * minimapScale) / 2;
    return { offsetX, offsetY };
  }, [bounds.width, bounds.height, mapWidth, mapHeight, calculateMiniMapScale]);
  
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleMousePosition(e);
  }, []);
  
  const handleMousePosition = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const minimapScale = calculateMiniMapScale();
    const { offsetX, offsetY } = calculateOffset();
    
    // Calcular la posición en el diagrama completo
    const diagramX = bounds.minX + ((x - offsetX) / minimapScale);
    const diagramY = bounds.minY + ((y - offsetY) / minimapScale);
    
    // Calcular la posición del viewport
    const viewportX = -diagramX * scale + viewportSize.width / 2;
    const viewportY = -diagramY * scale + viewportSize.height / 2;
    
    // Disparar el evento con la posición
    const event = new CustomEvent('minimap-navigation', {
      detail: { x: viewportX, y: viewportY }
    });
    
    window.dispatchEvent(event);
  }, [isDragging, canvasRef, bounds, scale, viewportSize, calculateMiniMapScale, calculateOffset]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  return {
    isDragging,
    handleMouseDown,
    handleMousePosition,
    handleMouseUp,
    calculateMiniMapScale,
    calculateOffset
  };
} 