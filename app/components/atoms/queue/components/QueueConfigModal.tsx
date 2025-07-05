"use client";

import React, { useState } from "react";

import { IconRenderer } from "../../icon-selector/icon-renderer";
import { IconType } from "../../icon-selector/types";
import { Modal } from "../../modal";

interface QueueConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIcon?: IconType;
  currentSpeed: "slow" | "medium" | "fast";
  currentMaxMessages: number;
  currentTitle: string;
  onSave: (config: {
    icon?: IconType;
    speed: "slow" | "medium" | "fast";
    maxMessages: number;
    title: string;
  }) => void;
}

export function QueueConfigModal({
  isOpen,
  onClose,
  currentIcon = "none",
  currentSpeed,
  currentMaxMessages,
  currentTitle,
  onSave,
}: QueueConfigModalProps) {
  const [selectedIcon, setSelectedIcon] = useState<IconType>(currentIcon);
  const [selectedSpeed, setSelectedSpeed] = useState(currentSpeed);
  const [selectedMaxMessages, setSelectedMaxMessages] = useState(currentMaxMessages);
  const [title, setTitle] = useState(currentTitle);

  // Lista de iconos disponibles para queues
  const queueIcons: IconType[] = [
    "none",
    "aws-sqs",
    "aws-sns",
    "gcp-pubsub",
    "gcp-cloud-functions",
    "gcp-cloud-run",
    "gcp-workflows",
  ];

  const handleSave = () => {
    onSave({
      icon: selectedIcon,
      speed: selectedSpeed,
      maxMessages: selectedMaxMessages,
      title,
    });
    onClose();
  };

  const handleCancel = () => {
    // Resetear a valores originales
    setSelectedIcon(currentIcon);
    setSelectedSpeed(currentSpeed);
    setSelectedMaxMessages(currentMaxMessages);
    setTitle(currentTitle);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Configuración de Queue">
      <div className="space-y-6 p-1">
        {/* Título */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Título del Queue</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Message Queue"
          />
        </div>

        {/* Selector de Icono */}
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">Icono del Queue</label>
          <div className="grid grid-cols-4 gap-3">
            {queueIcons.map((icon) => (
              <button
                key={icon}
                onClick={() => setSelectedIcon(icon)}
                className={`
                  flex h-16 w-16 items-center justify-center rounded-lg border-2 transition-all
                  ${
                    selectedIcon === icon
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {icon === "none" ? (
                  <span className="text-xs text-gray-400">Sin icono</span>
                ) : (
                  <IconRenderer iconType={icon} className="h-8 w-8" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Configuración de Velocidad */}
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Velocidad de Procesamiento
          </label>
          <div className="flex gap-2">
            {(["slow", "medium", "fast"] as const).map((speed) => (
              <button
                key={speed}
                onClick={() => setSelectedSpeed(speed)}
                className={`
                  flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors
                  ${
                    selectedSpeed === speed
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                  }
                `}
              >
                <div className="text-center">
                  <div className="font-semibold capitalize">{speed}</div>
                  <div className="text-xs opacity-75">
                    {speed === "slow" && "3s por mensaje"}
                    {speed === "medium" && "2s por mensaje"}
                    {speed === "fast" && "1s por mensaje"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cantidad Máxima de Mensajes */}
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Cantidad Máxima de Mensajes
          </label>
          <div className="grid grid-cols-6 gap-2">
            {[3, 4, 5, 6, 7, 8].map((count) => (
              <button
                key={count}
                onClick={() => setSelectedMaxMessages(count)}
                className={`
                  rounded-lg border px-3 py-2 text-sm font-medium transition-colors
                  ${
                    selectedMaxMessages === count
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                  }
                `}
              >
                {count}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Número máximo de mensajes visibles simultáneamente en la animación
          </p>
        </div>

        {/* Vista Previa */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Vista Previa</label>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              {selectedIcon !== "none" && (
                <IconRenderer iconType={selectedIcon} className="h-6 w-6" />
              )}
              <div>
                <div className="font-medium">{title || "Message Queue"}</div>
                <div className="text-sm text-gray-600">
                  Velocidad: {selectedSpeed} | Máx. mensajes: {selectedMaxMessages}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleCancel}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </Modal>
  );
}
