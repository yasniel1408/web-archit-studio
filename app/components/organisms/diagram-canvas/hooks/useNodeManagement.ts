import { useState, useCallback } from 'react';
import { NodeType, ConnectionType } from '../types';
import { IconType } from '@/app/components/atoms/icon-selector/types';

export function useNodeManagement() {
  const [nodes, setNodes] = useState<NodeType[]>([]);

  // Añadir un nuevo nodo al diagrama
  const addNode = useCallback((
    id: string, 
    type: string, 
    text: string, 
    position: { x: number, y: number }, 
    size: { width: number, height: number } = { width: 140, height: 80 },
    icon?: IconType
  ) => {
    const newNode: NodeType = {
      id,
      position,
      text,
      type,
      size,
      icon
    };

    setNodes(prevNodes => [...prevNodes, newNode]);
    return newNode;
  }, []);

  // Borrar un nodo y todas sus conexiones asociadas
  const deleteNode = useCallback((
    nodeId: string, 
    connections: ConnectionType[], 
    setConnections: React.Dispatch<React.SetStateAction<ConnectionType[]>>
  ) => {
    // Eliminar el nodo
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    
    // Eliminar todas las conexiones asociadas a este nodo
    setConnections(prevConnections => 
      prevConnections.filter(conn => 
        conn.sourceId !== nodeId && conn.targetId !== nodeId
      )
    );
  }, []);

  // Actualizar la posición de un nodo
  const updateNodePosition = useCallback((
    nodeId: string, 
    newPosition: { x: number, y: number },
    connections: ConnectionType[],
    setConnections: React.Dispatch<React.SetStateAction<ConnectionType[]>>
  ) => {
    let nodeUpdated = false;
    let updatedNode: NodeType | null = null;

    setNodes(prevNodes => {
      return prevNodes.map(node => {
        if (node.id === nodeId) {
          nodeUpdated = true;
          updatedNode = { ...node, position: newPosition };
          return updatedNode;
        }
        return node;
      });
    });

    // Si encontramos y actualizamos el nodo, actualizar también sus conexiones
    if (nodeUpdated && updatedNode) {
      const connectedConnections = connections.filter(
        conn => conn.sourceId === nodeId || conn.targetId === nodeId
      );

      if (connectedConnections.length > 0) {
        setConnections(prevConnections => {
          return prevConnections.map(conn => {
            if (conn.sourceId === nodeId) {
              // Calcular nuevas coordenadas para el punto de conexión de origen
              return {
                ...conn,
                sourceX: calculateConnectionPoint(updatedNode!, conn.sourcePosition).x,
                sourceY: calculateConnectionPoint(updatedNode!, conn.sourcePosition).y
              };
            } else if (conn.targetId === nodeId) {
              // Calcular nuevas coordenadas para el punto de conexión de destino
              return {
                ...conn,
                targetX: calculateConnectionPoint(updatedNode!, conn.targetPosition).x,
                targetY: calculateConnectionPoint(updatedNode!, conn.targetPosition).y
              };
            }
            return conn;
          });
        });
      }
    }
  }, []);

  // Actualizar el tamaño de un nodo
  const updateNodeSize = useCallback((
    nodeId: string, 
    newSize: { width: number, height: number },
    connections: ConnectionType[],
    setConnections: React.Dispatch<React.SetStateAction<ConnectionType[]>>
  ) => {
    let nodeUpdated = false;
    let updatedNode: NodeType | null = null;

    setNodes(prevNodes => {
      return prevNodes.map(node => {
        if (node.id === nodeId) {
          nodeUpdated = true;
          updatedNode = { ...node, size: newSize };
          return updatedNode;
        }
        return node;
      });
    });

    // Si encontramos y actualizamos el nodo, actualizar también sus conexiones
    if (nodeUpdated && updatedNode) {
      const connectedConnections = connections.filter(
        conn => conn.sourceId === nodeId || conn.targetId === nodeId
      );

      if (connectedConnections.length > 0) {
        setConnections(prevConnections => {
          return prevConnections.map(conn => {
            if (conn.sourceId === nodeId) {
              // Calcular nuevas coordenadas para el punto de conexión de origen
              return {
                ...conn,
                sourceX: calculateConnectionPoint(updatedNode!, conn.sourcePosition).x,
                sourceY: calculateConnectionPoint(updatedNode!, conn.sourcePosition).y
              };
            } else if (conn.targetId === nodeId) {
              // Calcular nuevas coordenadas para el punto de conexión de destino
              return {
                ...conn,
                targetX: calculateConnectionPoint(updatedNode!, conn.targetPosition).x,
                targetY: calculateConnectionPoint(updatedNode!, conn.targetPosition).y
              };
            }
            return conn;
          });
        });
      }
    }
  }, []);

  // Actualizar propiedades de un nodo (texto, icono, color, etc.)
  const updateNodeProperties = useCallback((
    nodeId: string,
    properties: Partial<NodeType>
  ) => {
    setNodes(prevNodes => {
      return prevNodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, ...properties };
        }
        return node;
      });
    });
  }, []);

  // Función auxiliar para calcular la posición de puntos de conexión
  const calculateConnectionPoint = (node: NodeType, position: 'top' | 'right' | 'bottom' | 'left') => {
    const { position: nodePosition, size } = node;
    
    switch (position) {
      case 'top':
        return { x: nodePosition.x + size.width / 2, y: nodePosition.y };
      case 'right':
        return { x: nodePosition.x + size.width, y: nodePosition.y + size.height / 2 };
      case 'bottom':
        return { x: nodePosition.x + size.width / 2, y: nodePosition.y + size.height };
      case 'left':
        return { x: nodePosition.x, y: nodePosition.y + size.height / 2 };
      default:
        return { x: 0, y: 0 };
    }
  };

  return {
    nodes,
    setNodes,
    addNode,
    deleteNode,
    updateNodePosition,
    updateNodeSize,
    updateNodeProperties,
    calculateConnectionPoint
  };
} 