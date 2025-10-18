"use client";

import React, { useCallback, useMemo, useState } from "react";

import { IconRenderer } from "../icon-selector/icon-renderer";
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
  const [isPaused] = useState(false);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  const layout = useMemo(() => {
    const normalizedWidth = Math.max(180, size.width);
    const normalizedHeight = Math.max(100, size.height);

    const headerHeight = Math.max(28, normalizedHeight * 0.2);
    const footerHeight = Math.max(28, normalizedHeight * 0.2);
    const trackHeight = Math.max(36, normalizedHeight - headerHeight - footerHeight - 8);
    const paddingX = Math.max(12, normalizedWidth * 0.08);
    const trackWidth = Math.max(80, normalizedWidth - paddingX * 2);
    const messageDiameter = Math.max(16, Math.min(trackHeight * 0.7, 28));

    return {
      normalizedWidth,
      normalizedHeight,
      headerHeight,
      footerHeight,
      trackHeight,
      paddingX,
      trackWidth,
      messageDiameter,
    };
  }, [size.height, size.width]);

  const { messages, queueLength, isProcessing } = useQueueAnimation({
    isActive: !isPaused,
    speed,
    maxMessages,
  });

  const computedMessages = useMemo(() => {
    const travelSpace = Math.max(8, layout.trackWidth - layout.messageDiameter);

    return messages.map((message, index) => {
      const clamped = Math.max(0, Math.min(100, message.position));
      const leftPx = (clamped / 100) * travelSpace + layout.messageDiameter / 2;
      const state = clamped <= 12 ? "entering" : clamped >= 88 ? "leaving" : "queued";

      return {
        id: message.id,
        index: index + 1,
        leftPx,
        state,
        color: message.color,
      };
    });
  }, [layout.messageDiameter, layout.trackWidth, messages]);

  const statusColorClass = useMemo(() => {
    if (isPaused) {
      return "bg-amber-400";
    }
    return isProcessing ? "bg-emerald-500 animate-pulse" : "bg-slate-300";
  }, [isPaused, isProcessing]);

  // Manejar doble click para abrir configuración
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfigModalOpen(true);
    onDoubleClick?.(id);
  };

  // Manejar guardado de configuración
  const handleConfigSave = useCallback(
    (config: {
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
        onIconChange?.(config.icon as any);
      }
    },
    [id, onIconChange, onMaxMessagesChange, onSpeedChange, onTextChange]
  );

  return (
    <>
      <div
        className={`${queueStyles.container} ${isPaused ? queueStyles.containerPaused : ""} ${
          className || ""
        }`}
        style={{
          ...style,
          width: layout.normalizedWidth,
          height: layout.normalizedHeight,
          backgroundColor: color,
        }}
        onClick={() => onSelect?.(id)}
        onDoubleClick={handleDoubleClick}
      >
        {isPaused && (
          <div className={queueStyles.pauseBadge}>
            <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
            {"Paused"}
          </div>
        )}

        <div className={queueStyles.header} style={{ minHeight: layout.headerHeight }}>
          {icon && icon !== "none" && (
            <div className={queueStyles.iconBadge}>
              <IconRenderer iconType={icon} className="h-4 w-4" />
            </div>
          )}
          <div className={queueStyles.titleWrapper}>
            <span className={queueStyles.titleText}>{innerText || "Message Queue"}</span>
          </div>
        </div>

        <div
          className={queueStyles.trackWrapper}
          style={{
            minHeight: layout.trackHeight + 8,
            paddingLeft: layout.paddingX,
            paddingRight: layout.paddingX,
          }}
        >
          <div className={queueStyles.track} style={{ height: layout.trackHeight }}>
            <div className={queueStyles.trackBackground} />
            <div className={queueStyles.trackOverlay}>
              <div className={queueStyles.trackMarker}>
                <span className={queueStyles.markerBadge}>IN</span>
              </div>
              <div className={queueStyles.trackMarker}>
                <span className={queueStyles.markerBadge}>OUT</span>
              </div>
            </div>

            {computedMessages.map((message) => (
              <div
                key={message.id}
                className={`${queueStyles.message} ${
                  message.state === "entering"
                    ? queueStyles.messageEntering
                    : message.state === "leaving"
                      ? queueStyles.messageLeaving
                      : ""
                }`}
                style={{
                  width: layout.messageDiameter,
                  height: layout.messageDiameter,
                  left: message.leftPx,
                  top: layout.trackHeight / 2,
                  transform: `translate(-50%, -50%) scale(${hoveredMessage === message.id ? 1.1 : 1})`,
                  background: message.color,
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredMessage(message.id)}
                onMouseLeave={() => setHoveredMessage(null)}
              >
                <span className={queueStyles.messageId}>{message.index}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={queueStyles.footer} style={{ minHeight: layout.footerHeight }}>
          <div className={queueStyles.footerInfo}>
            <span className={queueStyles.footerLabel}>
              {queueLength}/{maxMessages}
            </span>
            <span className={queueStyles.footerDot}>•</span>
            <span className={queueStyles.footerLabel}>{speed}</span>
            <span className={queueStyles.footerDot}>•</span>
            <span className={`${queueStyles.statusDot} ${statusColorClass}`} />
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
