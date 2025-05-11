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
  onConnectionEnd: (nodeId: string, position: ConnectionPosition, x: number, y: number) => void;
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
  
  const getCursorStyle = () => {
    if (isDraggingCanvas) return diagramCanvasStyles.canvasGrabbing;
    if (isSpacePressed) return diagramCanvasStyles.canvasGrab;
    return diagramCanvasStyles.canvasDefault;
  };

  return (
    <div
      ref={canvasRef}
      className={`${diagramCanvasStyles.canvas} ${getCursorStyle()}`}
      onMouseDown={onCanvasMouseDown}
      onMouseMove={onCanvasMouseMove}
      onMouseUp={onCanvasMouseUp}
      onClick={onCanvasClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
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

        {/* Primero renderizamos los contenedores (para que estén por debajo) */}
        {nodes
          .filter(node => node.type.includes('container'))
          .map(node => (
            <CanvasContainer
              key={node.id}
              id={node.id}
              position={node.position}
              size={node.size}
              text={node.text}
              type={node.type}
              iconType={node.icon}
              backgroundColor={node.backgroundColor}
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
          ))}
          
        {/* Después renderizamos los squares (para que estén por encima) */}
        {nodes
          .filter(node => !node.type.includes('container'))
          .map(node => (
            <CanvasNode
              key={node.id}
              id={node.id}
              position={node.position}
              size={node.size}
              text={node.text}
              type={node.type}
              iconType={node.icon}
              backgroundColor={node.backgroundColor}
              onNodeMove={onNodeMove}
              onNodeResize={onNodeResize}
              onDeleteNode={onDeleteNode}
              onConnectionStart={onConnectionStart}
              onConnectionEnd={onConnectionEnd}
              onPropertiesChange={(props) => onNodePropertiesChange(node.id, props)}
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
  );
} 