"use client";

import React from "react";

export type ConnectionPosition = "top" | "right" | "bottom" | "left";

interface ConnectionPointProps {
  position: ConnectionPosition;
  onConnectionStart: (position: ConnectionPosition) => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  isMovable?: boolean;
  onDragStart?: (position: ConnectionPosition, e: React.MouseEvent) => void;
}

export function ConnectionPoint({
  position,
  onConnectionStart,
  isSelectable = false,
  isSelected = false,
  isMovable = false,
  onDragStart,
}: ConnectionPointProps) {
  const offset = "-8px"; // Restaurado al valor original

  // Posicionar el punto según su posición relativa
  const getPositionStyle = () => {
    switch (position) {
      case "top":
        return { top: offset, left: "50%", transform: "translateX(-50%)" };
      case "right":
        return { top: "50%", right: offset, transform: "translateY(-50%)" };
      case "bottom":
        return { bottom: offset, left: "50%", transform: "translateX(-50%)" };
      case "left":
        return { top: "50%", left: offset, transform: "translateY(-50%)" };
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isMovable && onDragStart) {
      onDragStart(position, e);
    } else {
      onConnectionStart(position);
    }
  };

  return (
    <div
      className={`
        connection-point absolute z-30 h-3 w-3 rounded-full
        ${isSelected ? "bg-blue-500 hover:bg-blue-400" : "bg-green-500 hover:bg-green-400"}
        ${isMovable ? "cursor-move" : "cursor-crosshair"}
        ${isSelectable ? "transition-transform hover:scale-125" : ""}
        ${isSelected ? "ring-2 ring-white" : ""}
      `}
      style={getPositionStyle()}
      onMouseDown={handleMouseDown}
    />
  );
}
