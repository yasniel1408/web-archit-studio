"use client";

import React, { useState } from "react";

import { IconType } from "../icon-selector/types";
import { QueueConfigModal } from "./components/QueueConfigModal";
import { useQueueAnimation } from "./hooks/useQueueAnimation";
import { queueStyles } from "./styles";
import { QueueProps } from "./types";

export function Queue(props: QueueProps) {
  const {
    id,
    size,
    color,
    innerText,
    speed = "medium",
    maxMessages = 5,
    className,
    style,
    showControls,
    onSelect,
    onDoubleClick,
    onSpeedChange,
    onMaxMessagesChange,
    onTextChange,
    onIconChange,
    icon,
  } = props;

  // Estado para el modal de configuración
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Animación SIMPLE que SÍ funciona
  const { messages, queueLength, isProcessing } = useQueueAnimation({
    isActive: true,
    speed,
    maxMessages,
  });

  // Manejar doble click para abrir configuración
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfigModalOpen(true);
    onDoubleClick?.(id);
  };

  // Manejar guardado de configuración
  const handleConfigSave = (config: {
    icon?: string;
    speed: "slow" | "medium" | "fast";
    maxMessages: number;
    title: string;
  }) => {
    // Propagar los cambios a los handlers del padre
    onSpeedChange?.(id, config.speed);
    onMaxMessagesChange?.(id, config.maxMessages);
    onTextChange?.(id, config.title);
    if (config.icon) {
      onIconChange?.(config.icon as IconType);
    }
  };

  return (
    <>
      <div
        className={`${queueStyles.container} ${className || ""}`}
        style={{
          ...style,
          width: size.width,
          height: size.height,
          backgroundColor: color,
        }}
        onClick={() => onSelect?.(id)}
        onDoubleClick={handleDoubleClick}
      >
        {/* Título del componente */}
        <div className="mb-2 text-center">
          <div className="text-sm font-semibold text-gray-700">{innerText || "Message Queue"}</div>
        </div>

        {/* Área de animación GRANDE y VISIBLE */}
        <div className="relative mb-2 h-16 overflow-hidden rounded-lg border border-gray-300 bg-gradient-to-r from-green-100 via-blue-100 to-red-100">
          {/* Marcadores de entrada y salida */}
          <div className="absolute left-2 top-2 text-xs font-bold text-green-600">IN</div>
          <div className="absolute right-2 top-2 text-xs font-bold text-red-600">OUT</div>

          {/* Flecha direccional */}
          <div className="absolute inset-x-0 bottom-1 text-center font-mono text-xs text-gray-400">
            ← → → →
          </div>

          {/* Mensajes animados */}
          {messages.map((message) => {
            // Posición calculada del 5% al 95% del ancho
            const leftPosition = 5 + message.position * 0.9;

            return (
              <div
                key={message.id}
                className="absolute flex items-center justify-center rounded-full border-2 border-white bg-blue-500 text-white shadow-lg transition-all duration-100"
                style={{
                  left: `${leftPosition}%`,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                {message.id.split("-")[1]}
              </div>
            );
          })}
        </div>

        {/* INFO PANEL - Solo información esencial */}
        <div className="mt-2 rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              Queue: <strong className="text-gray-800">{queueLength}</strong>
            </span>
            <span className="text-gray-600">
              Speed: <strong className="text-gray-800">{speed}</strong>
            </span>
            <span className="text-gray-600">
              Status:{" "}
              <strong className={isProcessing ? "text-orange-600" : "text-green-600"}>
                {isProcessing ? "Processing" : "Ready"}
              </strong>
            </span>
          </div>
        </div>

      </div>

      {/* Modal de configuración */}
      <QueueConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        currentIcon={icon || "none"}
        currentSpeed={speed}
        currentMaxMessages={maxMessages}
        currentTitle={innerText || "Message Queue"}
        onSave={handleConfigSave}
      />
    </>
  );
}
