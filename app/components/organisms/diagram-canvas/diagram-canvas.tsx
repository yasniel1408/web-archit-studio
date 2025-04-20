"use client";

import React, { useState, useRef, useEffect } from 'react';
import { CanvasNode } from '@/app/components/molecules/canvas-node/canvas-node';
import { ConnectionPosition } from '@/app/components/atoms/connection-point/connection-point';
import { Arrow } from '@/app/components/atoms/arrow/arrow';
import { MiniMap } from '@/app/components/molecules/mini-map/mini-map';
import { IconType } from '@/app/components/atoms/icon-selector/types';

export type NodeType = {
  id: string;
  position: { x: number; y: number };
  text: string;
  type: string;
  size: { width: number; height: number };
  icon?: IconType;
  backgroundColor?: string;
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
  
  // Estado para el modal de JSON
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [formattedJson, setFormattedJson] = useState<string>('');
  
  // Estado para el modal de plantillas
  const [showTemplatesModal, setShowTemplatesModal] = useState<boolean>(false);
  
  // Plantillas de ejemplo predefinidas
  const exampleTemplates = [
    {
      id: 'serverless',
      name: 'Arquitectura Serverless',
      description: 'Arquitectura basada en servicios serverless con API Gateway, funciones Lambda y servicios de almacenamiento.',
      image: '/templates/serverless.png',
      "version": "1.0",
      "nodes": [
        {
          "id": "api-gateway",
          "type": "square size:490x145",
          "position": {
            "x": 217,
            "y": -14
          },
          "size": {
            "width": 490,
            "height": 145
          },
          "text": "API Gateway",
          "iconType": "api"
        },
        {
          "id": "auth-lambda",
          "type": "square size:177x144",
          "position": {
            "x": 121,
            "y": 250
          },
          "size": {
            "width": 177,
            "height": 144
          },
          "text": "Auth Lambda",
          "iconType": "cloud"
        },
        {
          "id": "users-lambda",
          "type": "square size:208x142",
          "position": {
            "x": 329,
            "y": 249
          },
          "size": {
            "width": 208,
            "height": 142
          },
          "text": "Users Lambda",
          "iconType": "cloud"
        },
        {
          "id": "dynamo-users",
          "type": "square size:192x130",
          "position": {
            "x": 312,
            "y": 503
          },
          "size": {
            "width": 192,
            "height": 130
          },
          "text": "DynamoDB Users",
          "iconType": "database"
        },
        {
          "id": "s3-storage",
          "type": "square size:164x142",
          "position": {
            "x": 657,
            "y": 315
          },
          "size": {
            "width": 164,
            "height": 142
          },
          "text": "S3 Storage",
          "iconType": "database"
        }
      ],
      "connections": [
        {
          "id": "conn-1",
          "sourceId": "api-gateway",
          "targetId": "auth-lambda",
          "sourcePosition": "bottom",
          "targetPosition": "top",
          "sourceX": 462,
          "sourceY": 131,
          "targetX": 209.5,
          "targetY": 250,
          "style": "solid",
          "animation": "traveling-dot-fastest",
          "startArrowHead": "none",
          "endArrowHead": "arrow",
          "color": "#6200ee",
          "strokeWidth": 2
        },
        {
          "id": "conn-2",
          "sourceId": "api-gateway",
          "targetId": "users-lambda",
          "sourcePosition": "bottom",
          "targetPosition": "top",
          "sourceX": 462,
          "sourceY": 131,
          "targetX": 433,
          "targetY": 249,
          "style": "solid",
          "animation": "traveling-dot",
          "startArrowHead": "none",
          "endArrowHead": "arrow",
          "color": "#6200ee",
          "strokeWidth": 2
        },
        {
          "id": "conn-3",
          "sourceId": "users-lambda",
          "targetId": "dynamo-users",
          "sourcePosition": "bottom",
          "targetPosition": "top",
          "sourceX": 433,
          "sourceY": 391,
          "targetX": 408,
          "targetY": 503,
          "style": "solid",
          "animation": "none",
          "startArrowHead": "none",
          "endArrowHead": "arrow",
          "color": "#000000",
          "strokeWidth": 2
        },
        {
          "id": "conn-4",
          "sourceId": "users-lambda",
          "targetId": "s3-storage",
          "sourcePosition": "right",
          "targetPosition": "left",
          "sourceX": 537,
          "sourceY": 320,
          "targetX": 657,
          "targetY": 386,
          "style": "solid",
          "animation": "none",
          "startArrowHead": "none",
          "endArrowHead": "arrow",
          "color": "#000000",
          "strokeWidth": 2
        }
      ],
      "viewport": {
        "scale": 0.8499999999999999,
        "position": {
          "x": 183.55459555555558,
          "y": 131.49277291005296
        }
      },
      "metadata": {
        "exportedAt": "2025-04-20T05:14:56.389Z",
        "nodeCount": 5,
        "connectionCount": 4
      }
    }
  ];
  
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
        
        // Cargar nodos, asegurándose de que todos los campos estén presentes
        const nodesWithCorrectProps = (savedNodes || []).map((node: any) => ({
          id: node.id,
          position: node.position,
          text: node.text || "",
          type: node.type || "square",
          size: node.size || { width: 140, height: 80 },
          // Corregir el mapeo: usar node.icon o node.iconType (para compatibilidad)
          icon: node.icon || node.iconType || undefined,
          backgroundColor: node.backgroundColor || undefined
        }));
        
        console.log("Nodos cargados desde localStorage:", nodesWithCorrectProps);
        nodesWithCorrectProps.forEach(node => {
          if (node.backgroundColor) {
            console.log(`Nodo ${node.id} tiene backgroundColor: ${node.backgroundColor}`);
          }
        });
        
        setNodes(nodesWithCorrectProps);
        
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
        
        logDebug(`Cargados ${nodesWithCorrectProps.length} nodos y ${connectionsWithDefaultProps.length} conexiones del almacenamiento local`);
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
    
    // Actualizar el nodo - usar transformación directa para evitar retardo visual
    const updatedNode = { ...node, position: newPosition };
    
    // Actualizar el estado de los nodos
    setNodes(prevNodes => 
      prevNodes.map(n => n.id === nodeId ? updatedNode : n)
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
    // Crear objeto de diagrama completo
    const diagram = {
      version: "1.0",
      // Asegurar que todos los campos correctos se incluyen en el diagrama exportado
      nodes: nodes.map(node => ({
        ...node,
        // Incluir explícitamente icon y backgroundColor para asegurar la persistencia
        icon: node.icon,
        backgroundColor: node.backgroundColor
      })),
      connections,
      viewport: {
        scale,
        position
      },
      metadata: {
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        connectionCount: connections.length
      }
    };
    
    // Preparar el JSON para descarga
    const jsonString = JSON.stringify(diagram, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Crear un enlace de descarga y activarlo automáticamente
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagram_${new Date().toISOString().substring(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Liberar URL
    URL.revokeObjectURL(url);
    
    logDebug("Diagrama exportado a archivo JSON");
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

  // Añadir función para actualizar propiedades de un nodo (como el iconType)
  const updateNodeProperties = (
    nodeId: string,
    properties: Partial<NodeType>
  ) => {
    console.log(`Actualizando propiedades del nodo ${nodeId}:`, properties);
    
    // Si se está actualizando el color de fondo, log especial
    if (properties.backgroundColor) {
      console.log(`Actualizando backgroundColor del nodo ${nodeId} a: ${properties.backgroundColor}`);
    }
    
    setNodes(prevNodes =>
      prevNodes.map(node => {
        if (node.id === nodeId) {
          const updatedNode = { ...node, ...properties };
          console.log(`Nodo ${nodeId} actualizado:`, updatedNode);
          return updatedNode;
        }
        return node;
      })
    );
    
    logDebug(`Propiedades del nodo ${nodeId} actualizadas`);
  };

  // Función para generar y mostrar el JSON del diagrama
  const showDiagramJson = () => {
    // Crear objeto de diagrama completo
    const diagram = {
      version: "1.0",
      nodes,
      connections,
      viewport: {
        scale,
        position
      },
      metadata: {
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        connectionCount: connections.length
      }
    };
    
    // Formatear el JSON para visualización
    setFormattedJson(JSON.stringify(diagram, null, 2));
    setShowJsonModal(true);
    
    logDebug("Mostrando JSON del diagrama actual");
  };
  
  // Función para copiar el JSON al portapapeles
  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(formattedJson)
      .then(() => {
        logDebug("JSON copiado al portapapeles");
      })
      .catch(err => {
        console.error("Error al copiar al portapapeles:", err);
        logDebug("Error al copiar JSON");
      });
  };

  // Función para cargar una plantilla seleccionada
  const loadTemplate = (templateId: string) => {
    const template = exampleTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    // Limpiar el diagrama actual
    setNodes(mapTemplateNodes(template.nodes));
    setConnections(mapTemplateConnections(template.connections));
    
    // Guardar en localStorage
    localStorage.setItem('architectDiagram', JSON.stringify({
      savedNodes: template.nodes,
      savedConnections: template.connections,
      savedViewport: {
        scale: 1,
        position: { x: 0, y: 0 }
      }
    }));
    
    // Cerrar el modal y resetear la vista
    setShowTemplatesModal(false);
    resetView();
    
    logDebug(`Plantilla "${template.name}" cargada`);
  };

  // Buscar donde se definen los tipos NodeType y ConnectionType y modificar NodeType para incluir backgroundColor
  // La definición de NodeType ya existe al inicio del archivo, no debe duplicarse aquí
  /* export type NodeType = {
    id: string;
    position: { x: number; y: number };
    text: string;
    icon?: IconType;
    backgroundColor?: string;
  }; */

  // Buscar la función handleNodeChange o similar para añadir soporte para cambio de color
  const handleNodeIconChange = (nodeId: string, icon: IconType) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, icon } : node
    ));
  };

  const handleNodeColorChange = (nodeId: string, backgroundColor: string) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, backgroundColor } : node
    ));
  };

  // ... existing code ...

  // Función para manejar el cambio de punto de conexión seleccionado en un nodo
  const handleSelectedConnectionPointChange = (nodeId: string, pointId: string) => {
    // Esta función se llama cuando el usuario selecciona un punto de conexión en un nodo
    logDebug(`Punto de conexión seleccionado: ${pointId} en nodo ${nodeId}`);
    // La implementación puede ampliarse según sea necesario
  };

  // Función para obtener los puntos de conexión para un nodo específico
  const getConnectionPointsForNode = (nodeId: string) => {
    // Puedes personalizar esto según tus necesidades
    return ['top', 'right', 'bottom', 'left'];
  };

  // ... existing code ...

  // Para manejar las plantillas cargadas desde ejemplos
  const mapTemplateNodes = (templateNodes: any[]): NodeType[] => {
    return templateNodes.map(node => ({
      id: node.id,
      position: node.position,
      text: node.text || "",
      type: node.type || "square",
      size: node.size || { width: 140, height: 80 },
      // Corregir para usar icon en lugar de iconType
      icon: node.icon || node.iconType,
      backgroundColor: node.backgroundColor
    }));
  };

  // Para manejar la carga de conexiones de plantillas
  const mapTemplateConnections = (templateConnections: any[]): ConnectionType[] => {
    return templateConnections.map(conn => ({
      ...conn,
      sourcePosition: conn.sourcePosition as ConnectionPosition,
      targetPosition: conn.targetPosition as ConnectionPosition
    }));
  };

  // Buscar donde se renderiza el componente CanvasNode y añadir las nuevas props
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
        {nodes.map((node) => (
          <CanvasNode
            key={node.id}
            id={node.id}
            type={node.type || "square"}
            position={node.position}
            text={node.text}
            iconType={node.icon}
            backgroundColor={node.backgroundColor || "#FFFFFF"}
            onConnectionStart={handleConnectionStart}
            onConnectionEnd={handleConnectionEnd}
            onNodeMove={handleNodeMove}
            onNodeResize={handleNodeResize}
            onDeleteNode={handleDeleteNode}
            onPropertiesChange={(properties) => updateNodeProperties(node.id, properties)}
            disabled={false}
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
          onClick={() => setShowTemplatesModal(true)}
          title="Plantillas de ejemplo"
        >
          <span className="text-sm mr-1">✓</span>
          <span className="text-xs">Plantillas</span>
        </button>
        <button 
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none border-l border-gray-200 flex items-center" 
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
        <button 
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 border-l border-gray-200 focus:outline-none flex items-center" 
          onClick={showDiagramJson}
          title="Ver JSON del diagrama"
        >
          <span className="text-sm mr-1">{ }</span>
          <span className="text-xs">Ver JSON</span>
        </button>
      </div>
      
      {/* Modal para visualizar el JSON */}
      {showJsonModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
          onClick={() => setShowJsonModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold">JSON del Diagrama</h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm flex items-center gap-1"
                  onClick={copyJsonToClipboard}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copiar
                </button>
                <button
                  className="p-1.5 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100"
                  onClick={() => setShowJsonModal(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
              <pre className="text-sm font-mono whitespace-pre-wrap break-all bg-white p-4 rounded border border-gray-200 shadow-inner h-full overflow-auto">
                {formattedJson}
              </pre>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para plantillas de ejemplo */}
      {showTemplatesModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
          onClick={() => setShowTemplatesModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold">Plantillas de Arquitectura</h3>
              <button
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100"
                onClick={() => setShowTemplatesModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {exampleTemplates.map(template => (
                <div 
                  key={template.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  <div className="h-40 bg-gray-100 flex items-center justify-center">
                    {/* Aquí iría la imagen de preview, la dejamos como placeholder por ahora */}
                    <div className="text-center">
                      <div className="text-5xl text-gray-300 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="text-gray-500 text-sm">Vista previa no disponible</div>
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <h4 className="text-lg font-medium">{template.name}</h4>
                    <p className="text-gray-600 text-sm mt-1">{template.description}</p>
                  </div>
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
                      onClick={() => loadTemplate(template.id)}
                    >
                      Cargar plantilla
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
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
