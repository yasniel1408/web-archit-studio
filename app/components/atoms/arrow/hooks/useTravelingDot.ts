import { useEffect, useState } from "react";

import { ArrowAnimation } from "../types";

interface UseTravelingDotProps {
  animation: ArrowAnimation;
  id: string;
  roundTrip?: boolean; // Para controlar si el punto va y regresa
  multiplePoints?: boolean; // Para mostrar múltiples puntos (3) uno detrás del otro
}

export const useTravelingDot = ({
  animation,
  id,
  roundTrip = false,
  multiplePoints = false,
}: UseTravelingDotProps) => {
  // Para animación de punto recorriendo (traveling-dot)
  const [dotPosition, setDotPosition] = useState(0);
  const [isReturning, setIsReturning] = useState(false); // Para rastrear si está regresando

  // Para múltiples puntos
  const [dotPositions, setDotPositions] = useState<number[]>([0, 0, 0]);
  const [_pointsReturning, setPointsReturning] = useState<boolean[]>([false, false, false]);

  // Update dot position for traveling-dot animation
  useEffect(() => {
    if (
      animation !== "traveling-dot" &&
      animation !== "traveling-dot-fast" &&
      animation !== "traveling-dot-fastest"
    ) {
      return;
    }

    // Configurar la velocidad según el tipo de animación
    let speedFactor = 0.005; // Lento por defecto
    if (animation === "traveling-dot-fast") {
      speedFactor = 0.01; // Rápido
    } else if (animation === "traveling-dot-fastest") {
      speedFactor = 0.02; // Muy rápido
    }

    const interval = setInterval(() => {
      if (multiplePoints) {
        // Lógica para múltiples puntos
        setDotPositions((prevPositions) => {
          const newPositions = [...prevPositions];

          if (roundTrip) {
            // Lógica para ida y vuelta con múltiples puntos
            setPointsReturning((prevReturning) => {
              const newReturning = [...prevReturning];

              newPositions.forEach((pos, index) => {
                if (!newReturning[index]) {
                  // Yendo hacia adelante
                  let newPos = pos + speedFactor;
                  if (newPos >= 1) {
                    newReturning[index] = true;
                    newPos = 1;
                  }
                  newPositions[index] = newPos;
                } else {
                  // Regresando
                  let newPos = pos - speedFactor;
                  if (newPos <= 0) {
                    newReturning[index] = false;
                    newPos = 0;
                  }
                  newPositions[index] = newPos;
                }
              });

              return newReturning;
            });
          } else {
            // Lógica solo ida con múltiples puntos
            newPositions.forEach((pos, index) => {
              const offset = (index * 0.25) % 1; // Desfase de 25% entre puntos
              let newPos = pos + speedFactor;
              if (newPos >= 1) {
                newPos = -offset; // Reiniciar con el desfase correspondiente
              }
              newPositions[index] = newPos;
            });
          }

          return newPositions;
        });
      } else {
        // Lógica para un solo punto (original)
        setDotPosition((prev) => {
          if (roundTrip) {
            // Lógica para ida y vuelta
            if (!isReturning) {
              // Yendo hacia adelante
              const newPos = prev + speedFactor;
              if (newPos >= 1) {
                setIsReturning(true);
                return 1;
              }
              return newPos;
            } else {
              // Regresando
              const newPos = prev - speedFactor;
              if (newPos <= 0) {
                setIsReturning(false);
                return 0;
              }
              return newPos;
            }
          } else {
            // Lógica original: solo ida
            const newPos = prev + speedFactor;
            return newPos >= 1 ? 0 : newPos;
          }
        });
      }
    }, 16); // 60fps para animación más fluida

    return () => clearInterval(interval);
  }, [animation, id, roundTrip, multiplePoints, isReturning]);

  // Inicializar posiciones de múltiples puntos con desfase
  useEffect(() => {
    if (multiplePoints) {
      setDotPositions([0, -0.25, -0.5]); // Puntos con desfase inicial
      setPointsReturning([false, false, false]);
    }
  }, [multiplePoints]);

  // Color del punto según la velocidad
  const getDotColor = (baseColor: string): string => {
    if (animation === "traveling-dot-fast") {
      return "#4F46E5"; // Índigo para velocidad rápida
    } else if (animation === "traveling-dot-fastest") {
      return "#EF4444"; // Rojo para velocidad muy rápida
    }
    return baseColor;
  };

  return {
    dotPosition,
    dotPositions,
    multiplePoints,
    getDotColor,
    isAnimating:
      animation === "traveling-dot" ||
      animation === "traveling-dot-fast" ||
      animation === "traveling-dot-fastest",
    isReturning, // Para indicar si está en el viaje de regreso
  };
};
