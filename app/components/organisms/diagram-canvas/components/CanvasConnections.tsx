import React from 'react';
import { Arrow } from '@/app/components/atoms/arrow/arrow';
import { ConnectionType, ActiveConnectionType, ConnectionPropertiesType } from '../types';

type CanvasConnectionsProps = {
  connections: ConnectionType[];
  activeConnection: ActiveConnectionType | null;
  canvasRef: React.RefObject<HTMLDivElement>;
  scale: number;
  onConnectionSelect: (connectionId: string) => void;
  selectedConnectionId: string | null;
  onConnectionPropertiesChange?: (connectionId: string, properties: ConnectionPropertiesType) => void;
};

export const CanvasConnections: React.FC<CanvasConnectionsProps> = ({
  connections,
  activeConnection,
  canvasRef,
  scale,
  onConnectionSelect,
  selectedConnectionId,
  onConnectionPropertiesChange
}) => {
  return (
    <>
      {/* Conexiones existentes */}
      {connections.map(connection => (
        <Arrow
          key={connection.id}
          id={connection.id}
          startX={connection.sourceX}
          startY={connection.sourceY}
          endX={connection.targetX}
          endY={connection.targetY}
          startPosition={connection.sourcePosition}
          endPosition={connection.targetPosition}
          style={connection.style || 'solid'}
          animation={connection.animation || 'none'}
          startArrowHead={connection.startArrowHead || 'none'}
          endArrowHead={connection.endArrowHead || 'arrow'}
          color={connection.color || '#000000'}
          strokeWidth={connection.strokeWidth || 2}
          isSelected={selectedConnectionId === connection.id}
          onSelect={onConnectionSelect}
          onPropertiesChange={onConnectionPropertiesChange ? (properties) => onConnectionPropertiesChange(connection.id, properties) : undefined}
        />
      ))}
      
      {/* Conexión activa mientras se arrastra */}
      {activeConnection && (
        <Arrow
          id="temp-connection"
          startX={activeConnection.sourceX}
          startY={activeConnection.sourceY}
          endX={activeConnection.currentX}
          endY={activeConnection.currentY}
          startPosition={activeConnection.sourcePosition}
          endPosition={activeConnection.sourcePosition === 'top' ? 'bottom' : 
                       activeConnection.sourcePosition === 'right' ? 'left' : 
                       activeConnection.sourcePosition === 'bottom' ? 'top' : 'right'}
          style="dashed"
          animation="none"
          startArrowHead="none"
          endArrowHead="arrow"
          color="#6200ee"
          strokeWidth={2}
          isSelected={false}
          onSelect={() => {}}
        />
      )}
    </>
  );
}; 