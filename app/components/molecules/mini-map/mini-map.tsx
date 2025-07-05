"use client";

import React, { useRef } from "react";

import { MinimapCanvas } from "./components/minimap-canvas";
import { MinimapHeader } from "./components/minimap-header";
import { useMinimapBounds } from "./hooks/useMinimapBounds";
import { useMinimapNavigation } from "./hooks/useMinimapNavigation";
import { useMinimapRenderer } from "./hooks/useMinimapRenderer";
import { miniMapStyles } from "./styles";
import { ConnectionType, NodeType } from "./types";

type MiniMapProps = {
  nodes: NodeType[];
  connections: ConnectionType[];
  scale: number;
  position: { x: number; y: number };
  viewportSize: { width: number; height: number };
};

/**
 * Componente MiniMap que muestra una vista reducida del diagrama completo
 * y permite la navegación rápida por el lienzo
 */
export function MiniMap({
  nodes = [],
  connections = [],
  scale = 15,
  position = { x: 0, y: 0 },
  viewportSize = { width: 0, height: 0 },
}: MiniMapProps) {
  // Referencias y constantes
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dimensiones del minimapa
  const MINI_MAP_WIDTH = 250;
  const MINI_MAP_HEIGHT = 200;

  // Factor de escala para el minimapa
  const ZOOM_OUT_FACTOR = 0.1;

  // Hooks personalizados para la lógica del minimapa
  const bounds = useMinimapBounds(nodes);

  const { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } =
    useMinimapNavigation({
      bounds,
      scale,
      viewportSize,
      canvasRef,
      mapWidth: MINI_MAP_WIDTH,
      mapHeight: MINI_MAP_HEIGHT,
      zoomOutFactor: ZOOM_OUT_FACTOR,
    });

  // Hook para renderizar el canvas
  useMinimapRenderer({
    canvasRef,
    nodes,
    connections,
    bounds,
    scale,
    position,
    viewportSize,
    mapWidth: MINI_MAP_WIDTH,
    mapHeight: MINI_MAP_HEIGHT,
    zoomOutFactor: ZOOM_OUT_FACTOR,
  });

  const isEmpty = nodes.length === 0;

  return (
    <div className={miniMapStyles.container}>
      <MinimapHeader isEmpty={isEmpty} />
      <MinimapCanvas
        canvasRef={canvasRef}
        width={MINI_MAP_WIDTH}
        height={MINI_MAP_HEIGHT}
        isEmpty={isEmpty}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}
