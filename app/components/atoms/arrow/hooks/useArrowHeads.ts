import { useMemo } from "react";

import { ConnectionPosition } from "@/app/components/atoms/connection-point/connection-point";

import { ArrowHeadType } from "../types";

interface UseArrowHeadsProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startPosition: ConnectionPosition;
  endPosition: ConnectionPosition;
  startArrowHead: ArrowHeadType;
  endArrowHead: ArrowHeadType;
}

export const useArrowHeads = ({
  startX,
  startY,
  endX,
  endY,
  startPosition,
  endPosition,
  startArrowHead,
  endArrowHead,
}: UseArrowHeadsProps) => {
  // Calcular cabezas de flecha como path SVG
  const arrowHeadPaths = useMemo(() => {
    const startPath =
      startArrowHead !== "none"
        ? calculateArrowHeadPath(startPosition, startX, startY, startArrowHead)
        : null;

    const endPath =
      endArrowHead !== "none"
        ? calculateArrowHeadPath(endPosition, endX, endY, endArrowHead)
        : null;

    return {
      startPath,
      endPath,
    };
  }, [startArrowHead, endArrowHead, startPosition, endPosition, startX, startY, endX, endY]);

  return arrowHeadPaths;
};

// Función auxiliar para calcular path de cabeza de flecha
function calculateArrowHeadPath(
  position: ConnectionPosition,
  x: number,
  y: number,
  type: ArrowHeadType
): string {
  // Dirección según el punto de conexión
  let dx = 0;
  let dy = 0;

  switch (position) {
    case "top":
      dy = 1; // Apuntar hacia abajo (hacia el nodo)
      break;
    case "right":
      dx = -1; // Apuntar hacia la izquierda (hacia el nodo)
      break;
    case "bottom":
      dy = -1; // Apuntar hacia arriba (hacia el nodo)
      break;
    case "left":
      dx = 1; // Apuntar hacia la derecha (hacia el nodo)
      break;
  }

  // Mantener coherencia con el tamaño en getArrowHead
  const arrowSize = 18;
  const angle = Math.atan2(dy, dx);

  // Punto exacto en el extremo de la línea
  const exactX = x;
  const exactY = y;

  switch (type) {
    case "arrow": {
      const point1 = {
        x: exactX - arrowSize * Math.cos(angle - Math.PI / 5),
        y: exactY - arrowSize * Math.sin(angle - Math.PI / 5),
      };

      const point2 = {
        x: exactX - arrowSize * Math.cos(angle + Math.PI / 5),
        y: exactY - arrowSize * Math.sin(angle + Math.PI / 5),
      };

      return `M ${exactX},${exactY} L ${point1.x},${point1.y} L ${point2.x},${point2.y} Z`;
    }
    case "circle": {
      // Aumentamos el tamaño y mejoramos el trazo para circle
      return `M ${exactX},${exactY} m ${-arrowSize / 2},0 a ${arrowSize / 2},${arrowSize / 2} 0 1,0 ${arrowSize},0 a ${arrowSize / 2},${arrowSize / 2} 0 1,0 ${-arrowSize},0`;
    }
    case "diamond": {
      // Ajustamos el tamaño y proporciones del diamante para mejor estética
      const diamondSize = arrowSize * 0.8; // Ajuste del tamaño para mejor proporción

      const point1 = {
        x: exactX - diamondSize * Math.cos(angle),
        y: exactY - diamondSize * Math.sin(angle),
      };

      const point2 = {
        x: exactX - diamondSize * Math.cos(angle - Math.PI / 2),
        y: exactY - diamondSize * Math.sin(angle - Math.PI / 2),
      };

      const point3 = {
        x: exactX - diamondSize * Math.cos(angle - Math.PI),
        y: exactY - diamondSize * Math.sin(angle - Math.PI),
      };

      const point4 = {
        x: exactX - diamondSize * Math.cos(angle - (3 * Math.PI) / 2),
        y: exactY - diamondSize * Math.sin(angle - (3 * Math.PI) / 2),
      };

      return `M ${point1.x},${point1.y} L ${point2.x},${point2.y} L ${point3.x},${point3.y} L ${point4.x},${point4.y} Z`;
    }
    default:
      return "";
  }
}
