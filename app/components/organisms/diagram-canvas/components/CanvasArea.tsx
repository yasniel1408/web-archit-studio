import React, { useState, useCallback } from 'react';
import { NodeType, ActiveConnectionType, ConnectionType, ConnectionPropertiesType } from '../types';
import { CanvasNode } from '@/app/components/molecules/canvas-node/canvas-node';
import { CanvasContainer } from '@/app/components/molecules/canvas-container/canvas-container';
import { CanvasConnections } from './CanvasConnections';
import { MiniMap } from '@/app/components/molecules/mini-map/mini-map';
import { ConnectionPosition } from '@/app/components/atoms/connection-point/connection-point';
import { IconType } from '@/app/components/atoms/icon-selector/types';
import { diagramCanvasStyles } from '../styles';

type CanvasAreaProps = {
  canvasRef: React.RefObject<HTMLDivElement>;
  transformRef: React.RefObject<HTMLDivElement>;
  nodes: NodeType[];
  connections: ConnectionType[];
  activeConnection: ActiveConnectionType | null;
  scale: number;
  position: { x: number; y: number };
  isDraggingCanvas: boolean;
  isSpacePressed: boolean;
  selectedConnectionId: string | null;
  onCanvasMouseDown: (e: React.MouseEvent) => void;
  onCanvasMouseMove: (e: React.MouseEvent) => void;
  onCanvasMouseUp: (e: React.MouseEvent) => void;
  onCanvasClick: (e: React.MouseEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onNodeMove: (nodeId: string, newPosition: { x: number; y: number }) => void;
  onNodeResize: (nodeId: string, newSize: { width: number; height: number }) => void;
  onDeleteNode: (nodeId: string) => void;
  onConnectionStart: (nodeId: string, position: ConnectionPosition, x: number, y: number) => void;
  onConnectionEnd: (nodeId: string, position: ConnectionPosition, x: number, y: number, getFinalCoordinates?: (mouseX: number, mouseY: number) => { x: number; y: number; isSnapped: boolean; targetNodeId: string | null; targetPosition: ConnectionPosition | null; }) => void;
  onConnectionSelect: (connectionId: string) => void;
  onConnectionPropertiesChange: (connectionId: string, properties: ConnectionPropertiesType) => void;
  onDeleteConnection: (connectionId: string) => void;
  onNodePropertiesChange: (nodeId: string, properties: { icon?: IconType; backgroundColor?: string }) => void;
};

/**
 * Componente que renderiza el área principal del canvas con transformaciones
 */
export function CanvasArea({
  canvasRef,
  transformRef,
  nodes,
  connections,
  activeConnection,
  scale,
  position,
  isDraggingCanvas,
  isSpacePressed,
  selectedConnectionId,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onCanvasClick,
  onDragOver,
  onDrop,
  onNodeMove,
  onNodeResize,
  onDeleteNode,
  onConnectionStart,
  onConnectionEnd,
  onConnectionSelect,
  onConnectionPropertiesChange,
  onDeleteConnection,
  onNodePropertiesChange
}: CanvasAreaProps) {
  
  const [dragOverActive, setDragOverActive] = useState(false);

  const handleDragOverWithIndicator = useCallback((e: React.DragEvent) => {
    setDragOverActive(true);
    onDragOver(e);
  }, [onDragOver]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Solo ocultar si realmente salimos del canvas
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverActive(false);
    }
  }, []);

  const handleDropWithIndicator = useCallback((e: React.DragEvent) => {
    setDragOverActive(false);
    onDrop(e);
  }, [onDrop]);

  const getCursorStyle = () => {
    if (isDraggingCanvas) return diagramCanvasStyles.canvasGrabbing;
    if (isSpacePressed) return diagramCanvasStyles.canvasGrab;
    return diagramCanvasStyles.canvasDefault;
  };

  return (
    <div
      ref={canvasRef}
      className={`${diagramCanvasStyles.canvas} ${getCursorStyle()} ${dragOverActive ? 'border-4 border-blue-500 border-dashed' : ''}`}
      onMouseDown={onCanvasMouseDown}
      onMouseMove={onCanvasMouseMove}
      onMouseUp={onCanvasMouseUp}
      onClick={onCanvasClick}
      onDragOver={handleDragOverWithIndicator}
      onDragLeave={handleDragLeave}
      onDrop={handleDropWithIndicator}
      data-diagram-export="true"
    >
      {/* Capa de transformación para zoom y pan */}
      <div
        ref={transformRef}
        className={diagramCanvasStyles.transformLayer}
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%'
        }}
        data-diagram-transform="true"
      >
        {/* Conexiones */}
        <CanvasConnections
          connections={connections}
          activeConnection={activeConnection}
          canvasRef={canvasRef}
          scale={scale}
          onConnectionSelect={onConnectionSelect}
          selectedConnectionId={selectedConnectionId}
          onConnectionPropertiesChange={onConnectionPropertiesChange}
          onDeleteConnection={onDeleteConnection}
          nodes={nodes}
        />

        {/* Renderizar todos los nodos ordenados por z-index (menor a mayor) */}
        {/* Los nodos con mayor z-index se renderizan al final y quedan por encima */}
        {nodes
          .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
          .map(node => {
            // Renderizar contenedores
            if (node.type.includes('container')) {
              return (
                <CanvasContainer
                  key={node.id}
                  id={node.id}
                  position={node.position}
                  size={node.size}
                  text={node.text}
                  type={node.type}
                  iconType={node.icon || 'none'}
                  backgroundColor={node.backgroundColor || 'rgba(240, 249, 255, 0.3)'}
                  zIndex={node.zIndex || 0}
                  borderStyle={(node.type.includes('solid') ? 'solid' : 
                              node.type.includes('dotted') ? 'dotted' :
                              node.type.includes('double') ? 'double' :
                              node.type.includes('none') ? 'none' : 'dashed')}
                  onNodeMove={onNodeMove}
                  onNodeResize={onNodeResize}
                  onDeleteNode={onDeleteNode}
                  onConnectionStart={onConnectionStart}
                  onConnectionEnd={onConnectionEnd}
                  onPropertiesChange={(props) => onNodePropertiesChange(node.id, props)}
                />
              );
            } else {
              // Renderizar squares/nodos
              return (
                <CanvasNode
                  key={node.id}
                  id={node.id}
                  position={node.position}
                  size={node.size}
                  text={node.text}
                  type={node.type}
                  iconType={node.icon || 'none'}
                  backgroundColor={node.backgroundColor || '#FFFFFF'}
                  zIndex={node.zIndex || 10}
                  onNodeMove={onNodeMove}
                  onNodeResize={onNodeResize}
                  onDeleteNode={onDeleteNode}
                  onConnectionStart={onConnectionStart}
                  onConnectionEnd={onConnectionEnd}
                  onPropertiesChange={(props) => onNodePropertiesChange(node.id, props)}
                />
              );
            }
          })}
      </div>

      {/* Indicador visual de drag and drop */}
      {dragOverActive && (
        <div className="absolute inset-0 bg-blue-500/10 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
            🎯 Suelta aquí para agregar componente
          </div>
        </div>
      )}

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
  );
} 