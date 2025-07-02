"use client";

import { useCallback, useState, useRef, useEffect } from 'react';
import { ConnectionPosition } from '@/app/components/atoms/connection-point/connection-point';
import { NodeType, ActiveConnectionType } from '../types';

interface UseConnectionSnappingConfig {
  nodes: NodeType[];
  activeConnection: ActiveConnectionType | null;
  snapDistance?: number; // Distancia para activar el snap (en pixels)
  logDebug: (message: string) => void;
}

interface SnapTarget {
  nodeId: string;
  position: ConnectionPosition;
  x: number;
  y: number;
  distance: number;
}

interface SnapState {
  isSnapping: boolean;
  targetNodeId: string | null;
  targetPosition: ConnectionPosition | null;
  snapX: number;
  snapY: number;
}

export function useConnectionSnapping({
  nodes,
  activeConnection,
  snapDistance = 30, // 30 pixels de distancia para snap
  logDebug
}: UseConnectionSnappingConfig) {
  const [snapState, setSnapState] = useState<SnapState>({
    isSnapping: false,
    targetNodeId: null,
    targetPosition: null,
    snapX: 0,
    snapY: 0
  });

  // Calcular las coordenadas de los puntos de conexión de un nodo
  const getNodeConnectionPoints = useCallback((node: NodeType) => {
    const size = node.size || { width: 120, height: 120 };
    const halfWidth = size.width / 2;
    const halfHeight = size.height / 2;

    return {
      top: { x: node.position.x + halfWidth, y: node.position.y, position: 'top' as ConnectionPosition },
      right: { x: node.position.x + size.width, y: node.position.y + halfHeight, position: 'right' as ConnectionPosition },
      bottom: { x: node.position.x + halfWidth, y: node.position.y + size.height, position: 'bottom' as ConnectionPosition },
      left: { x: node.position.x, y: node.position.y + halfHeight, position: 'left' as ConnectionPosition }
    };
  }, []);

  // Encontrar el punto de conexión más cercano a la posición del mouse
  const findNearestSnapTarget = useCallback((mouseX: number, mouseY: number): SnapTarget | null => {
    if (!activeConnection) return null;

    let nearestTarget: SnapTarget | null = null;
    let minDistance = snapDistance;

    // Revisar todos los nodos excepto el nodo fuente
    nodes.forEach(node => {
      if (node.id === activeConnection.sourceId) return; // No snap al nodo fuente

      const connectionPoints = getNodeConnectionPoints(node);
      
      // Revisar cada punto de conexión del nodo
      Object.values(connectionPoints).forEach(point => {
        const distance = Math.sqrt(
          Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestTarget = {
            nodeId: node.id,
            position: point.position,
            x: point.x,
            y: point.y,
            distance
          };
        }
      });
    });

    return nearestTarget;
  }, [nodes, activeConnection, snapDistance, getNodeConnectionPoints]);

  // Actualizar el estado de snap basado en la posición del mouse
  const updateSnapState = useCallback((mouseX: number, mouseY: number) => {
    if (!activeConnection) {
      setSnapState(prev => prev.isSnapping ? {
        isSnapping: false,
        targetNodeId: null,
        targetPosition: null,
        snapX: 0,
        snapY: 0
      } : prev);
      return;
    }

    const nearestTarget = findNearestSnapTarget(mouseX, mouseY);

    if (nearestTarget) {
      setSnapState({
        isSnapping: true,
        targetNodeId: nearestTarget.nodeId,
        targetPosition: nearestTarget.position,
        snapX: nearestTarget.x,
        snapY: nearestTarget.y
      });
      
      // Log solo cuando empieza el snap para evitar spam
      if (!snapState.isSnapping || snapState.targetNodeId !== nearestTarget.nodeId) {
        logDebug(`Imán activado: ${nearestTarget.nodeId} (${nearestTarget.position}) - distancia: ${Math.round(nearestTarget.distance)}px`);
      }
    } else {
      if (snapState.isSnapping) {
        logDebug('Imán desactivado');
      }
      setSnapState({
        isSnapping: false,
        targetNodeId: null,
        targetPosition: null,
        snapX: 0,
        snapY: 0
      });
    }
  }, [activeConnection, findNearestSnapTarget, snapState.isSnapping, snapState.targetNodeId, logDebug]);

  // Obtener las coordenadas finales (con o sin snap)
  const getFinalConnectionCoordinates = useCallback((mouseX: number, mouseY: number) => {
    if (snapState.isSnapping) {
      return {
        x: snapState.snapX,
        y: snapState.snapY,
        isSnapped: true,
        targetNodeId: snapState.targetNodeId,
        targetPosition: snapState.targetPosition
      };
    }

    return {
      x: mouseX,
      y: mouseY,
      isSnapped: false,
      targetNodeId: null,
      targetPosition: null
    };
  }, [snapState]);

  // Limpiar estado cuando no hay conexión activa
  useEffect(() => {
    if (!activeConnection && snapState.isSnapping) {
      setSnapState({
        isSnapping: false,
        targetNodeId: null,
        targetPosition: null,
        snapX: 0,
        snapY: 0
      });
    }
  }, [activeConnection, snapState.isSnapping]);

  // Generar el CSS para el efecto visual de snap
  const getSnapIndicatorStyle = useCallback(() => {
    if (!snapState.isSnapping) return null;

    return {
      position: 'absolute' as const,
      left: `${snapState.snapX - 8}px`, // Centrar el indicador (16px / 2)
      top: `${snapState.snapY - 8}px`,
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      backgroundColor: '#10B981', // Verde más intenso
      border: '2px solid white',
      boxShadow: '0 0 10px rgba(16, 185, 129, 0.6), 0 0 20px rgba(16, 185, 129, 0.3)',
      zIndex: 1000,
      pointerEvents: 'none' as const,
      animation: 'snap-pulse 0.8s ease-in-out infinite alternate'
    };
  }, [snapState]);

  // Agregar estilos CSS para la animación de snap
  useEffect(() => {
    const styleId = 'snap-animation-styles';
    
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes snap-pulse {
          0% { 
            transform: scale(1);
            opacity: 1;
          }
          100% { 
            transform: scale(1.3);
            opacity: 0.7;
          }
        }
        
        .connection-point-highlight {
          transform: scale(1.4) !important;
          background-color: #10B981 !important;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.8) !important;
          z-index: 35 !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  // Función para aplicar highlight a los puntos de conexión del nodo target
  const highlightTargetConnectionPoints = useCallback(() => {
    // Remover highlights previos
    document.querySelectorAll('.connection-point').forEach(point => {
      point.classList.remove('connection-point-highlight');
    });

    if (snapState.isSnapping && snapState.targetNodeId) {
      // Buscar y highlight el nodo target
      const targetNode = document.querySelector(`[data-node-id="${snapState.targetNodeId}"]`);
      if (targetNode) {
        const connectionPoints = targetNode.querySelectorAll('.connection-point');
        connectionPoints.forEach(point => {
          point.classList.add('connection-point-highlight');
        });
      }
    }
  }, [snapState]);

  // Aplicar highlight cuando cambia el estado de snap
  useEffect(() => {
    highlightTargetConnectionPoints();
  }, [highlightTargetConnectionPoints]);

  return {
    snapState,
    updateSnapState,
    getFinalConnectionCoordinates,
    getSnapIndicatorStyle,
    isSnapping: snapState.isSnapping,
    snapTarget: snapState.isSnapping ? {
      nodeId: snapState.targetNodeId!,
      position: snapState.targetPosition!,
      x: snapState.snapX,
      y: snapState.snapY
    } : null
  };
} 