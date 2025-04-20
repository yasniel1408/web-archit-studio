"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ConnectionPosition } from '@/app/components/atoms/connection-point/connection-point';

type NodeType = {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  text?: string;
};

type ConnectionType = {
  id: string;
  sourceId: string;
  targetId: string;
  sourcePosition: ConnectionPosition;
  targetPosition: ConnectionPosition;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  style?: 'solid' | 'dashed' | 'dotted';
};

type MiniMapProps = {
  nodes: NodeType[];
  connections: ConnectionType[];
  scale: number;
  position: { x: number; y: number };
  viewportSize: { width: number; height: number };
};

export function MiniMap({
  nodes = [],
  connections = [],
  scale = 1,
  position = { x: 0, y: 0 },
  viewportSize = { width: 0, height: 0 }
}: MiniMapProps) {
  const [bounds, setBounds] = useState({ minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Calcular los límites del diagrama
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
    
    // Añadir un poco de margen
    const margin = 50;
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
  
  // Renderizar el minimapa
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0 || bounds.width === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calcular la escala para ajustar el contenido al minimapa
    const miniMapWidth = 140;
    const miniMapHeight = 140;
    
    const scaleX = miniMapWidth / bounds.width;
    const scaleY = miniMapHeight / bounds.height;
    const minimapScale = Math.min(scaleX, scaleY);
    
    // Dibuja el fondo
    ctx.fillStyle = '#FFFFFF'; // Fondo blanco
    ctx.fillRect(0, 0, miniMapWidth, miniMapHeight);
    
    // Dibuja líneas de cuadrícula
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.8)'; // Color slate-200 con transparencia
    ctx.lineWidth = 0.5;
    
    // Líneas de cuadrícula horizontales
    for (let i = 0; i < miniMapHeight; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(miniMapWidth, i);
      ctx.stroke();
    }
    
    // Líneas de cuadrícula verticales
    for (let i = 0; i < miniMapWidth; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, miniMapHeight);
      ctx.stroke();
    }
    
    // Dibujar las conexiones
    connections.forEach(connection => {
      // Convertir las coordenadas del diagrama al minimapa
      const sx = (connection.sourceX - bounds.minX) * minimapScale;
      const sy = (connection.sourceY - bounds.minY) * minimapScale;
      const tx = (connection.targetX - bounds.minX) * minimapScale;
      const ty = (connection.targetY - bounds.minY) * minimapScale;
      
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(tx, ty);
      
      // Estilo de línea según el tipo de conexión
      if (connection.style === 'dashed') {
        ctx.setLineDash([3, 2]);
      } else if (connection.style === 'dotted') {
        ctx.setLineDash([1, 1]);
      } else {
        ctx.setLineDash([]);
      }
      
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.5)'; // Color indigo más suave
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Dibujar la punta de la flecha
      const angle = Math.atan2(ty - sy, tx - sx);
      const arrowSize = 3;
      
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
    });
    
    // Dibujar los nodos
    nodes.forEach(node => {
      // Convertir las coordenadas del diagrama al minimapa
      const x = (node.position.x - bounds.minX) * minimapScale;
      const y = (node.position.y - bounds.minY) * minimapScale;
      const width = node.size.width * minimapScale;
      const height = node.size.height * minimapScale;
      
      // Estilo según el tipo de nodo - colores más suaves
      let fillColor = 'rgba(148, 163, 184, 0.5)'; // Gris por defecto (slate-400)
      
      if (node.type.includes('hexagon')) {
        fillColor = 'rgba(251, 191, 36, 0.5)'; // Naranja para hexágono (amber-400)
      } else if (node.type.includes('cylinder') || node.type.includes('database')) {
        fillColor = 'rgba(34, 197, 94, 0.5)'; // Verde para cilindro (green-500)
      } else if (node.type.includes('person')) {
        fillColor = 'rgba(59, 130, 246, 0.5)'; // Azul para persona (blue-500)
      } else if (node.type.includes('cloud')) {
        fillColor = 'rgba(139, 92, 246, 0.5)'; // Violeta para nube (violet-500)
      }
      
      // Dibujar el nodo con bordes más suaves
      ctx.fillStyle = fillColor;
      ctx.strokeStyle = 'rgba(209, 213, 219, 0.8)'; // gray-300
      ctx.lineWidth = 0.5;
      
      if (node.type === 'cylinder' || node.type === 'database') {
        // Dibujar un cilindro simplificado
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
      } else if (node.type === 'person') {
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
      } else if (node.type === 'cloud') {
        // Una forma de nube simplificada
        ctx.beginPath();
        ctx.arc(x + width / 3, y + height / 2, height / 3, 0, 2 * Math.PI);
        ctx.arc(x + width * 2/3, y + height / 2, height / 3, 0, 2 * Math.PI);
        ctx.arc(x + width / 2, y + height / 3, height / 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      } else {
        // Cuadrado/rectángulo por defecto
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
      }
    });
    
    // Dibujar el viewport visible
    if (viewportSize.width > 0 && viewportSize.height > 0) {
      // Convertir las coordenadas del viewport al minimapa
      const vpX = (-position.x) * minimapScale;
      const vpY = (-position.y) * minimapScale;
      const vpWidth = (viewportSize.width / scale) * minimapScale;
      const vpHeight = (viewportSize.height / scale) * minimapScale;
      
      // Dibujar un borde con efecto de "glow"
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)'; // Color indigo transparente
      ctx.lineWidth = 3;
      ctx.strokeRect(vpX, vpY, vpWidth, vpHeight);
      
      // Borde más definido
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)'; // Color indigo más sólido
      ctx.lineWidth = 1;
      ctx.strokeRect(vpX, vpY, vpWidth, vpHeight);
      
      // Sombra interior sutil (simulada con un rectángulo translúcido)
      ctx.fillStyle = 'rgba(79, 70, 229, 0.05)'; // Color muy sutil para el interior
      ctx.fillRect(vpX, vpY, vpWidth, vpHeight);
    }
  }, [nodes, connections, bounds, scale, position, viewportSize]);
  
  // Manejar el clic para navegar en el diagrama
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleMouseMove(e);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calcular la posición correspondiente en el diagrama
    const miniMapWidth = 140;
    const miniMapHeight = 140;
    
    const scaleX = miniMapWidth / bounds.width;
    const scaleY = miniMapHeight / bounds.height;
    const minimapScale = Math.min(scaleX, scaleY);
    
    // Calcular la posición en el diagrama completo
    const diagramX = bounds.minX + (x / minimapScale);
    const diagramY = bounds.minY + (y / minimapScale);
    
    // Disparar un evento personalizado para que el DiagramCanvas pueda escucharlo
    const event = new CustomEvent('minimap-navigation', {
      detail: { x: diagramX, y: diagramY }
    });
    
    window.dispatchEvent(event);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  return (
    <div className="absolute bottom-4 right-4 z-50 glass-panel rounded-xl shadow-xl overflow-hidden flex flex-col fade-in">
      <div className="text-gray-700 text-xs px-3 py-2 border-b border-border/20 flex justify-between items-center">
        <span className="font-medium">Mini-Mapa</span>
        {nodes.length === 0 && (
          <span className="text-gray-400 text-xs">(Sin contenido)</span>
        )}
      </div>
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={140} 
          height={140}
          className="bg-white/70"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
            Añade nodos para
            <br />
            activar el minimapa
          </div>
        )}
      </div>
    </div>
  );
} 