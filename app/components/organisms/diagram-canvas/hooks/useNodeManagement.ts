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
    // Primero actualizamos el nodo en una operación separada
    let updatedNode: NodeType | null = null;

    setNodes(prevNodes => {
      const updatedNodes = prevNodes.map(node => {
        if (node.id === nodeId) {
          updatedNode = { ...node, position: newPosition };
          return updatedNode;
        }
        return node;
      });
      
      // Si encontramos el nodo, calculamos inmediatamente las nuevas posiciones
      // para las conexiones para evitar retardos en la actualización
      if (updatedNode) {
        // Encontrar todas las conexiones relacionadas a este nodo
        const connectedConnections = connections.filter(
          conn => conn.sourceId === nodeId || conn.targetId === nodeId
        );

        if (connectedConnections.length > 0) {
          // Actualizar las conexiones relacionadas a este nodo
          // de forma inmediata para evitar desincronización visual
          const updatedConnections = [...connections];
          
          connectedConnections.forEach(conn => {
            const connIndex = updatedConnections.findIndex(c => c.id === conn.id);
            if (connIndex >= 0) {
              const updatedConn = { ...conn };
              
              if (conn.sourceId === nodeId) {
                // Actualizar las coordenadas de origen
                updatedConn.sourceX = calculateConnectionPoint(updatedNode!, conn.sourcePosition).x;
                updatedConn.sourceY = calculateConnectionPoint(updatedNode!, conn.sourcePosition).y;
              } 
              
              if (conn.targetId === nodeId) {
                // Actualizar las coordenadas de destino  
                updatedConn.targetX = calculateConnectionPoint(updatedNode!, conn.targetPosition).x;
                updatedConn.targetY = calculateConnectionPoint(updatedNode!, conn.targetPosition).y;
              }
              
              updatedConnections[connIndex] = updatedConn;
            }
          });
          
          // Actualizar todas las conexiones a la vez para evitar renderizados parciales
          setConnections(updatedConnections);
        }
      }
      
      return updatedNodes;
    });
  }, []);

  // Actualizar el tamaño de un nodo
  const updateNodeSize = useCallback((
    nodeId: string, 
    newSize: { width: number, height: number },
    connections: ConnectionType[],
    setConnections: React.Dispatch<React.SetStateAction<ConnectionType[]>>
  ) => {
    // Actualizamos el nodo en una operación atómica
    let updatedNode: NodeType | null = null;

    setNodes(prevNodes => {
      const updatedNodes = prevNodes.map(node => {
        if (node.id === nodeId) {
          // Actualizar el tipo para incluir el nuevo tamaño
          let nodeType = node.type || "square";
          
          // Primero eliminar cualquier información de tamaño existente
          nodeType = nodeType.replace(/\s*size:\d+x\d+/, '');
          
          // Luego añadir el nuevo tamaño
          nodeType = `${nodeType} size:${newSize.width}x${newSize.height}`;
          
          updatedNode = { 
            ...node, 
            size: newSize,
            type: nodeType
          };
          return updatedNode;
        }
        return node;
      });
      
      // Si encontramos el nodo, calculamos inmediatamente las nuevas posiciones
      // para las conexiones para evitar retardos en la actualización
      if (updatedNode) {
        // Encontrar todas las conexiones relacionadas a este nodo
        const connectedConnections = connections.filter(
          conn => conn.sourceId === nodeId || conn.targetId === nodeId
        );

        if (connectedConnections.length > 0) {
          // Actualizar las conexiones relacionadas a este nodo
          // de forma inmediata para evitar desincronización visual
          const updatedConnections = [...connections];
          
          connectedConnections.forEach(conn => {
            const connIndex = updatedConnections.findIndex(c => c.id === conn.id);
            if (connIndex >= 0) {
              const updatedConn = { ...conn };
              
              if (conn.sourceId === nodeId) {
                // Actualizar las coordenadas de origen
                updatedConn.sourceX = calculateConnectionPoint(updatedNode!, conn.sourcePosition).x;
                updatedConn.sourceY = calculateConnectionPoint(updatedNode!, conn.sourcePosition).y;
              } 
              
              if (conn.targetId === nodeId) {
                // Actualizar las coordenadas de destino  
                updatedConn.targetX = calculateConnectionPoint(updatedNode!, conn.targetPosition).x;
                updatedConn.targetY = calculateConnectionPoint(updatedNode!, conn.targetPosition).y;
              }
              
              updatedConnections[connIndex] = updatedConn;
            }
          });
          
          // Actualizar todas las conexiones a la vez para evitar renderizados parciales
          setConnections(updatedConnections);
        }
      }
      
      return updatedNodes;
    });
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