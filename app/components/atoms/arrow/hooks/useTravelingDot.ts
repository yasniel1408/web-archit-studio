import { useEffect, useState } from "react";

import { ArrowAnimation } from "../types";

interface UseTravelingDotProps {
  animation: ArrowAnimation;
  id: string;
  roundTrip?: boolean; // Para controlar si el punto va y regresa
}

export const useTravelingDot = ({ animation, id, roundTrip = false }: UseTravelingDotProps) => {
  // Para animación de punto recorriendo (traveling-dot)
  const [dotPosition, setDotPosition] = useState(0);
  const [isReturning, setIsReturning] = useState(false); // Para rastrear si está regresando

  // Update dot position for traveling-dot animation
  useEffect(() => {
    if (
      animation !== "traveling-dot" &&
      animation !== "traveling-dot-fast" &&
      animation !== "traveling-dot-fastest"
    )
      return;

    let speedFactor = 0.005; // Velocidad base (normal)

    if (animation === "traveling-dot-fast") {
      speedFactor = 0.01; // 2x velocidad
    } else if (animation === "traveling-dot-fastest") {
      speedFactor = 0.02; // 4x velocidad
    }

    const interval = setInterval(() => {
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
          // Lógica original: solo ida (reinicia al llegar a 1)
          const newPos = prev + speedFactor;
          return newPos >= 1 ? 0 : newPos;
        }
      });
    }, 16); // 60fps para animación más fluida

    return () => {
      clearInterval(interval);
    };
  }, [animation, id, roundTrip, isReturning]);

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
    getDotColor,
    isAnimating:
      animation === "traveling-dot" ||
      animation === "traveling-dot-fast" ||
      animation === "traveling-dot-fastest",
    isReturning, // Para indicar si está en el viaje de regreso
  };
};
