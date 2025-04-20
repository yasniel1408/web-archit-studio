"use client";

import React, { useState, useRef, useEffect } from 'react';
import { CanvasNode } from '@/app/components/molecules/canvas-node/canvas-node';
import { ConnectionPosition } from '@/app/components/atoms/connection-point/connection-point';
import { Arrow } from '@/app/components/atoms/arrow/arrow';
import { MiniMap } from '@/app/components/molecules/mini-map/mini-map';

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
  animation?: 'none' | 'pulse' | 'flow' | 'dash' | 'traveling-dot' | 'traveling-dot-fast' | 'traveling-dot-fastest';
  startArrowHead?: 'none' | 'arrow' | 'circle' | 'diamond';
  endArrowHead?: 'none' | 'arrow' | 'circle' | 'diamond';
  color?: string;
  strokeWidth?: number;
};

export function DiagramCanvas() {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [connections, setConnections] = useState<ConnectionType[]>([]);
  const [activeConnection, setActiveConnection] = useState<{
    sourceId: string;
    sourcePosition: ConnectionPosition;
    sourceX: number;
    sourceY: number;
    currentX: number;
    currentY: number;
  } | null>(null);
  
  const [debug, setDebug] = useState<string[]>([]);
  
  // Estado para zoom
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);
  
  // Referencia para el input de archivo JSON
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<HTMLDivElement>(null);
  
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  
  // Función para registrar mensajes de debug
  const logDebug = (message: string) => {
    console.log(message);
    setDebug(prev => {
      const newDebug = [...prev, `${new Date().toISOString().substring(11, 19)}: ${message}`];
      if (newDebug.length > 5) {
        return newDebug.slice(newDebug.length - 5);
      }
      return newDebug;
    });
  };
  
  // Cargar datos guardados al montar el componente
  useEffect(() => {
    try {
      const savedDiagram = localStorage.getItem('architectDiagram');
      if (savedDiagram) {
        const { savedNodes, savedConnections, savedViewport } = JSON.parse(savedDiagram);
        
        // Cargar nodos
        setNodes(savedNodes || []);
        
        // Cargar conexiones asegurando que todas las propiedades estén presentes
        const connectionsWithDefaultProps = (savedConnections || []).map((conn: ConnectionType) => ({
          id: conn.id,
          sourceId: conn.sourceId,
          targetId: conn.targetId,
          sourcePosition: conn.sourcePosition,
          targetPosition: conn.targetPosition,
          sourceX: conn.sourceX,
          sourceY: conn.sourceY,
          targetX: conn.targetX,
          targetY: conn.targetY,
          style: conn.style || 'solid',
          animation: conn.animation || 'none',
          startArrowHead: conn.startArrowHead || 'none',
          endArrowHead: conn.endArrowHead || 'arrow',
          color: conn.color || '#000000',
          strokeWidth: conn.strokeWidth || 2
        }));
        
        setConnections(connectionsWithDefaultProps);
        
        // Restaurar la posición y escala del viewport si existe
        if (savedViewport) {
          setScale(savedViewport.scale || 1);
          setPosition(savedViewport.position || { x: 0, y: 0 });
        }
        
        logDebug(`Cargados ${savedNodes?.length || 0} nodos y ${connectionsWithDefaultProps.length} conexiones del almacenamiento local`);
      }
    } catch (error) {
      console.error('Error al cargar diagrama guardado:', error);
    }
  }, []);

  // Manejar eventos de navegación desde el minimapa
  useEffect(() => {
    const handleMinimapNavigation = (e: CustomEvent) => {
      const { x, y } = e.detail;
      // Centrar la vista en la posición seleccionada
      setPosition({
        x: -x + (canvasRef.current?.clientWidth || 0) / 2 / scale,
        y: -y + (canvasRef.current?.clientHeight || 0) / 2 / scale
      });
    };

    window.addEventListener('minimap-navigation', handleMinimapNavigation as EventListener);
    
    return () => {
      window.removeEventListener('minimap-navigation', handleMinimapNavigation as EventListener);
    };
  }, [scale]);

  // Guardar cambios en localStorage cuando cambian los nodos o conexiones
  useEffect(() => {
    if (nodes.length > 0 || connections.length > 0) {
      localStorage.setItem('architectDiagram', JSON.stringify({
        savedNodes: nodes,
        savedConnections: connections,
        savedViewport: {
          scale,
          position
        }
      }));
    }
  }, [nodes, connections, scale, position]);
  
  // Actualizar la posición del ratón para la conexión activa
  useEffect(() => {
    if (activeConnection) {
      const handleMouseMove = (e: MouseEvent) => {
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;
        
        // Actualizar la posición actual del cursor para la conexión activa
        setActiveConnection(prev => prev ? {
          ...prev,
          currentX: e.clientX - canvasRect.left,
          currentY: e.clientY - canvasRect.top
        } : null);
      };
      
      const handleMouseUp = () => {
        // Si se suelta el ratón fuera de un nodo destino, cancelar la conexión
        setActiveConnection(null);
      };
      
      // Añadir listeners globales para seguir el movimiento incluso fuera del canvas
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [activeConnection]);
  
  // Manejar zoom con rueda del ratón
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        const newScale = Math.min(Math.max(scale + delta, 0.25), 3);
        
        // Obtener posición del cursor relativa al canvas
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;
        
        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;
        
        // Ajustar posición para mantener el punto bajo el cursor
        const newPosition = {
          x: position.x - ((mouseX - position.x) * delta / scale),
          y: position.y - ((mouseY - position.y) * delta / scale)
        };
        
        setScale(newScale);
        setPosition(newPosition);
        logDebug(`Zoom: ${Math.round(newScale * 100)}%`);
      }
    };
    
    const currentCanvas = canvasRef.current;
    if (currentCanvas) {
      currentCanvas.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (currentCanvas) {
        currentCanvas.removeEventListener('wheel', handleWheel);
      }
    };
  }, [scale, position]);
  
  // Manejar eventos de teclado para detectar la tecla espacio
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
        logDebug('Modo navegación activado (espacio)');
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
        logDebug('Modo navegación desactivado');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Iniciar arrastre del canvas (pan)
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Solo activar pan si hacemos clic con botón central, tecla Alt, o espacio presionado
    if (e.button === 1 || e.altKey || isSpacePressed) { 
      e.preventDefault();
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };
  
  // Mover el canvas mientras se arrastra
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas && dragStart) {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      setPosition(newPosition);
    }
  };
  
  // Finalizar arrastre del canvas
  const handleCanvasMouseUp = () => {
    if (isDraggingCanvas) {
      setIsDraggingCanvas(false);
      setDragStart(null);
    }
  };
  
  // Resetear zoom y posición
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    logDebug("Vista reseteada");
  };
  
  // Zoom in
  const zoomIn = () => {
    const newScale = Math.min(scale + 0.1, 3);
    setScale(newScale);
    logDebug(`Zoom: ${Math.round(newScale * 100)}%`);
  };
  
  // Zoom out
  const zoomOut = () => {
    const newScale = Math.max(scale - 0.1, 0.25);
    setScale(newScale);
    logDebug(`Zoom: ${Math.round(newScale * 100)}%`);
  };
  
  // Manejar eventos de arrastrar y soltar
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    // Añadido log para verificar si el evento se está activando
    console.log("Drag over event on canvas");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Detener propagación para evitar conflictos
    
    logDebug("Drop event triggered");
    console.log("Drop event on canvas", e.dataTransfer.types);

    try {
      let data;
      let parsedData;
      
      // Primero probar con texto plano porque es más confiable en todos los navegadores
      if (e.dataTransfer.types.includes('text/plain')) {
        try {
          data = e.dataTransfer.getData('text/plain');
          console.log("Datos obtenidos de text/plain:", data);
          
          if (data) {
            parsedData = JSON.parse(data);
            if (parsedData && parsedData.id && parsedData.type) {
              logDebug(`Datos válidos recuperados (text/plain): ${data}`);
              addNodeToCanvas(parsedData.id, parsedData.type, parsedData.text || "", e);
              return;
            }
          }
        } catch (jsonError) {
          console.warn("Error al parsear datos de text/plain:", jsonError);
        }
      }
      
      // Si no funcionó con text/plain, intentar con application/reactflow
      if (e.dataTransfer.types.includes('application/reactflow')) {
        try {
          data = e.dataTransfer.getData('application/reactflow');
          console.log("Datos obtenidos de application/reactflow:", data);
          
          if (data) {
            parsedData = JSON.parse(data);
            if (parsedData && parsedData.id && parsedData.type) {
              logDebug(`Datos válidos recuperados (application/reactflow): ${data}`);
              addNodeToCanvas(parsedData.id, parsedData.type, parsedData.text || "", e);
              return;
            }
          }
        } catch (jsonError) {
          console.error("Error al parsear datos de application/reactflow:", jsonError);
        }
      }
      
      // Si llegamos aquí, no se encontraron datos válidos
      logDebug("No se encontraron datos válidos en el evento drop");
      console.warn("No se pudieron obtener datos válidos del evento drop");
      
      // Como último recurso, intenta obtener cualquier otro tipo de datos disponible
      if (e.dataTransfer.types.length > 0) {
        const availableTypes = e.dataTransfer.types;
        console.log("Tipos de datos disponibles:", availableTypes);
        
        for (const type of availableTypes) {
          if (type !== 'text/plain' && type !== 'application/reactflow') {
            try {
              const altData = e.dataTransfer.getData(type);
              console.log(`Datos de tipo ${type}:`, altData);
            } catch (err) {
              console.warn(`Error al obtener datos de tipo ${type}:`, err);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error al procesar evento drop:', error);
      logDebug(`Error general: ${error}`);
    }
  };

  // Función auxiliar para añadir un nodo al canvas
  const addNodeToCanvas = (id: string, type: string, text: string = "", e: React.DragEvent) => {
    // Obtener la posición del mouse relativa al canvas
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) {
      logDebug("No se pudo obtener el rect del canvas");
      return;
    }

    // Calcular posición ajustada al zoom y scroll del canvas
    // Importante: Usamos canvasPosition en lugar de position para evitar conflicto de nombres
    const canvasPosition = position; // Referencia al estado actual de posición
    const nodePosition = {
      x: (e.clientX - canvasRect.left - canvasPosition.x) / scale,
      y: (e.clientY - canvasRect.top - canvasPosition.y) / scale,
    };

    // Generar ID único
    const uniqueId = `${id}-${Date.now()}`;
    
    // Configurar tamaño según el tipo
    let size = { width: 120, height: 120 };
    
    if (id.includes('person')) {
      size = { width: 150, height: 150 };
    } else if (id.includes('database')) {
      size = { width: 120, height: 140 };
    }

    logDebug(`Añadiendo nodo en (${nodePosition.x}, ${nodePosition.y})`);

    // Agregar nodo al estado
    setNodes(prevNodes => [
      ...prevNodes,
      { 
        id: uniqueId, 
        type, 
        position: nodePosition,
        size,
        text: text || ""
      }
    ]);
  };
  
  // Iniciar una conexión desde un nodo
  const handleConnectionStart = (
    nodeId: string, 
    position: ConnectionPosition, 
    x: number, 
    y: number
  ) => {
    logDebug(`Iniciando conexión desde nodo ${nodeId} en posición ${position}`);
    
    setActiveConnection({
      sourceId: nodeId,
      sourcePosition: position,
      sourceX: x,
      sourceY: y,
      currentX: x,
      currentY: y
    });
  };
  
  // Finalizar una conexión en un nodo destino
  const handleConnectionEnd = (targetNodeId: string) => {
    if (!activeConnection) {
      return;
    }
    
    // Evitar conexiones a uno mismo
    if (activeConnection.sourceId === targetNodeId) {
      logDebug("No se puede conectar un nodo consigo mismo");
      return;
    }
    
    logDebug(`Finalizando conexión en nodo ${targetNodeId}`);
    
    // Encontrar el nodo destino
    const targetNode = nodes.find(node => node.id === targetNodeId);
    if (!targetNode) {
      logDebug("Nodo destino no encontrado");
      return;
    }
    
    // Determinar en qué lado del nodo destino termina la conexión
    let targetPosition: ConnectionPosition = 'left';
    let targetX = targetNode.position.x;
    let targetY = targetNode.position.y + targetNode.size.height / 2;
    
    const nodeRight = targetNode.position.x + targetNode.size.width;
    const nodeBottom = targetNode.position.y + targetNode.size.height;
    const nodeHorizontalCenter = targetNode.position.x + targetNode.size.width / 2;
    const nodeVerticalCenter = targetNode.position.y + targetNode.size.height / 2;
    
    // Si tenemos una conexión activa, usamos el punto donde está el cursor
    if (activeConnection.currentX && activeConnection.currentY) {
      // Convertir las coordenadas del cursor al espacio del canvas
      const currentX = (activeConnection.currentX - position.x) / scale;
      const currentY = (activeConnection.currentY - position.y) / scale;
      
      // Calcular a qué lado está más cercano el cursor
      const distanceToLeft = Math.abs(targetNode.position.x - currentX);
      const distanceToRight = Math.abs(nodeRight - currentX);
      const distanceToTop = Math.abs(targetNode.position.y - currentY);
      const distanceToBottom = Math.abs(nodeBottom - currentY);
      
      const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);
      
      if (minDistance === distanceToLeft) {
        targetPosition = 'left';
        targetX = targetNode.position.x;
        targetY = nodeVerticalCenter;
      } else if (minDistance === distanceToRight) {
        targetPosition = 'right';
        targetX = nodeRight;
        targetY = nodeVerticalCenter;
      } else if (minDistance === distanceToTop) {
        targetPosition = 'top';
        targetX = nodeHorizontalCenter;
        targetY = targetNode.position.y;
      } else {
        targetPosition = 'bottom';
        targetX = nodeHorizontalCenter;
        targetY = nodeBottom;
      }
    }
    
    // Crear una nueva conexión con propiedades predeterminadas completas
    const newConnection: ConnectionType = {
      id: `conn-${Date.now()}`,
      sourceId: activeConnection.sourceId,
      targetId: targetNodeId,
      sourcePosition: activeConnection.sourcePosition,
      targetPosition,
      sourceX: activeConnection.sourceX,
      sourceY: activeConnection.sourceY,
      targetX,
      targetY,
      style: 'solid',
      animation: 'none',
      startArrowHead: 'none',
      endArrowHead: 'arrow',
      color: '#000000',
      strokeWidth: 2
    };
    
    logDebug(`Conexión creada entre ${activeConnection.sourceId} y ${targetNodeId}`);
    
    // Añadir la nueva conexión
    setConnections(prevConnections => [...prevConnections, newConnection]);
    
    // Restablecer la conexión activa
    setActiveConnection(null);
  };

  // Eliminar un nodo
  const handleDeleteNode = (nodeId: string) => {
    // Eliminar el nodo
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    
    // Eliminar conexiones relacionadas
    setConnections(prevConnections => 
      prevConnections.filter(conn => conn.sourceId !== nodeId && conn.targetId !== nodeId)
    );
    
    logDebug(`Nodo ${nodeId} y sus conexiones eliminados`);
  };

  // Actualizar posición de un nodo y sus conexiones
  const handleNodeMove = (nodeId: string, newPosition: { x: number, y: number }) => {
    // Encontrar el nodo
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    // Guardar la posición anterior para cálculos
    const oldPosition = { ...node.position };
    
    // Actualizar el nodo
    setNodes(prevNodes => 
      prevNodes.map(n => 
        n.id === nodeId ? { ...n, position: newPosition } : n
      )
    );
    
    // Actualizar las conexiones relacionadas con este nodo
    setConnections(prevConnections => 
      prevConnections.map(connection => {
        // Crear una copia para no modificar el original
        const updatedConnection = { ...connection };
        
        // Si el nodo es el origen de la conexión
        if (connection.sourceId === nodeId) {
          // Calcular el desplazamiento del nodo
          const deltaX = newPosition.x - oldPosition.x;
          const deltaY = newPosition.y - oldPosition.y;
          
          // Aplicar el mismo desplazamiento al punto de conexión
          updatedConnection.sourceX += deltaX;
          updatedConnection.sourceY += deltaY;
          
          // Además, asegurar que la posición está correcta según el lado del nodo
          switch (connection.sourcePosition) {
            case 'top':
              updatedConnection.sourceX = newPosition.x + node.size.width / 2;
              updatedConnection.sourceY = newPosition.y;
              break;
            case 'right':
              updatedConnection.sourceX = newPosition.x + node.size.width;
              updatedConnection.sourceY = newPosition.y + node.size.height / 2;
              break;
            case 'bottom':
              updatedConnection.sourceX = newPosition.x + node.size.width / 2;
              updatedConnection.sourceY = newPosition.y + node.size.height;
              break;
            case 'left':
              updatedConnection.sourceX = newPosition.x;
              updatedConnection.sourceY = newPosition.y + node.size.height / 2;
              break;
          }
        }
        
        // Si el nodo es el destino de la conexión
        if (connection.targetId === nodeId) {
          // Calcular el desplazamiento del nodo
          const deltaX = newPosition.x - oldPosition.x;
          const deltaY = newPosition.y - oldPosition.y;
          
          // Aplicar el mismo desplazamiento al punto de conexión
          updatedConnection.targetX += deltaX;
          updatedConnection.targetY += deltaY;
          
          // Además, asegurar que la posición está correcta según el lado del nodo
          switch (connection.targetPosition) {
            case 'top':
              updatedConnection.targetX = newPosition.x + node.size.width / 2;
              updatedConnection.targetY = newPosition.y;
              break;
            case 'right':
              updatedConnection.targetX = newPosition.x + node.size.width;
              updatedConnection.targetY = newPosition.y + node.size.height / 2;
              break;
            case 'bottom':
              updatedConnection.targetX = newPosition.x + node.size.width / 2;
              updatedConnection.targetY = newPosition.y + node.size.height;
              break;
            case 'left':
              updatedConnection.targetX = newPosition.x;
              updatedConnection.targetY = newPosition.y + node.size.height / 2;
              break;
          }
        }
        
        return updatedConnection;
      })
    );
  };

  // Actualizar tamaño de un nodo y sus conexiones
  const handleNodeResize = (nodeId: string, newSize: { width: number, height: number }) => {
    // Encontrar el nodo
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    // Actualizar el nodo e incluir tamaño en el tipo para persistencia
    setNodes(prevNodes => 
      prevNodes.map(n => {
        if (n.id !== nodeId) return n;
        
        // Verificar si ya tiene un tamaño codificado en el tipo
        const currentType = n.type;
        const typeWithoutSize = currentType.replace(/\s+size:\d+x\d+$/, '');
        
        // Añadir el tamaño actualizado como parte del tipo (para persistencia)
        const newType = `${typeWithoutSize} size:${Math.round(newSize.width)}x${Math.round(newSize.height)}`;
        
        return { 
          ...n, 
          size: newSize,
          type: newType
        };
      })
    );
    
    // Obtener la posición actualizada
    const position = nodes.find(n => n.id === nodeId)?.position || { x: 0, y: 0 };
    
    // Actualizar las conexiones relacionadas de manera similar al movimiento
    setConnections(prevConnections => 
      prevConnections.map(connection => {
        const updatedConnection = { ...connection };
        
        if (connection.sourceId === nodeId) {
          switch (connection.sourcePosition) {
            case 'top':
              updatedConnection.sourceX = position.x + newSize.width / 2;
              updatedConnection.sourceY = position.y;
              break;
            case 'right':
              updatedConnection.sourceX = position.x + newSize.width;
              updatedConnection.sourceY = position.y + newSize.height / 2;
              break;
            case 'bottom':
              updatedConnection.sourceX = position.x + newSize.width / 2;
              updatedConnection.sourceY = position.y + newSize.height;
              break;
            case 'left':
              updatedConnection.sourceX = position.x;
              updatedConnection.sourceY = position.y + newSize.height / 2;
              break;
          }
        }
        
        if (connection.targetId === nodeId) {
          switch (connection.targetPosition) {
            case 'top':
              updatedConnection.targetX = position.x + newSize.width / 2;
              updatedConnection.targetY = position.y;
              break;
            case 'right':
              updatedConnection.targetX = position.x + newSize.width;
              updatedConnection.targetY = position.y + newSize.height / 2;
              break;
            case 'bottom':
              updatedConnection.targetX = position.x + newSize.width / 2;
              updatedConnection.targetY = position.y + newSize.height;
              break;
            case 'left':
              updatedConnection.targetX = position.x;
              updatedConnection.targetY = position.y + newSize.height / 2;
              break;
          }
        }
        
        return updatedConnection;
      })
    );
    
    logDebug(`Nodo ${nodeId} redimensionado a ${newSize.width}x${newSize.height}`);
  };

  // Manejar la selección de una conexión
  const handleConnectionSelect = (connectionId: string) => {
    console.log('Conexión seleccionada:', connectionId);
    setSelectedConnectionId(connectionId);
  };

  const deleteConnection = (connectionId: string) => {
    console.log('Eliminando conexión:', connectionId);
    setConnections((prevConnections) => 
      prevConnections.filter((connection) => connection.id !== connectionId)
    );
    // Si la conexión eliminada estaba seleccionada, deseleccionarla
    if (selectedConnectionId === connectionId) {
      setSelectedConnectionId(null);
    }
  };

  // Actualizar propiedades de una conexión cuando cambian en el componente Arrow
  const updateConnectionProperties = (
    connectionId: string, 
    properties: {
      style?: 'solid' | 'dashed' | 'dotted';
      animation?: 'none' | 'pulse' | 'flow' | 'dash' | 'traveling-dot' | 'traveling-dot-fast' | 'traveling-dot-fastest';
      startArrowHead?: 'none' | 'arrow' | 'circle' | 'diamond';
      endArrowHead?: 'none' | 'arrow' | 'circle' | 'diamond';
      color?: string;
      strokeWidth?: number;
    }
  ) => {
    setConnections(prevConnections => 
      prevConnections.map(conn => 
        conn.id === connectionId ? { ...conn, ...properties } : conn
      )
    );
    
    logDebug(`Propiedades de conexión actualizadas: ${JSON.stringify(properties)}`);
  };

  // Exportar diagrama a JSON
  const exportDiagram = () => {
    // Calcular los límites del diagrama completo
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    // Considerar todos los nodos
    nodes.forEach(node => {
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + node.size.width);
      maxY = Math.max(maxY, node.position.y + node.size.height);
    });
    
    // Considerar también todas las conexiones
    connections.forEach(conn => {
      minX = Math.min(minX, conn.sourceX, conn.targetX);
      minY = Math.min(minY, conn.sourceY, conn.targetY);
      maxX = Math.max(maxX, conn.sourceX, conn.targetX);
      maxY = Math.max(maxY, conn.sourceY, conn.targetY);
    });
    
    // Ajustar con un margen de seguridad
    const padding = 100;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    
    // Crear objeto de diagrama completo con metadatos
    const diagram = {
      version: "1.0",
      nodes,
      connections,
      viewport: {
        scale,
        position
      },
      boundingBox: {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX,
        height: maxY - minY
      },
      metadata: {
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        connectionCount: connections.length,
        diagramSize: {
          width: maxX - minX,
          height: maxY - minY
        }
      }
    };
    
    // Convertir a JSON con formato
    const jsonString = JSON.stringify(diagram, null, 2);
    
    // Crear blob y link de descarga
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Crear elemento de enlace para descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagrama-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    logDebug(`Diagrama exportado: ${nodes.length} nodos, ${connections.length} conexiones, tamaño: ${Math.round(maxX - minX)}x${Math.round(maxY - minY)}`);
  };
  
  // Importar diagrama desde archivo JSON
  const importDiagram = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const diagram = JSON.parse(content);
        
        // Verificar que el JSON tenga la estructura esperada
        if (!diagram.nodes || !Array.isArray(diagram.nodes) || 
            !diagram.connections || !Array.isArray(diagram.connections)) {
          throw new Error("Formato de diagrama inválido");
        }
        
        // Establecer nodos y conexiones
        setNodes(diagram.nodes);
        
        // Asegurar que todas las conexiones tengan propiedades completas
        const connectionsWithDefaults = diagram.connections.map((conn: ConnectionType) => ({
          id: conn.id,
          sourceId: conn.sourceId,
          targetId: conn.targetId,
          sourcePosition: conn.sourcePosition,
          targetPosition: conn.targetPosition,
          sourceX: conn.sourceX,
          sourceY: conn.sourceY,
          targetX: conn.targetX,
          targetY: conn.targetY,
          style: conn.style || 'solid',
          animation: conn.animation || 'none',
          startArrowHead: conn.startArrowHead || 'none',
          endArrowHead: conn.endArrowHead || 'arrow',
          color: conn.color || '#000000',
          strokeWidth: conn.strokeWidth || 2
        }));
        
        setConnections(connectionsWithDefaults);
        
        // Restaurar viewport si existe
        if (diagram.viewport) {
          setScale(diagram.viewport.scale || 1);
          setPosition(diagram.viewport.position || { x: 0, y: 0 });
        }
        
        logDebug(`Diagrama importado: ${diagram.nodes.length} nodos, ${connectionsWithDefaults.length} conexiones`);
      } catch (error) {
        console.error("Error al importar diagrama:", error);
        logDebug(`Error importando: ${error}`);
      }
      
      // Resetear input para permitir cargar el mismo archivo nuevamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  };
  
  // Trigger para abrir el selector de archivos
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      ref={canvasRef}
      className="flex-1 bg-slate-100 relative overflow-hidden border border-gray-300"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
      style={{ 
        minHeight: '400px',
        cursor: isDraggingCanvas 
          ? 'grabbing' 
          : isSpacePressed 
            ? 'grab' 
            : 'default'
      }}
    >
      {/* Capa de transformación para zoom/pan */}
      <div 
        ref={transformRef}
        className="absolute top-0 left-0"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          transition: 'transform 0.05s ease',
          width: '100%',
          height: '100%',
          // Extender espacio virtual para elementos fuera de pantalla
          minWidth: '10000px',
          minHeight: '10000px',
          overflow: 'visible'
        }}
      >
        {/* Renderizar las conexiones existentes */}
        {connections.map((connection) => (
          <Arrow
            key={connection.id}
            id={connection.id}
            startX={connection.sourceX}
            startY={connection.sourceY}
            endX={connection.targetX}
            endY={connection.targetY}
            startPosition={connection.sourcePosition}
            endPosition={connection.targetPosition}
            style={connection.style}
            animation={connection.animation}
            startArrowHead={connection.startArrowHead}
            endArrowHead={connection.endArrowHead}
            color={connection.color || 'rgba(99, 102, 241, 0.8)'}
            strokeWidth={connection.strokeWidth}
            isSelected={selectedConnectionId === connection.id}
            onSelect={handleConnectionSelect}
            onPropertiesChange={(properties) => updateConnectionProperties(connection.id, properties)}
            onDelete={deleteConnection}
          />
        ))}
        
        {/* Renderizar los nodos */}
        {nodes.map(node => (
          <CanvasNode 
            key={node.id} 
            id={node.id} 
            type={node.type} 
            position={node.position}
            text={node.text}
            onConnectionStart={isSpacePressed ? undefined : handleConnectionStart}
            onConnectionEnd={isSpacePressed ? undefined : handleConnectionEnd}
            onNodeMove={isSpacePressed ? undefined : handleNodeMove}
            onNodeResize={isSpacePressed ? undefined : handleNodeResize}
            onDeleteNode={isSpacePressed ? undefined : handleDeleteNode}
            disabled={isSpacePressed}
          />
        ))}
      </div>

      {/* Renderizar la conexión activa (mientras se está arrastrando) - fuera de la capa de transformación */}
      {activeConnection && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" 
             style={{ zIndex: 15, overflow: "visible" }}>
          {/* Utilizamos una Bezier simple para la conexión durante el arrastre */}
          <path
            d={`M ${activeConnection.sourceX * scale + position.x} ${activeConnection.sourceY * scale + position.y} 
                C ${activeConnection.sourceX * scale + position.x + 50} ${activeConnection.sourceY * scale + position.y},
                  ${activeConnection.currentX - 50} ${activeConnection.currentY},
                  ${activeConnection.currentX} ${activeConnection.currentY}`}
            fill="none"
            stroke="rgba(79, 70, 229, 0.7)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          {/* Punto de inicio */}
          <circle 
            cx={activeConnection.sourceX * scale + position.x} 
            cy={activeConnection.sourceY * scale + position.y} 
            r="4" 
            fill="rgba(79, 70, 229, 1)" 
          />
          {/* Punto final (cursor) */}
          <circle 
            cx={activeConnection.currentX} 
            cy={activeConnection.currentY} 
            r="4" 
            fill="rgba(79, 70, 229, 0.7)" 
          />
        </svg>
      )}
      
      {/* Input oculto para importar archivos */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importDiagram}
        style={{ display: 'none' }}
      />
      
      {/* Controles de zoom */}
      <div className="absolute top-4 right-4 bg-white shadow-md rounded-md flex z-50">
        <button 
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none" 
          onClick={zoomIn}
          title="Acercar"
        >
          <span className="text-lg">+</span>
        </button>
        <button 
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 border-l border-r border-gray-200 focus:outline-none" 
          onClick={resetView}
          title="Resetear vista"
        >
          <span className="text-sm">100%</span>
        </button>
        <button 
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none" 
          onClick={zoomOut}
          title="Alejar"
        >
          <span className="text-lg">-</span>
        </button>
      </div>
      
      {/* Controles de importar/exportar */}
      <div className="absolute top-16 right-4 bg-white shadow-md rounded-md flex z-50">
        <button 
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none flex items-center" 
          onClick={exportDiagram}
          title="Exportar diagrama"
        >
          <span className="text-sm mr-1">↓</span>
          <span className="text-xs">Exportar</span>
        </button>
        <button 
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 border-l border-gray-200 focus:outline-none flex items-center" 
          onClick={triggerFileInput}
          title="Importar diagrama"
        >
          <span className="text-sm mr-1">↑</span>
          <span className="text-xs">Importar</span>
        </button>
      </div>
      
      {/* Panel de depuración */}
      <div className="absolute bottom-4 left-4 bg-black/80 text-white p-2 rounded-md shadow-md text-xs font-mono z-50">
        <div className="font-bold mb-1">Debug Log ({nodes.length} nodos, {connections.length} conexiones, zoom: {Math.round(scale * 100)}%)</div>
        {debug.map((msg, i) => (
          <div key={i} className="truncate">{msg}</div>
        ))}
        <div className="mt-2 flex space-x-2 flex-wrap">
          <button 
            className="px-2 py-1 bg-blue-500 rounded text-xs"
            onClick={() => {
              logDebug("Creando nodo de ejemplo desde el panel de debug");
              
              // Calcular posición centrada
              const canvasWidth = canvasRef.current?.clientWidth || 800;
              const canvasHeight = canvasRef.current?.clientHeight || 600;
              
              // Evitar conflicto de nombres usando currentPosition
              const currentPosition = position;
              const currentScale = scale;
              
              const exampleNode = {
                id: `example-${Date.now()}`,
                type: 'square',
                position: { 
                  // Ajustamos la posición para que esté centrada respecto al viewport actual
                  x: ((canvasWidth / 2) - 60) / currentScale - currentPosition.x / currentScale, 
                  y: ((canvasHeight / 2) - 60) / currentScale - currentPosition.y / currentScale
                },
                size: { width: 120, height: 120 },
                text: 'Nodo de Prueba'
              };
              
              console.log("Creando nodo de ejemplo en:", exampleNode.position);
              
              // Agregar el nodo y asegurar que se refleje inmediatamente
              setNodes(prev => [...prev, exampleNode]);
              
              // Asegurar que se guarde
              setTimeout(() => {
                localStorage.setItem('architectDiagram', JSON.stringify({
                  savedNodes: [...nodes, exampleNode],
                  savedConnections: connections,
                  savedViewport: {
                    scale: currentScale,
                    position: currentPosition
                  }
                }));
              }, 100);
            }}
          >
            Test Node
          </button>
          <button 
            className="px-2 py-1 bg-green-500 rounded text-xs"
            onClick={exportDiagram}
          >
            Exportar JSON
          </button>
          <button 
            className="px-2 py-1 bg-blue-500 rounded text-xs"
            onClick={triggerFileInput}
          >
            Importar JSON
          </button>
          <button 
            className="px-2 py-1 bg-red-500 rounded text-xs"
            onClick={() => {
              setNodes([]);
              setConnections([]);
              setDebug([]);
              resetView();
              localStorage.removeItem('architectDiagram');
              logDebug("Canvas limpiado");
            }}
          >
            Clear All
          </button>
        </div>
      </div>
      
      {/* Mini Map simplificado */}
      <MiniMap 
        nodes={nodes}
        connections={connections}
        scale={scale}
        position={position}
        viewportSize={{
          width: canvasRef.current?.clientWidth || 0,
          height: canvasRef.current?.clientHeight || 0
        }}
      />
      
      {/* Mensaje de ayuda */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-40 p-6">
          <div className="glass-panel rounded-xl max-w-md p-6 text-center fade-in">
            <div className="mb-4 font-bold text-lg text-gray-800">Empieza tu diagrama</div>
            <div className="text-sm text-gray-600 mb-6">
              El canvas está vacío. Arrastra elementos desde el panel lateral para comenzar a crear tu diagrama de arquitectura.
            </div>
            <div className="flex flex-col gap-3 bg-white/50 p-3 rounded-lg mb-6">
              <p className="text-xs text-gray-700 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-medium">⌘</span>
                <span><strong>Zoom:</strong> Rueda del ratón + Ctrl/Cmd</span>
              </p>
              <p className="text-xs text-gray-700 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-medium">⎵</span>
                <span><strong>Navegación:</strong> Espacio + arrastrar</span>
              </p>
              <p className="text-xs text-gray-700 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-medium">⌥</span>
                <span><strong>Mover lienzo:</strong> Alt + arrastrar</span>
              </p>
            </div>
            <button 
              className="btn-primary inline-flex items-center gap-2"
              onClick={() => {
                logDebug("Creando nodo de ejemplo desde el mensaje inicial");
                
                // Calcular posición centrada
                const canvasWidth = canvasRef.current?.clientWidth || 800;
                const canvasHeight = canvasRef.current?.clientHeight || 600;
                
                // Evitar conflicto de nombres usando currentPosition
                const currentPosition = position;
                const currentScale = scale;
                
                const exampleNode = {
                  id: `example-${Date.now()}`,
                  type: 'square',
                  position: { 
                    // Calculamos una posición centrada en el viewport actual
                    x: ((canvasWidth / 2) - 60) / currentScale - currentPosition.x / currentScale, 
                    y: ((canvasHeight / 2) - 60) / currentScale - currentPosition.y / currentScale
                  },
                  size: { width: 120, height: 120 },
                  text: 'Ejemplo'
                };
                
                console.log("Creando nodo de ejemplo en:", exampleNode.position);
                
                // Agregar el nodo y asegurar que se refleje inmediatamente
                setNodes([exampleNode]);
                
                // Asegurar que se guarde
                setTimeout(() => {
                  localStorage.setItem('architectDiagram', JSON.stringify({
                    savedNodes: [exampleNode],
                    savedConnections: [],
                    savedViewport: {
                      scale: currentScale,
                      position: currentPosition
                    }
                  }));
                }, 100);
              }}
            >
              <span>Crear Nodo de Ejemplo</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Instrucciones para crear conexiones */}
      {nodes.length > 0 && !activeConnection && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 glass-panel px-4 py-2 rounded-full text-sm font-medium shadow-md z-50 fade-in text-gray-700">
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
            Pasa el ratón sobre un nodo y haz clic en un punto de conexión
          </span>
        </div>
      )}
      
      {/* Mensaje mientras se arrastra una conexión */}
      {activeConnection && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 glass-panel px-4 py-2 rounded-full text-sm font-medium shadow-md z-50 fade-in bg-primary/10 text-primary">
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a7 7 0 0 0-7 7c0 2.44 2.19 3.66 3.75 4.8 1.56 1.15 2.25 2.36 2.25 4.2"></path><path d="M12 5a7 7 0 0 1 7 7c0 2.44-2.19 3.66-3.75 4.8-1.56 1.15-2.25 2.36-2.25 4.2"></path><line x1="5" y1="19" x2="19" y2="19"></line></svg>
            Suelta sobre otro nodo para conectarlos
          </span>
        </div>
      )}
      
      {/* Indicador de modo navegación */}
      {isSpacePressed && !isDraggingCanvas && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 glass-panel bg-secondary/80 px-4 py-2 rounded-full text-sm font-medium shadow-md z-50 text-gray-700 fade-in">
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            Modo navegación - Haz clic y arrastra para moverte
          </span>
        </div>
      )}
    </div>
  );
}
