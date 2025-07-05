import { useCallback, useState } from "react";

import {
  ActiveConnectionType,
  ConnectionPosition,
  ConnectionPropertiesType,
  ConnectionType,
} from "../types";

export function useConnectionManagement() {
  const [connections, setConnections] = useState<ConnectionType[]>([]);
  const [activeConnection, setActiveConnection] = useState<ActiveConnectionType | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

  // Iniciar una nueva conexión
  const startConnection = useCallback(
    (sourceId: string, position: ConnectionPosition, x: number, y: number) => {
      setActiveConnection({
        sourceId,
        sourcePosition: position,
        sourceX: x,
        sourceY: y,
        currentX: x,
        currentY: y,
      });
    },
    []
  );

  // Completar una conexión activa
  const completeConnection = useCallback(
    (targetId: string, targetPosition: ConnectionPosition, targetX: number, targetY: number) => {
      if (activeConnection) {
        // Verificar que no sea el mismo nodo
        if (activeConnection.sourceId === targetId) {
          setActiveConnection(null);
          return null;
        }

        // Verificar que no exista ya una conexión entre estos nodos y puntos
        const connectionExists = connections.some(
          (conn) =>
            conn.sourceId === activeConnection.sourceId &&
            conn.targetId === targetId &&
            conn.sourcePosition === activeConnection.sourcePosition &&
            conn.targetPosition === targetPosition
        );

        if (connectionExists) {
          setActiveConnection(null);
          return null;
        }

        // Crear nueva conexión
        const newConnection: ConnectionType = {
          id: `conn-${Date.now()}`,
          sourceId: activeConnection.sourceId,
          targetId,
          sourcePosition: activeConnection.sourcePosition,
          targetPosition,
          sourceX: activeConnection.sourceX,
          sourceY: activeConnection.sourceY,
          targetX,
          targetY,
          style: "solid",
          animation: "none",
          startArrowHead: "none",
          endArrowHead: "arrow",
          color: "#000000",
          strokeWidth: 2,
        };

        setConnections((prev) => [...prev, newConnection]);
        setActiveConnection(null);
        return newConnection;
      }
      return null;
    },
    [activeConnection, connections]
  );

  // Cancelar una conexión activa
  const cancelConnection = useCallback(() => {
    setActiveConnection(null);
  }, []);

  // Seleccionar una conexión
  const selectConnection = useCallback((connectionId: string) => {
    setSelectedConnectionId(connectionId);
  }, []);

  // Borrar una conexión
  const deleteConnection = useCallback(
    (connectionId: string) => {
      setConnections((prev) => prev.filter((conn) => conn.id !== connectionId));
      if (selectedConnectionId === connectionId) {
        setSelectedConnectionId(null);
      }
    },
    [selectedConnectionId]
  );

  // Actualizar propiedades de una conexión
  const updateConnectionProperties = useCallback(
    (connectionId: string, properties: ConnectionPropertiesType) => {
      setConnections((prev) =>
        prev.map((conn) => (conn.id === connectionId ? { ...conn, ...properties } : conn))
      );
    },
    []
  );

  // Actualizar las coordenadas de una conexión
  const updateConnectionPoints = useCallback(
    (
      connectionId: string,
      updates: {
        sourceX?: number;
        sourceY?: number;
        targetX?: number;
        targetY?: number;
        sourcePosition?: ConnectionPosition;
        targetPosition?: ConnectionPosition;
      }
    ) => {
      setConnections((prev) =>
        prev.map((conn) => (conn.id === connectionId ? { ...conn, ...updates } : conn))
      );
    },
    []
  );

  return {
    connections,
    setConnections,
    activeConnection,
    setActiveConnection,
    selectedConnectionId,
    setSelectedConnectionId,
    startConnection,
    completeConnection,
    cancelConnection,
    selectConnection,
    deleteConnection,
    updateConnectionProperties,
    updateConnectionPoints,
  };
}
