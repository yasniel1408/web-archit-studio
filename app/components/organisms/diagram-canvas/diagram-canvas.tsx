"use client";

import React, { useCallback, useEffect, useMemo } from "react";

import { useLogger } from "@/app/contexts/debug-context";

import { CanvasArea } from "./components/CanvasArea";
import { CanvasToolbar } from "./components/CanvasToolbar";
import { JsonModal } from "./components/JsonModal";
import { TemplatesModal } from "./components/TemplatesModal";
import { useCanvasConnections } from "./hooks/useCanvasConnections";
import { useCanvasControls } from "./hooks/useCanvasControls";
import { useConnectionManagement } from "./hooks/useConnectionManagement";
import { useConnectionSnapping } from "./hooks/useConnectionSnapping";
import { useDiagramPersistence } from "./hooks/useDiagramPersistence";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useModernGifExport } from "./hooks/useModernGifExport";
import { useNodeManagement } from "./hooks/useNodeManagement";
import { useTemplates } from "./hooks/useTemplates";
import { diagramCanvasStyles } from "./styles";
import { ConnectionPropertiesType, TemplateType } from "./types";

interface DiagramCanvasProps {
  onToolbarPropsChange?: (props: any) => void;
}

/**
 * Componente principal del canvas de diagramación
 */
export function DiagramCanvas({ onToolbarPropsChange }: DiagramCanvasProps) {
  // Logger para debug
  const logger = useLogger("DiagramCanvas");

  // Inicialización del componente
  useEffect(() => {
    logger.info("DiagramCanvas inicializado");
  }, [logger]);

  // Hooks para el manejo de nodos
  const {
    nodes,
    setNodes,
    addNode,
    deleteNode,
    updateNodePosition,
    updateNodeSize,
    updateNodeProperties,
  } = useNodeManagement();

  // Hooks para el manejo de conexiones
  const {
    connections,
    setConnections,
    activeConnection,
    setActiveConnection,
    selectedConnectionId,
    startConnection,
    completeConnection,
    cancelConnection,
    deleteConnection,
    updateConnectionProperties,
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
    handleCanvasMouseMove,
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
    loadTemplate,
  } = useDiagramPersistence(setNodes, setConnections, setViewport, logger.debug);

  // Hook para exportación moderna (MP4 usando WebCodecs)
  const { exportToModernGif } = useModernGifExport();

  // Hook para plantillas predefinidas
  const { templates } = useTemplates();

  // Hook para arrastrar y soltar elementos
  const { handleDragOver, handleDrop } = useDragAndDrop({
    canvasRef,
    scale,
    position,
    addNode,
    onNodePropertiesChange: updateNodeProperties,
    logDebug: logger.debug,
  });

  // Hook para conexiones del canvas
  const {
    handleConnectionStart,
    handleConnectionEnd,
    handleUpdateActiveConnection,
    handleCanvasClick,
    handleCanvasMouseUp: handleConnectionMouseUp,
  } = useCanvasConnections({
    canvasRef,
    scale,
    position,
    activeConnection,
    setActiveConnection,
    startConnection,
    completeConnection,
    cancelConnection,
    logDebug: logger.debug,
  });

  // Hook para efecto de imán en conexiones
  const { updateSnapState } = useConnectionSnapping({
    nodes,
    activeConnection,
    snapDistance: 30,
    logDebug: logger.debug,
  });

  // Guardar cambios cuando cambian nodos o conexiones
  useEffect(() => {
    if (nodes.length > 0 || connections.length > 0) {
      saveDiagram(nodes, connections, getViewport());
      logger.debug("Diagrama guardado automáticamente", {
        nodes: nodes.length,
        connections: connections.length,
      });
    }
  }, [nodes, connections, saveDiagram, getViewport]);

  // Manejar borrado de nodo
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      deleteNode(nodeId, connections, setConnections);
      logger.debug(`Nodo eliminado: ${nodeId}`);
    },
    [deleteNode, connections, setConnections]
  );

  // Actualizar posición de un nodo cuando se mueve
  const handleNodeMove = useCallback(
    (nodeId: string, newPosition: { x: number; y: number }) => {
      updateNodePosition(nodeId, newPosition, connections, setConnections);
      logger.debug(`Nodo movido: ${nodeId}`, { newPosition });
    },
    [updateNodePosition, connections, setConnections]
  );

  // Actualizar tamaño de un nodo cuando se redimensiona
  const handleNodeResize = useCallback(
    (nodeId: string, newSize: { width: number; height: number }) => {
      updateNodeSize(nodeId, newSize, connections, setConnections);
      logger.debug(`Nodo redimensionado: ${nodeId}`, { newSize });
    },
    [updateNodeSize, connections, setConnections]
  );

  // Actualizar propiedades de un nodo
  const handleNodePropertiesChange = useCallback(
    (nodeId: string, properties: Partial<any>) => {
      updateNodeProperties(nodeId, properties);
      logger.debug(`Propiedades del nodo actualizadas: ${nodeId}`, { properties });
    },
    [updateNodeProperties]
  );

  // Manejar borrado de conexión
  const handleDeleteConnection = useCallback(
    (connectionId: string) => {
      deleteConnection(connectionId);
      logger.debug(`Conexión eliminada: ${connectionId}`);
    },
    [deleteConnection]
  );

  // Actualizar propiedades de una conexión
  const handleUpdateConnectionProperties = useCallback(
    (connectionId: string, properties: Partial<ConnectionPropertiesType>) => {
      updateConnectionProperties(connectionId, properties);
      logger.debug(`Propiedades de conexión actualizadas: ${connectionId}`, { properties });
    },
    [updateConnectionProperties]
  );

  // Manejar exportación moderna
  const handleExportModernGif = useCallback(() => {
    exportToModernGif(canvasRef, { scale, position });
  }, [exportToModernGif, canvasRef, scale, position]);

  // Manejar carga de plantilla
  const handleLoadTemplate = useCallback(
    (template: TemplateType) => {
      loadTemplate(template);
      setShowTemplatesModal(false);
      logger.debug(`Plantilla cargada: ${template.name}`);
    },
    [loadTemplate, setShowTemplatesModal]
  );

  // Manejar limpieza del canvas
  const handleClearCanvas = useCallback(() => {
    if (window.confirm("¿Estás seguro de que quieres limpiar el canvas?")) {
      setNodes([]);
      setConnections([]);
      resetView();
      logger.debug("Canvas limpiado");
    }
  }, [setNodes, setConnections, resetView]);

  // Manejar movimiento del mouse en el canvas
  const handleCanvasMouseMoveWrapper = useCallback(
    (e: React.MouseEvent) => {
      handleCanvasMouseMove(e);
      if (activeConnection && activeConnection.sourceId && activeConnection.sourcePosition) {
        handleUpdateActiveConnection(e);

        // Obtener coordenadas del mouse relativas al canvas
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        updateSnapState(mouseX, mouseY);
      }
    },
    [handleCanvasMouseMove, activeConnection, handleUpdateActiveConnection, updateSnapState]
  );

  // Manejar mouse up en el canvas
  const handleCanvasMouseUpWrapper = useCallback(
    (e: React.MouseEvent) => {
      handleCanvasMouseUp();
      handleConnectionMouseUp(e);
    },
    [handleCanvasMouseUp, handleConnectionMouseUp]
  );

  // Manejar click en el canvas
  const handleCanvasClickWrapper = useCallback(
    (e: React.MouseEvent) => {
      handleCanvasClick(e);
    },
    [handleCanvasClick]
  );

  // Crear las props del toolbar
  const toolbarProps = useMemo(
    () => ({
      onZoomIn: zoomIn,
      onZoomOut: zoomOut,
      onResetView: resetView,
      onExport: () => exportDiagram(nodes, connections, getViewport()),
      onExportGif: () => exportToGif(canvasRef, getViewport()),
      onExportModernGif: handleExportModernGif,
      onImport: triggerFileInput,
      onShowJson: () => showDiagramJson(nodes, connections, getViewport()),
      onShowTemplates: () => setShowTemplatesModal(true),
      onClearCanvas: handleClearCanvas,
      scale: scale,
    }),
    [
      zoomIn,
      zoomOut,
      resetView,
      exportDiagram,
      nodes,
      connections,
      getViewport,
      exportToGif,
      canvasRef,
      handleExportModernGif,
      triggerFileInput,
      showDiagramJson,
      setShowTemplatesModal,
      handleClearCanvas,
      scale,
    ]
  );

  // Enviar las props del toolbar al header cuando cambien
  useEffect(() => {
    if (onToolbarPropsChange) {
      onToolbarPropsChange(toolbarProps);
    }
  }, [onToolbarPropsChange, toolbarProps]);

  return (
    <div
      className={diagramCanvasStyles.container}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-diagram-export="true"
    >
      <CanvasToolbar {...toolbarProps} />

      <CanvasArea
        canvasRef={canvasRef}
        transformRef={transformRef}
        scale={scale}
        position={position}
        isDraggingCanvas={isDraggingCanvas}
        isSpacePressed={isSpacePressed}
        nodes={nodes}
        connections={connections}
        activeConnection={activeConnection}
        selectedConnectionId={selectedConnectionId}
        onCanvasMouseDown={handleCanvasMouseDown}
        onCanvasMouseUp={handleCanvasMouseUpWrapper}
        onCanvasMouseMove={handleCanvasMouseMoveWrapper}
        onCanvasClick={handleCanvasClickWrapper}
        onNodeMove={handleNodeMove}
        onNodeResize={handleNodeResize}
        onNodePropertiesChange={handleNodePropertiesChange}
        onDeleteNode={handleDeleteNode}
        onConnectionStart={handleConnectionStart}
        onConnectionEnd={handleConnectionEnd}
        onDeleteConnection={handleDeleteConnection}
        onConnectionPropertiesChange={handleUpdateConnectionProperties}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onConnectionSelect={() => {}}
      />

      <JsonModal
        isOpen={showJsonModal}
        onClose={() => setShowJsonModal(false)}
        onCopy={copyJsonToClipboard}
        json={formattedJson}
      />

      <TemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onSelectTemplate={handleLoadTemplate}
        templates={templates}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importDiagram}
        style={{ display: "none" }}
      />
    </div>
  );
}
