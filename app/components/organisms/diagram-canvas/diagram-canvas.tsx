"use client";

import React, { useEffect } from 'react';
import { CanvasNode } from '@/app/components/molecules/canvas-node/canvas-node';
import { MiniMap } from '@/app/components/molecules/mini-map/mini-map';
import { ConnectionPosition } from '@/app/components/atoms/connection-point/connection-point';
import { useNodeManagement } from './hooks/useNodeManagement';
import { useConnectionManagement } from './hooks/useConnectionManagement';
import { useCanvasControls } from './hooks/useCanvasControls';
import { useDiagramPersistence } from './hooks/useDiagramPersistence';
import { useTemplates } from './hooks/useTemplates';
import { CanvasToolbar } from './components/CanvasToolbar';
import { JsonModal } from './components/JsonModal';
import { TemplatesModal } from './components/TemplatesModal';
import { CanvasConnections } from './components/CanvasConnections';
import { IconType } from '@/app/components/atoms/icon-selector/types';
import { NodeType } from './types';

export function DiagramCanvas() {
  // Hooks para el manejo de nodos y conexiones
  const {
    nodes,
    setNodes,
    addNode,
    deleteNode,
    updateNodePosition,
    updateNodeSize,
    updateNodeProperties,
    calculateConnectionPoint
  } = useNodeManagement();

  const {
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
    updateConnectionProperties
  } = useConnectionManagement();

  // Hook para controles del canvas
  const {
    canvasRef,
    transformRef,
    scale,
    position,
    isDraggingCanvas,
    isSpacePressed,
    debug,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    resetView,
    zoomIn,
    zoomOut,
    setViewport,
    getViewport,
    logDebug
  } = useCanvasControls();

  // Hook para persistencia de datos
  const {
    fileInputRef,
    showJsonModal,
    setShowJsonModal,
    formattedJson,
    showTemplatesModal,
    setShowTemplatesModal,
    saveDiagram,
    exportDiagram,
    exportToGif,
    importDiagram,
    triggerFileInput,
    showDiagramJson,
    copyJsonToClipboard,
    loadTemplate
  } = useDiagramPersistence(setNodes, setConnections, setViewport, logDebug);

  // Hook para plantillas predefinidas
  const { templates } = useTemplates();

  // Guardar cambios cuando cambian nodos o conexiones
  useEffect(() => {
    if (nodes.length > 0 || connections.length > 0) {
      saveDiagram(nodes, connections, getViewport());
    }
  }, [nodes, connections, saveDiagram, getViewport]);

  // Manejar eventos de arrastrar y soltar
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    console.log("Evento dragOver en el canvas");
  };

  // Manejar cuando se suelta un componente en el canvas
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Evento drop en el canvas");
    
    try {
      let data;
      let parsedData;
      
      // Intentar obtener datos como texto plano
      if (e.dataTransfer.types.includes('text/plain')) {
        data = e.dataTransfer.getData('text/plain');
        console.log("Datos obtenidos de text/plain:", data);
        
        if (data) {
          try {
            parsedData = JSON.parse(data);
            if (parsedData && parsedData.id && parsedData.type) {
              logDebug(`Datos válidos en formato JSON: ${data}`);
              addNodeToCanvas(parsedData.id, parsedData.type, parsedData.text || "", e);
              return;
            }
          } catch (jsonError) {
            console.warn("Error al parsear JSON:", jsonError);
            // Si no es JSON válido, podría ser un simple ID
            if (typeof data === 'string' && data.trim()) {
              const id = `${data.trim()}-${Date.now()}`;
              logDebug(`Añadiendo nodo con ID generado: ${id}`);
              addNodeToCanvas(id, 'square', data.trim(), e);
              return;
            }
          }
        }
      }
      
      // Si no se pudo procesar como texto plano, verificar otros formatos
      const availableTypes = e.dataTransfer.types;
      logDebug(`Tipos disponibles en el evento drop: ${availableTypes.join(', ')}`);
      
      // Último recurso: crear un nodo genérico
      const genericId = `node-${Date.now()}`;
      logDebug(`Creando nodo genérico: ${genericId}`);
      addNodeToCanvas(genericId, 'square', 'Nuevo nodo', e);
      
    } catch (error) {
      console.error('Error al procesar evento drop:', error);
      logDebug(`Error en el evento drop: ${error}`);
    }
  };

  // Agregar nodo al canvas cuando se arrastra un componente
  const addNodeToCanvas = (id: string, type: string, text: string = "", e: React.DragEvent) => {
    // Calcular la posición correcta en el canvas considerando el zoom y desplazamiento
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    // Para un cálculo correcto:
    // 1. Obtener la posición relativa al canvas (clientX - canvasRect.left)
    // 2. Dividir por la escala para compensar el zoom
    // 3. Restar la posición actual del canvas para compensar el desplazamiento
    const relativeX = e.clientX - canvasRect.left;
    const relativeY = e.clientY - canvasRect.top;
    
    // En un transform: scale(s) translate(x, y), las coordenadas se calculan:
    // realX = (screenX / scale) - translateX
    // realY = (screenY / scale) - translateY
    const dropX = (relativeX / scale) - position.x;
    const dropY = (relativeY / scale) - position.y;
    
    logDebug(`Posición de drop: clientX=${e.clientX}, clientY=${e.clientY}`);
    logDebug(`Canvas rect: left=${canvasRect.left}, top=${canvasRect.top}`);
    logDebug(`Posición relativa al canvas: ${relativeX}, ${relativeY}`);
    logDebug(`Escala: ${scale}, Posición canvas: ${position.x}, ${position.y}`);
    logDebug(`Posición final calculada: ${dropX}, ${dropY}`);
    
    // Extraer tamaño del tipo si se especifica (ej: "square size:200x150")
    let size = { width: 140, height: 80 }; // Tamaño predeterminado
    const sizeMatch = type.match(/size:(\d+)x(\d+)/);
    
    if (sizeMatch) {
      size = {
        width: parseInt(sizeMatch[1], 10),
        height: parseInt(sizeMatch[2], 10)
      };
      // Limpiar el tipo
      type = type.replace(/\s*size:\d+x\d+/, '');
    }
    
    // Extraer icono si se especifica (ej: "square icon:database")
    let icon: IconType | undefined = undefined;
    const iconMatch = type.match(/icon:(\w+)/);
    
    if (iconMatch) {
      icon = iconMatch[1] as IconType;
      // Limpiar el tipo
      type = type.replace(/\s*icon:\w+/, '');
    }
    
    // Crear el nuevo nodo
    addNode(id, type, text, { x: dropX, y: dropY }, size, icon);
    
    logDebug(`Nodo añadido: ${id} (${type}) en posición ${Math.round(dropX)},${Math.round(dropY)}`);
  };

  // Manejar inicio de conexión desde un punto de conexión
  const handleConnectionStart = (
    nodeId: string, 
    position: ConnectionPosition, 
    x: number, 
    y: number
  ) => {
    startConnection(nodeId, position, x, y);
    logDebug(`Iniciando conexión desde nodo ${nodeId} (punto ${position})`);
  };

  // Manejar finalización de conexión en otro nodo
  const handleConnectionEnd = (
    targetNodeId: string, 
    targetPosition: ConnectionPosition, 
    x: number, 
    y: number
  ) => {
    if (activeConnection) {
      const newConnection = completeConnection(targetNodeId, targetPosition, x, y);
      
      if (newConnection) {
        logDebug(`Conexión completada: ${activeConnection.sourceId} → ${targetNodeId}`);
      } else {
        logDebug(`Conexión cancelada: ya existe o mismo nodo`);
      }
    }
  };
  
  // Borrar un nodo y sus conexiones
  const handleDeleteNode = (nodeId: string) => {
    deleteNode(nodeId, connections, setConnections);
    logDebug(`Nodo eliminado: ${nodeId}`);
  };

  // Actualizar posición de un nodo cuando se mueve
  const handleNodeMove = (nodeId: string, newPosition: { x: number, y: number }) => {
    updateNodePosition(nodeId, newPosition, connections, setConnections);
  };

  // Actualizar tamaño de un nodo cuando se redimensiona
  const handleNodeResize = (nodeId: string, newSize: { width: number, height: number }) => {
    updateNodeSize(nodeId, newSize, connections, setConnections);
  };

  // Seleccionar una conexión
  const handleConnectionSelect = (connectionId: string) => {
    selectConnection(connectionId);
  };

  // Cambiar el icono de un nodo
  const handleNodeIconChange = (nodeId: string, icon: IconType) => {
    updateNodeProperties(nodeId, { icon });
  };

  // Cambiar el color de un nodo
  const handleNodeColorChange = (nodeId: string, backgroundColor: string) => {
    updateNodeProperties(nodeId, { backgroundColor });
  };

  // Limpiar el lienzo eliminando todos los nodos y conexiones
  const clearCanvas = () => {
    // Mostrar confirmación antes de borrar todo
    if (window.confirm('¿Estás seguro de que deseas eliminar todos los elementos del lienzo?')) {
      setNodes([]);
      setConnections([]);
      resetView();
      logDebug('Lienzo limpiado: se eliminaron todos los elementos');
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Barra de herramientas */}
      <CanvasToolbar 
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetView={resetView}
        onExport={() => exportDiagram(nodes, connections, getViewport())}
        onExportGif={() => exportToGif(transformRef, getViewport())}
        onImport={triggerFileInput}
        onShowJson={() => showDiagramJson(nodes, connections, getViewport())}
        onShowTemplates={() => setShowTemplatesModal(true)}
        onClearCanvas={clearCanvas}
        scale={scale}
      />

      {/* Espacio oculto para debug */}
      {debug.length > 0 && (
        <div className="mb-2 p-2 bg-gray-100 rounded text-xs font-mono overflow-x-auto max-h-24 overflow-y-auto">
          {debug.map((msg, i) => (
            <div key={i} className="text-gray-600">{msg}</div>
          ))}
        </div>
      )}

      {/* Canvas principal */}
      <div
        ref={canvasRef}
        className="flex-1 border rounded overflow-hidden relative bg-gray-50 cursor-grab"
        style={{ cursor: isDraggingCanvas ? 'grabbing' : isSpacePressed ? 'grab' : 'default' }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-diagram-export="true"
      >
        {/* Capa de transformación para zoom y pan */}
        <div
          ref={transformRef}
          className="absolute"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: '0 0',
            width: '100%',
            height: '100%'
          }}
        >
          {/* Conexiones */}
          <CanvasConnections
            connections={connections}
            activeConnection={activeConnection}
            canvasRef={canvasRef}
            scale={scale}
            onConnectionSelect={handleConnectionSelect}
            selectedConnectionId={selectedConnectionId}
          />

          {/* Nodos */}
          {nodes.map(node => (
            <CanvasNode
              key={node.id}
              id={node.id}
              position={node.position}
              size={node.size}
              text={node.text}
              type={node.type}
              iconType={node.icon}
              backgroundColor={node.backgroundColor}
              onNodeMove={handleNodeMove}
              onNodeResize={handleNodeResize}
              onDeleteNode={handleDeleteNode}
              onConnectionStart={handleConnectionStart}
              onConnectionEnd={handleConnectionEnd}
              onPropertiesChange={(props) => {
                if (props.icon) {
                  handleNodeIconChange(node.id, props.icon);
                }
                if (props.backgroundColor) {
                  handleNodeColorChange(node.id, props.backgroundColor);
                }
              }}
            />
          ))}
        </div>

        {/* Mini-mapa */}
        <div className="absolute bottom-4 right-4 z-10 ignore-export" data-minimap="true">
          <MiniMap
            nodes={nodes}
            connections={connections}
            scale={scale}
            position={{ x: -position.x, y: -position.y }}
            viewportSize={canvasRef.current ? 
              { width: canvasRef.current.clientWidth, height: canvasRef.current.clientHeight } : 
              { width: 0, height: 0 }
            }
          />
        </div>
      </div>

      {/* Input oculto para importar archivo */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={importDiagram}
        accept=".json"
        className="hidden ignore-export"
      />

      {/* Modal para mostrar el JSON */}
      <JsonModal
        isOpen={showJsonModal}
        json={formattedJson}
        onClose={() => setShowJsonModal(false)}
        onCopy={copyJsonToClipboard}
        className="ignore-export"
      />

      {/* Modal para mostrar las plantillas */}
      <TemplatesModal
        isOpen={showTemplatesModal}
        templates={templates}
        onClose={() => setShowTemplatesModal(false)}
        onSelectTemplate={loadTemplate}
        className="ignore-export"
      />
    </div>
  );
}
