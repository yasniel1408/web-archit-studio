import { useEffect, useState } from "react";

import { ArrowAnimation } from "../types";

interface UseTravelingDotProps {
  animation: ArrowAnimation;
  id: string;
}

export const useTravelingDot = ({ animation, id }: UseTravelingDotProps) => {
  // Para animación de punto recorriendo (traveling-dot)
  const [dotPosition, setDotPosition] = useState(0);

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
        const newPos = prev + speedFactor;
        return newPos >= 1 ? 0 : newPos;
      });
    }, 16); // 60fps para animación más fluida

    return () => {
      clearInterval(interval);
    };
  }, [animation, id]);

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
  };
};
