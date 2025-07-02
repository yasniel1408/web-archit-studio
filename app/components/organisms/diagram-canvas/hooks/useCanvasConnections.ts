import { useCallback } from 'react';
import { ConnectionPosition } from '@/app/components/atoms/connection-point/connection-point';
import { ActiveConnectionType, ConnectionPropertiesType, ConnectionType } from '../types';

type CanvasConnectionsConfig = {
  canvasRef: React.RefObject<HTMLDivElement>;
  scale: number;
  position: { x: number; y: number };
  activeConnection: ActiveConnectionType | null;
  setActiveConnection: React.Dispatch<React.SetStateAction<ActiveConnectionType | null>>;
  startConnection: (nodeId: string, position: ConnectionPosition, x: number, y: number) => void;
  completeConnection: (targetNodeId: string, targetPosition: ConnectionPosition, x: number, y: number) => ConnectionType | null;
  cancelConnection: () => void;
  logDebug: (message: string) => void;
};

/**
 * Hook para manejar conexiones en el canvas
 */
export function useCanvasConnections({
  canvasRef,
  scale,
  position,
  activeConnection,
  setActiveConnection,
  startConnection,
  completeConnection,
  cancelConnection,
  logDebug
}: CanvasConnectionsConfig) {
  
  /**
   * Inicia una conexión desde un punto específico de un nodo
   */
  const handleConnectionStart = useCallback((
    nodeId: string, 
    connectionPosition: ConnectionPosition, 
    x: number, 
    y: number
  ) => {
    startConnection(nodeId, connectionPosition, x, y);
    logDebug(`Iniciando conexión desde nodo ${nodeId} (punto ${connectionPosition})`);
  }, [startConnection, logDebug]);

  /**
   * Finaliza una conexión en un punto específico de otro nodo
   * Ahora incluye soporte para coordenadas de snap magnético
   */
  const handleConnectionEnd = useCallback((
    targetNodeId: string, 
    targetPosition: ConnectionPosition, 
    x: number, 
    y: number,
    getFinalCoordinates?: (mouseX: number, mouseY: number) => {
      x: number;
      y: number;
      isSnapped: boolean;
      targetNodeId: string | null;
      targetPosition: ConnectionPosition | null;
    }
  ) => {
    if (activeConnection) {
      let finalX = x;
      let finalY = y;
      let finalTargetNodeId = targetNodeId;
      let finalTargetPosition = targetPosition;

      // Si tenemos una función para obtener coordenadas finales (con snap), usarla
      if (getFinalCoordinates) {
        const finalCoords = getFinalCoordinates(x, y);
        finalX = finalCoords.x;
        finalY = finalCoords.y;
        
        // Si hay snap activo, usar las coordenadas y nodo del snap
        if (finalCoords.isSnapped && finalCoords.targetNodeId && finalCoords.targetPosition) {
          finalTargetNodeId = finalCoords.targetNodeId;
          finalTargetPosition = finalCoords.targetPosition;
          logDebug(`🧲 Snap aplicado: conectando a ${finalTargetNodeId} (${finalTargetPosition})`);
        }
      }

      const newConnection = completeConnection(finalTargetNodeId, finalTargetPosition, finalX, finalY);
      
      if (newConnection) {
        logDebug(`Conexión completada: ${activeConnection.sourceId} → ${finalTargetNodeId}`);
      } else {
        logDebug(`Conexión cancelada: ya existe o mismo nodo`);
      }
    }
  }, [activeConnection, completeConnection, logDebug]);

  /**
   * Actualiza la posición de la conexión activa mientras se arrastra
   */
  const handleUpdateActiveConnection = useCallback((e: React.MouseEvent) => {
    if (activeConnection) {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (canvasRect) {
        const relativeX = e.clientX - canvasRect.left;
        const relativeY = e.clientY - canvasRect.top;
        
        // Convertir coordenadas de pantalla a coordenadas del canvas
        const canvasX = (relativeX / scale) - position.x;
        const canvasY = (relativeY / scale) - position.y;
        
        // Actualizar la posición actual de la conexión
        setActiveConnection(prev => {
          if (prev) {
            return {
              ...prev,
              currentX: canvasX,
              currentY: canvasY
            };
          }
          return prev;
        });
      }
    }
  }, [activeConnection, canvasRef, scale, position, setActiveConnection]);

  /**
   * Maneja el click en el canvas para cancelar conexiones activas
   */
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isClickOnCanvas = target === canvasRef.current || target === document.querySelector('[data-diagram-transform]');
    
    if (activeConnection && (isClickOnCanvas || target.classList.contains('flex-1') || target.classList.contains('absolute'))) {
      cancelConnection();
      logDebug('Conexión cancelada: clic en área vacía');
      e.stopPropagation();
    }
  }, [activeConnection, canvasRef, cancelConnection, logDebug]);

  /**
   * Maneja el mouse up en el canvas para cancelar conexiones si se suelta en área vacía
   */
  const handleCanvasMouseUp = useCallback((e: React.MouseEvent) => {
    if (activeConnection) {
      const target = e.target as HTMLElement;
      const isClickOnCanvas = target === canvasRef.current || target === document.querySelector('[data-diagram-transform]');
      
      if (isClickOnCanvas || target.classList.contains('flex-1') || target.classList.contains('absolute')) {
        cancelConnection();
        logDebug('Conexión cancelada: soltar en área vacía');
        e.stopPropagation();
      }
    }
  }, [activeConnection, canvasRef, cancelConnection, logDebug]);

  return {
    handleConnectionStart,
    handleConnectionEnd,
    handleUpdateActiveConnection,
    handleCanvasClick,
    handleCanvasMouseUp
  };
} 