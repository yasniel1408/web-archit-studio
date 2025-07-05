import React from "react";

import { useQueueAnimation } from "../hooks/useQueueAnimation";
import { queueStyles } from "../styles";
import { QueueAnimationProps } from "../types";

export function QueueAnimation({
  isActive = true,
  speed = "medium",
  messageColor,
}: QueueAnimationProps) {
  const { messages, isAnimating } = useQueueAnimation({ isActive, speed });

  // Siempre mostrar la base de la animación
  return (
    <div className={queueStyles.animationContainer}>
      {/* Pista de la cola - siempre visible */}
      <div className="absolute bottom-2 left-2 right-2 h-2 rounded-full bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 opacity-70 shadow-sm"></div>

      {/* Indicadores de entrada y salida - siempre visibles */}
      <div className="absolute bottom-0 left-1 rounded bg-white/80 px-1 text-xs font-bold text-blue-700">
        IN
      </div>
      <div className="absolute bottom-0 right-1 rounded bg-white/80 px-1 text-xs font-bold text-blue-700">
        OUT
      </div>

      {/* Mensajes animados */}
      {messages.map((message) => {
        const sizeClasses = {
          small: "w-3 h-3",
          medium: "w-4 h-4",
          large: "w-5 h-5",
        };

        const sizeClass = sizeClasses[message.size];

        // Calcular posición horizontal (10% a 85% del ancho)
        const leftPosition = 10 + message.position * 75;

        return (
          <div
            key={message.id}
            className={`absolute ${sizeClass} z-10 rounded-full border border-white shadow-lg`}
            style={{
              backgroundColor: messageColor || message.color,
              left: `${leftPosition}%`,
              bottom: "8px",
              transform: "translateX(-50%)",
              transition: "none",
            }}
          >
            {/* Efecto de brillo interno */}
            <div
              className="absolute inset-0.5 rounded-full bg-white opacity-40"
              style={{
                background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), transparent 60%)`,
              }}
            />
          </div>
        );
      })}

      {/* Efecto de entrada (izquierda) */}
      <div className="absolute bottom-0 left-0 top-0 w-6 rounded-l-lg bg-gradient-to-r from-green-300/60 via-green-200/40 to-transparent">
        <div className="absolute left-1 top-1/2 -translate-y-1/2 transform text-xs font-bold text-green-700">
          ▶
        </div>
      </div>

      {/* Efecto de salida (derecha) */}
      <div className="absolute bottom-0 right-0 top-0 w-6 rounded-r-lg bg-gradient-to-l from-red-300/60 via-red-200/40 to-transparent">
        <div className="absolute right-1 top-1/2 -translate-y-1/2 transform text-xs font-bold text-red-700">
          ◀
        </div>
      </div>

      {/* Indicador de estado */}
      {isAnimating && (
        <div className="absolute right-1 top-1 rounded-full bg-green-100 px-1 text-xs font-bold text-green-600">
          ●
        </div>
      )}
    </div>
  );
}
