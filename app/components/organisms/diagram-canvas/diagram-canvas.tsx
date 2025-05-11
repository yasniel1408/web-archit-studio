"use client";

import React, { useEffect, useCallback } from 'react';
import { diagramCanvasStyles } from './styles';
import { ConnectionPosition } from '@/app/components/atoms/connection-point/connection-point';
import { IconType } from '@/app/components/atoms/icon-selector/types';
import { ConnectionPropertiesType, ConnectionType } from './types';

// Hooks
import { useNodeManagement } from './hooks/useNodeManagement';
import { useConnectionManagement } from './hooks/useConnectionManagement';
import { useCanvasControls } from './hooks/useCanvasControls';
import { useDiagramPersistence } from './hooks/useDiagramPersistence';
import { useTemplates } from './hooks/useTemplates';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useCanvasConnections } from './hooks/useCanvasConnections';

// Componentes
import { CanvasToolbar } from './components/CanvasToolbar';
import { JsonModal } from './components/JsonModal';
import { TemplatesModal } from './components/TemplatesModal';
import { CanvasArea } from './components/CanvasArea';
import { DebugPanel } from './components/DebugPanel';

/**
 * Componente principal del canvas de diagramación
 */
export function DiagramCanvas() {
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
    debug,
    handleCanvasMouseDown,
    handleCanvasMouseUp,
    resetView,
    zoomIn,
    zoomOut,
    setViewport,
    getViewport,
    logDebug,
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
  } = useDiagramPersistence(setNodes, setConnections, setViewport, logDebug);

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
    logDebug
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
    logDebug
  });

  // Guardar cambios cuando cambian nodos o conexiones
  useEffect(() => {
    if (nodes.length > 0 || connections.length > 0) {
      saveDiagram(nodes, connections, getViewport());
    }
  }, [nodes, connections, saveDiagram, getViewport]);

  // Borrar un nodo y sus conexiones
  const handleDeleteNode = useCallback((nodeId: string) => {
    deleteNode(nodeId, connections, setConnections);
    logDebug(`Nodo eliminado: ${nodeId}`);
  }, [deleteNode, connections, setConnections, logDebug]);

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
    logDebug(`Propiedades de conexión actualizadas: ${connectionId} - ${JSON.stringify(properties)}`);
  }, [updateConnectionProperties, logDebug]);

  // Limpiar el lienzo eliminando todos los nodos y conexiones
  const clearCanvas = useCallback(() => {
    // Mostrar confirmación antes de borrar todo
    if (window.confirm('¿Estás seguro de que deseas eliminar todos los elementos del lienzo?')) {
      setNodes([]);
      setConnections([]);
      resetView();
      logDebug('Lienzo limpiado: se eliminaron todos los elementos');
    }
  }, [setNodes, setConnections, resetView, logDebug]);

  // Envolver los eventos de mouse para combinar comportamientos
  const handleCanvasMouseMoveWrapper = useCallback((e: React.MouseEvent) => {
    // Primero manejar el arrastre del canvas (fundamental para la navegación con espacio)
    handleCanvasMouseMove(e);
    // Si hay una conexión activa, actualiza su posición mientras se arrastra
    handleUpdateActiveConnection(e);
  }, [handleCanvasMouseMove, handleUpdateActiveConnection]);

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

      {/* Panel de depuración */}
      <DebugPanel messages={debug} />

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
        onConnectionEnd={handleConnectionEnd}
        onConnectionSelect={selectConnection}
        onConnectionPropertiesChange={handleConnectionPropertiesChange}
        onDeleteConnection={deleteConnection}
        onNodePropertiesChange={updateNodeProperties}
      />

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
