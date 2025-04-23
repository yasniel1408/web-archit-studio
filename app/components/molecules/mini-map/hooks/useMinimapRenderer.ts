import { useEffect } from 'react';
import { NodeType, ConnectionType, MinimapBounds } from '../types';

type RendererConfig = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  nodes: NodeType[];
  connections: ConnectionType[];
  bounds: MinimapBounds;
  scale: number;
  position: { x: number; y: number };
  viewportSize: { width: number; height: number };
  mapWidth: number;
  mapHeight: number;
  zoomOutFactor: number;
};

/**
 * Hook para la lógica de renderizado del canvas del minimapa
 */
export function useMinimapRenderer({
  canvasRef,
  nodes,
  connections,
  bounds,
  scale,
  position,
  viewportSize,
  mapWidth, 
  mapHeight,
  zoomOutFactor
}: RendererConfig) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0 || bounds.width === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calcular la escala para ajustar el contenido
    const scaleX = (mapWidth / bounds.width) * zoomOutFactor;
    const scaleY = (mapHeight / bounds.height) * zoomOutFactor;
    const minimapScale = Math.min(scaleX, scaleY);
    
    // Calcular offsets para centrar
    const offsetX = (mapWidth - bounds.width * minimapScale) / 2;
    const offsetY = (mapHeight - bounds.height * minimapScale) / 2;
    
    // Dibujar fondo y cuadrícula
    drawBackground(ctx, mapWidth, mapHeight);
    drawGrid(ctx, mapWidth, mapHeight);
    
    // Dibujar conexiones
    drawConnections(ctx, connections, bounds, minimapScale, offsetX, offsetY, mapWidth, mapHeight);
    
    // Dibujar nodos
    drawNodes(ctx, nodes, bounds, minimapScale, offsetX, offsetY, mapWidth, mapHeight);
    
    // Dibujar viewport visible
    drawViewport(ctx, position, bounds, viewportSize, scale, minimapScale, offsetX, offsetY);
    
  }, [canvasRef, nodes, connections, bounds, scale, position, viewportSize, mapWidth, mapHeight, zoomOutFactor]);
}

// Funciones auxiliares para dibujar

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.8)';
  ctx.lineWidth = 0.5;
  
  // Líneas horizontales
  for (let i = 0; i < height; i += 20) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }
  
  // Líneas verticales
  for (let i = 0; i < width; i += 20) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }
}

function drawConnections(
  ctx: CanvasRenderingContext2D,
  connections: ConnectionType[],
  bounds: MinimapBounds,
  minimapScale: number,
  offsetX: number,
  offsetY: number,
  mapWidth: number,
  mapHeight: number
) {
  connections.forEach(connection => {
    // Convertir coordenadas al minimapa
    const sx = (connection.sourceX - bounds.minX) * minimapScale + offsetX;
    const sy = (connection.sourceY - bounds.minY) * minimapScale + offsetY;
    const tx = (connection.targetX - bounds.minX) * minimapScale + offsetX;
    const ty = (connection.targetY - bounds.minY) * minimapScale + offsetY;
    
    // Verificar visibilidad
    if (sx >= -50 && sx <= mapWidth + 50 && sy >= -50 && sy <= mapHeight + 50 &&
        tx >= -50 && tx <= mapWidth + 50 && ty >= -50 && ty <= mapHeight + 50) {
      
      // Dibujar línea
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(tx, ty);
      
      // Estilo de línea
      if (connection.style === 'dashed') {
        ctx.setLineDash([3, 2]);
      } else if (connection.style === 'dotted') {
        ctx.setLineDash([1, 1]);
      } else {
        ctx.setLineDash([]);
      }
      
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.5)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Punta de flecha
      const angle = Math.atan2(ty - sy, tx - sx);
      const arrowSize = 2;
      
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(
        tx - arrowSize * Math.cos(angle - Math.PI / 6),
        ty - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        tx - arrowSize * Math.cos(angle + Math.PI / 6),
        ty - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = 'rgba(79, 70, 229, 0.6)';
      ctx.fill();
    }
  });
}

function drawNodes(
  ctx: CanvasRenderingContext2D,
  nodes: NodeType[],
  bounds: MinimapBounds,
  minimapScale: number,
  offsetX: number,
  offsetY: number,
  mapWidth: number,
  mapHeight: number
) {
  nodes.forEach(node => {
    // Convertir coordenadas al minimapa
    const x = (node.position.x - bounds.minX) * minimapScale + offsetX;
    const y = (node.position.y - bounds.minY) * minimapScale + offsetY;
    const width = node.size.width * minimapScale;
    const height = node.size.height * minimapScale;
    
    // Verificar visibilidad
    if (x + width >= -20 && x <= mapWidth + 20 && y + height >= -20 && y <= mapHeight + 20) {
      // Determinar color según tipo
      let fillColor = 'rgba(148, 163, 184, 0.5)';
      
      if (node.type.includes('hexagon')) {
        fillColor = 'rgba(251, 191, 36, 0.5)';
      } else if (node.type.includes('cylinder') || node.type.includes('database')) {
        fillColor = 'rgba(34, 197, 94, 0.5)';
      } else if (node.type.includes('person')) {
        fillColor = 'rgba(59, 130, 246, 0.5)';
      } else if (node.type.includes('cloud')) {
        fillColor = 'rgba(139, 92, 246, 0.5)';
      }
      
      ctx.fillStyle = fillColor;
      ctx.strokeStyle = 'rgba(209, 213, 219, 0.8)';
      ctx.lineWidth = 0.5;
      
      // Dibujar según el tipo de nodo
      if (node.type.includes('cylinder') || node.type.includes('database')) {
        drawCylinder(ctx, x, y, width, height);
      } else if (node.type.includes('person')) {
        drawPerson(ctx, x, y, width, height);
      } else if (node.type.includes('cloud')) {
        drawCloud(ctx, x, y, width, height);
      } else {
        // Rectángulo por defecto
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
      }
    }
  });
}

function drawCylinder(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  width: number, 
  height: number
) {
  const radiusX = width / 2;
  const radiusY = height / 5;
  const centerX = x + radiusX;
  
  // Elipse superior
  ctx.beginPath();
  ctx.ellipse(centerX, y + radiusY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Rectángulo para el cuerpo
  ctx.fillRect(x, y + radiusY, width, height - 2 * radiusY);
  ctx.strokeRect(x, y + radiusY, width, height - 2 * radiusY);
  
  // Elipse inferior
  ctx.beginPath();
  ctx.ellipse(centerX, y + height - radiusY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function drawPerson(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  width: number, 
  height: number
) {
  // Círculo para la cabeza
  const headSize = width / 3;
  const headY = y + headSize;
  
  ctx.beginPath();
  ctx.arc(x + width / 2, headY, headSize, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Triángulo para el cuerpo
  ctx.beginPath();
  ctx.moveTo(x + width / 2, headY + headSize);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x + width, y + height);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawCloud(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  width: number, 
  height: number
) {
  ctx.beginPath();
  ctx.arc(x + width / 3, y + height / 2, height / 3, 0, 2 * Math.PI);
  ctx.arc(x + width * 2/3, y + height / 2, height / 3, 0, 2 * Math.PI);
  ctx.arc(x + width / 2, y + height / 3, height / 3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function drawViewport(
  ctx: CanvasRenderingContext2D,
  position: { x: number; y: number },
  bounds: MinimapBounds,
  viewportSize: { width: number; height: number },
  scale: number,
  minimapScale: number,
  offsetX: number,
  offsetY: number
) {
  if (viewportSize.width <= 0 || viewportSize.height <= 0) return;
  
  // Calcular la posición del viewport en el minimapa
  const vpX = (position.x - bounds.minX) * minimapScale + offsetX;
  const vpY = (position.y - bounds.minY) * minimapScale + offsetY;
  const vpWidth = (viewportSize.width / scale) * minimapScale;
  const vpHeight = (viewportSize.height / scale) * minimapScale;
  
  // Efecto de glow
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
  ctx.lineWidth = 4;
  ctx.strokeRect(vpX, vpY, vpWidth, vpHeight);
  
  // Borde definido
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)';
  ctx.lineWidth = 1;
  ctx.strokeRect(vpX, vpY, vpWidth, vpHeight);
  
  // Interior sutil
  ctx.fillStyle = 'rgba(79, 70, 229, 0.05)';
  ctx.fillRect(vpX, vpY, vpWidth, vpHeight);
} 