"use client";

import React, { useEffect, useCallback } from 'react';
import { diagramCanvasStyles } from './styles';
import { ConnectionPosition } from '@/app/components/atoms/connection-point/connection-point';
import { IconType } from '@/app/components/atoms/icon-selector/types';
import { ConnectionPropertiesType, ConnectionType, NodeType } from './types';
import { useLogger } from '@/app/contexts/debug-context';

// Hooks
import { useNodeManagement } from './hooks/useNodeManagement';
import { useConnectionManagement } from './hooks/useConnectionManagement';
import { useCanvasControls } from './hooks/useCanvasControls';
import { useDiagramPersistence } from './hooks/useDiagramPersistence';
import { useTemplates } from './hooks/useTemplates';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useCanvasConnections } from './hooks/useCanvasConnections';
import { useNodeSelection } from './hooks/useNodeSelection';
import { useCopyPaste } from './hooks/useCopyPaste';
import { useConnectionSnapping } from './hooks/useConnectionSnapping';

// Componentes
import { CanvasToolbar } from './components/CanvasToolbar';
import { JsonModal } from './components/JsonModal';
import { TemplatesModal } from './components/TemplatesModal';
import { CanvasArea } from './components/CanvasArea';

/**
 * Componente principal del canvas de diagramación
 */
export function DiagramCanvas() {
  // Logger para debug
  const logger = useLogger('DiagramCanvas');

  // Inicialización del componente
  useEffect(() => {
    logger.info('DiagramCanvas inicializado');
  }, [logger]);

  // Hooks para el manejo de nodos
  const {
    nodes,
    setNodes,
    addNode,
    deleteNode,
    updateNodePosition,
    updateNodeSize,
    updateNodeProperties
  } = useNodeManagement();

  // Hooks para el manejo de conexiones
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
    handleCanvasMouseDown,
    handleCanvasMouseUp,
    resetView,
    zoomIn,
    zoomOut,
    setViewport,
    getViewport,
    handleCanvasMouseMove
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
  } = useDiagramPersistence(setNodes, setConnections, setViewport, logger.debug);

  // Hook para plantillas predefinidas
  const { templates } = useTemplates();

  // Hook para arrastrar y soltar elementos
  const {
    handleDragOver,
    handleDrop
  } = useDragAndDrop({
    canvasRef,
    scale,
    position,
    addNode,
    onNodePropertiesChange: updateNodeProperties,
    logDebug: logger.debug
  });

  // Hook para conexiones del canvas
  const {
    handleConnectionStart,
    handleConnectionEnd,
    handleUpdateActiveConnection,
    handleCanvasClick,
    handleCanvasMouseUp: handleConnectionMouseUp
  } = useCanvasConnections({
    canvasRef,
    scale,
    position,
    activeConnection,
    setActiveConnection,
    startConnection,
    completeConnection,
    cancelConnection,
    logDebug: logger.debug
  });

  // Hook para selección de nodos
  const {
    selectedNodeIds,
    clearSelection,
    isNodeSelected,
    handleCanvasClick: handleSelectionCanvasClick
  } = useNodeSelection({ logDebug: logger.debug });

  // Wrapper para addNode que convierte el formato esperado por useCopyPaste
  const addNodeWrapper = useCallback((nodeData: Omit<NodeType, 'id'>) => {
    const newId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return addNode(
      newId,
      nodeData.type,
      nodeData.text || '',
      nodeData.position,
      nodeData.size || { width: 120, height: 120 },
      nodeData.icon
    );
  }, [addNode]);

  // Hook para copiar y pegar
  const {
    copyNodes,
    pasteNodes,
    duplicateNodes
  } = useCopyPaste({
    nodes,
    selectedNodeIds,
    addNode: addNodeWrapper,
    canvasRef,
    scale,
    position,
    logDebug: logger.debug
  });

  // Hook para efecto de imán en conexiones
  const {
    updateSnapState,
    getFinalConnectionCoordinates,
    getSnapIndicatorStyle,
    isSnapping
  } = useConnectionSnapping({
    nodes,
    activeConnection,
    snapDistance: 30,
    logDebug: logger.debug
  });

  // Guardar cambios cuando cambian nodos o conexiones
  useEffect(() => {
    if (nodes.length > 0 || connections.length > 0) {
      saveDiagram(nodes, connections, getViewport());
      logger.debug('Diagrama guardado automáticamente', { 
        nodes: nodes.length, 
        connections: connections.length 
      });
    }
  }, [nodes, connections, saveDiagram, getViewport, logger.debug]);

  // Borrar un nodo y sus conexiones
  const handleDeleteNode = useCallback((nodeId: string) => {
    deleteNode(nodeId, connections, setConnections);
    logger.debug(`Nodo eliminado: ${nodeId}`);
  }, [deleteNode, connections, setConnections, logger.debug]);

  // Actualizar posición de un nodo cuando se mueve
  const handleNodeMove = useCallback((nodeId: string, newPosition: { x: number, y: number }) => {
    updateNodePosition(nodeId, newPosition, connections, setConnections);
  }, [updateNodePosition, connections, setConnections]);

  // Actualizar tamaño de un nodo cuando se redimensiona
  const handleNodeResize = useCallback((nodeId: string, newSize: { width: number, height: number }) => {
    updateNodeSize(nodeId, newSize, connections, setConnections);
  }, [updateNodeSize, connections, setConnections]);

  // Manejar cambios en las propiedades de una conexión
  const handleConnectionPropertiesChange = useCallback((connectionId: string, properties: ConnectionPropertiesType) => {
    updateConnectionProperties(connectionId, properties);
    logger.debug(`Propiedades de conexión actualizadas: ${connectionId} - ${JSON.stringify(properties)}`);
  }, [updateConnectionProperties, logger.debug]);

  // Limpiar el lienzo eliminando todos los nodos y conexiones
  const clearCanvas = useCallback(() => {
    // Mostrar confirmación antes de borrar todo
    if (window.confirm('¿Estás seguro de que deseas eliminar todos los elementos del lienzo?')) {
      setNodes([]);
      setConnections([]);
      resetView();
      logger.info('Lienzo limpiado: se eliminaron todos los elementos');
    }
  }, [setNodes, setConnections, resetView, logger.info]);

  // Envolver los eventos de mouse para combinar comportamientos
  const handleCanvasMouseMoveWrapper = useCallback((e: React.MouseEvent) => {
    // Primero manejar el arrastre del canvas (fundamental para la navegación con espacio)
    handleCanvasMouseMove(e);
    // Si hay una conexión activa, actualiza su posición mientras se arrastra
    handleUpdateActiveConnection(e);
    
    // Si hay una conexión activa, actualizar el estado de snap
    if (activeConnection) {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (canvasRect) {
        const relativeX = e.clientX - canvasRect.left;
        const relativeY = e.clientY - canvasRect.top;
        
        // Convertir coordenadas de pantalla a coordenadas del canvas
        const canvasX = (relativeX / scale) - position.x;
        const canvasY = (relativeY / scale) - position.y;
        
        updateSnapState(canvasX, canvasY);
      }
    }
  }, [handleCanvasMouseMove, handleUpdateActiveConnection, activeConnection, canvasRef, scale, position, updateSnapState]);

  // Combinar manejadores de mouseUp
  const handleCanvasMouseUpWrapper = useCallback((e: React.MouseEvent) => {
    // Primero manejar el comportamiento normal de mouseUp
    handleCanvasMouseUp();
    // Luego manejar la cancelación de conexiones
    handleConnectionMouseUp(e);
  }, [handleCanvasMouseUp, handleConnectionMouseUp]);

  return (
    <div className={diagramCanvasStyles.container}>
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



      {/* Área del canvas */}
      <CanvasArea
        canvasRef={canvasRef}
        transformRef={transformRef}
        nodes={nodes}
        connections={connections}
        activeConnection={activeConnection}
        scale={scale}
        position={position}
        isDraggingCanvas={isDraggingCanvas}
        isSpacePressed={isSpacePressed}
        selectedConnectionId={selectedConnectionId}
        onCanvasMouseDown={handleCanvasMouseDown}
        onCanvasMouseMove={handleCanvasMouseMoveWrapper}
        onCanvasMouseUp={handleCanvasMouseUpWrapper}
        onCanvasClick={handleCanvasClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onNodeMove={handleNodeMove}
        onNodeResize={handleNodeResize}
        onDeleteNode={handleDeleteNode}
        onConnectionStart={handleConnectionStart}
        onConnectionEnd={(nodeId, position, x, y) => handleConnectionEnd(nodeId, position, x, y, getFinalConnectionCoordinates)}
        onConnectionSelect={selectConnection}
        onConnectionPropertiesChange={handleConnectionPropertiesChange}
        onDeleteConnection={deleteConnection}
        onNodePropertiesChange={updateNodeProperties}
      />

      {/* Indicador visual del efecto de imán para conexiones */}
      {isSnapping && getSnapIndicatorStyle() && (
        <div 
          style={getSnapIndicatorStyle()!} 
          className="pointer-events-none ignore-export"
          title="Punto de conexión magnético"
        />
      )}

      {/* Input oculto para importar archivo */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={importDiagram}
        accept=".json"
        className={diagramCanvasStyles.hiddenInput}
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
