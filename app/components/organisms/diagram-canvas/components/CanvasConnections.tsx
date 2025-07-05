import React from "react";

import { Arrow } from "@/app/components/atoms/arrow/arrow";

import { ActiveConnectionType, ConnectionPropertiesType, ConnectionType } from "../types";

type CanvasConnectionsProps = {
  connections: ConnectionType[];
  activeConnection: ActiveConnectionType | null;
  onConnectionSelect: (connectionId: string) => void;
  selectedConnectionId: string | null;
  onConnectionPropertiesChange?: (
    connectionId: string,
    properties: ConnectionPropertiesType
  ) => void;
  onDeleteConnection?: (connectionId: string) => void;
};

export const CanvasConnections: React.FC<CanvasConnectionsProps> = ({
  connections,
  activeConnection,
  onConnectionSelect,
  selectedConnectionId,
  onConnectionPropertiesChange,
  onDeleteConnection,
}) => {
  return (
    <>
      {/* Conexiones existentes */}
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
          style={connection.style || "solid"}
          animation={connection.animation || "none"}
          startArrowHead={connection.startArrowHead || "none"}
          endArrowHead={connection.endArrowHead || "arrow"}
          roundTrip={connection.roundTrip || false}
          multiplePoints={connection.multiplePoints || false}
          color={connection.color || "#000000"}
          strokeWidth={connection.strokeWidth || 2}
          isSelected={selectedConnectionId === connection.id}
          onSelect={onConnectionSelect}
          {...(onConnectionPropertiesChange && {
            onPropertiesChange: (properties) =>
              onConnectionPropertiesChange(connection.id, properties),
          })}
          {...(onDeleteConnection && { onDelete: () => onDeleteConnection(connection.id) })}
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
          endPosition={
            // Determinar automáticamente la mejor posición para la punta de flecha
            // basado en la dirección general del movimiento
            (() => {
              // Calcular la dirección general del movimiento
              const dx = activeConnection.currentX - activeConnection.sourceX;
              const dy = activeConnection.currentY - activeConnection.sourceY;

              // Determinar la dirección predominante
              if (Math.abs(dx) > Math.abs(dy)) {
                // Movimiento principalmente horizontal
                return dx > 0 ? "left" : "right";
              } else {
                // Movimiento principalmente vertical
                return dy > 0 ? "top" : "bottom";
              }
            })()
          }
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
