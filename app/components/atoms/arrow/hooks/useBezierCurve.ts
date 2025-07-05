import { useMemo } from "react";

import { ConnectionPosition } from "@/app/components/atoms/connection-point/connection-point";

import { BezierControlPoints, PointCoordinates } from "../types";

interface UseBezierCurveProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startPosition: ConnectionPosition;
  endPosition: ConnectionPosition;
}

export const useBezierCurve = ({
  startX,
  startY,
  endX,
  endY,
  startPosition,
  endPosition,
}: UseBezierCurveProps) => {
  // Calcular los puntos de control para la curva Bezier
  const controlPoints = useMemo((): BezierControlPoints => {
    // Calcular distancia para los puntos de control
    const dx = Math.abs(endX - startX);
    const dy = Math.abs(endY - startY);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Ajustar distancia de control basada en la distancia total
    // Usamos una fórmula que escala proporcionalmente pero con un límite superior
    const controlDistance = Math.min(
      distance * 0.4, // 40% de la distancia total como máximo
      Math.max(50, distance * 0.2) // Al menos 50px o 20% de la distancia
    );

    // Vectores direccionales desde los puntos de inicio/fin hacia el centro
    const dirXStart = endX - startX;
    const dirYStart = endY - startY;
    const dirXEnd = startX - endX;
    const dirYEnd = startY - endY;

    // Normalizar los vectores
    const lenStart = Math.sqrt(dirXStart * dirXStart + dirYStart * dirYStart) || 1;
    const lenEnd = Math.sqrt(dirXEnd * dirXEnd + dirYEnd * dirYEnd) || 1;

    // Inicializar puntos de control en los puntos de inicio/fin exactos
    // para garantizar que la curva comience y termine exactamente en los puntos dados
    let controlPoint1X = startX;
    let controlPoint1Y = startY;
    let controlPoint2X = endX;
    let controlPoint2Y = endY;

    // Ajustar punto de control según la posición de inicio - manteniendo el punto de partida exacto
    switch (startPosition) {
      case "top":
        // Si sale por arriba, mover punto de control hacia arriba
        controlPoint1X += (dirXStart / lenStart) * controlDistance * 0.1;
        controlPoint1Y -= controlDistance;
        break;
      case "right":
        // Si sale por la derecha, mover punto de control hacia la derecha
        controlPoint1X += controlDistance;
        controlPoint1Y += (dirYStart / lenStart) * controlDistance * 0.1;
        break;
      case "bottom":
        // Si sale por abajo, mover punto de control hacia abajo
        controlPoint1X += (dirXStart / lenStart) * controlDistance * 0.1;
        controlPoint1Y += controlDistance;
        break;
      case "left":
        // Si sale por la izquierda, mover punto de control hacia la izquierda
        controlPoint1X -= controlDistance;
        controlPoint1Y += (dirYStart / lenStart) * controlDistance * 0.1;
        break;
    }

    // Ajustar punto de control según la posición final - manteniendo el punto final exacto
    switch (endPosition) {
      case "top":
        // Si entra por arriba, mover punto de control hacia arriba
        controlPoint2X += (dirXEnd / lenEnd) * controlDistance * 0.1;
        controlPoint2Y -= controlDistance;
        break;
      case "right":
        // Si entra por la derecha, mover punto de control hacia la derecha
        controlPoint2X += controlDistance;
        controlPoint2Y += (dirYEnd / lenEnd) * controlDistance * 0.1;
        break;
      case "bottom":
        // Si entra por abajo, mover punto de control hacia abajo
        controlPoint2X += (dirXEnd / lenEnd) * controlDistance * 0.1;
        controlPoint2Y += controlDistance;
        break;
      case "left":
        // Si entra por la izquierda, mover punto de control hacia la izquierda
        controlPoint2X -= controlDistance;
        controlPoint2Y += (dirYEnd / lenEnd) * controlDistance * 0.1;
        break;
    }

    // Caso especial: si los puntos están casi alineados horizontal o verticalmente,
    // ajustar para evitar curvas demasiado planas, pero mantener los extremos exactos
    if (dx < dy * 0.1) {
      // Casi vertical
      controlPoint1X -= controlDistance * 0.5;
      controlPoint2X += controlDistance * 0.5;
    } else if (dy < dx * 0.1) {
      // Casi horizontal
      controlPoint1Y -= controlDistance * 0.5;
      controlPoint2Y += controlDistance * 0.5;
    }

    return {
      controlPoint1X,
      controlPoint1Y,
      controlPoint2X,
      controlPoint2Y,
    };
  }, [startX, startY, endX, endY, startPosition, endPosition]);

  // Calcular punto en la curva Bezier según t [0..1]
  const getPointOnCurve = (t: number): PointCoordinates => {
    const { controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y } = controlPoints;

    // Fórmula para punto en curva Bezier cúbica
    const x =
      Math.pow(1 - t, 3) * startX +
      3 * Math.pow(1 - t, 2) * t * controlPoint1X +
      3 * (1 - t) * Math.pow(t, 2) * controlPoint2X +
      Math.pow(t, 3) * endX;

    const y =
      Math.pow(1 - t, 3) * startY +
      3 * Math.pow(1 - t, 2) * t * controlPoint1Y +
      3 * (1 - t) * Math.pow(t, 2) * controlPoint2Y +
      Math.pow(t, 3) * endY;

    return { x, y };
  };

  // Generar el path command para la curva
  const pathCommand = useMemo(() => {
    const { controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y } = controlPoints;
    return `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`;
  }, [controlPoints, startX, startY, endX, endY]);

  return {
    controlPoints,
    getPointOnCurve,
    pathCommand,
  };
};
