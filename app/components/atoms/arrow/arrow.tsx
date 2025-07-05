"use client";

import { motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ConnectionPosition } from "@/app/components/atoms/connection-point/connection-point";

// Estilos personalizados para la barra de desplazamiento
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  @media (max-width: 640px) {
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
  }
`;

export type ArrowStyle = "solid" | "dashed" | "dotted";
export type ArrowAnimation =
  | "none"
  | "pulse"
  | "flow"
  | "dash"
  | "traveling-dot"
  | "traveling-dot-fast"
  | "traveling-dot-fastest";
export type ArrowHeadType = "none" | "arrow" | "circle" | "diamond";

interface ArrowProps {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startPosition: ConnectionPosition;
  endPosition: ConnectionPosition;
  startArrowHead?: ArrowHeadType;
  endArrowHead?: ArrowHeadType;
  style?: ArrowStyle;
  animation?: ArrowAnimation;
  color?: string;
  strokeWidth?: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onPropertiesChange?: (properties: {
    style?: ArrowStyle;
    animation?: ArrowAnimation;
    startArrowHead?: ArrowHeadType;
    endArrowHead?: ArrowHeadType;
    color?: string;
    strokeWidth?: number;
  }) => void;
  onDelete?: (id: string) => void;
}

export function Arrow({
  id,
  startX,
  startY,
  endX,
  endY,
  startPosition,
  endPosition,
  startArrowHead = "none",
  endArrowHead = "arrow",
  style = "solid",
  animation = "none",
  color = "#000000",
  strokeWidth = 2,
  isSelected = false,
  onSelect,
  onPropertiesChange,
  onDelete,
}: ArrowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimationsMenuOpen, setIsAnimationsMenuOpen] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<ArrowStyle>(style);
  const [currentAnimation, setCurrentAnimation] = useState<ArrowAnimation>(animation);
  const [currentArrowHead, setCurrentArrowHead] = useState<ArrowHeadType>(endArrowHead || "arrow");
  const [currentStartArrowHead, setCurrentStartArrowHead] = useState<ArrowHeadType>(
    startArrowHead || "none"
  );
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const animationsMenuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Para animación de punto recorriendo (traveling-dot)
  const [dotPosition, setDotPosition] = useState(0);

  // Update dot position for traveling-dot animation
  useEffect(() => {
    if (
      currentAnimation !== "traveling-dot" &&
      currentAnimation !== "traveling-dot-fast" &&
      currentAnimation !== "traveling-dot-fastest"
    )
      return;

    let speedFactor = 0.005; // Velocidad base (normal)

    if (currentAnimation === "traveling-dot-fast") {
      speedFactor = 0.01; // 2x velocidad
    } else if (currentAnimation === "traveling-dot-fastest") {
      speedFactor = 0.02; // 4x velocidad
    }

    console.log(
      `Arrow ${id}: Iniciando animación de punto recorriendo - velocidad: ${
        currentAnimation === "traveling-dot-fastest"
          ? "muy rápida"
          : currentAnimation === "traveling-dot-fast"
            ? "rápida"
            : "normal"
      }`
    );

    const interval = setInterval(() => {
      setDotPosition((prev) => {
        const newPos = prev + speedFactor;
        return newPos >= 1 ? 0 : newPos;
      });
    }, 16); // 60fps para animación más fluida

    return () => {
      console.log(`Arrow ${id}: Limpiando animación de punto`);
      clearInterval(interval);
    };
  }, [currentAnimation, id]);

  console.log(
    `Arrow ${id}: Rendering with animation = ${currentAnimation}, style = ${currentStyle}`
  );

  // Calcular los puntos de control para la curva Bezier
  const getBezierControlPoints = () => {
    const dx = Math.abs(endX - startX);
    const dy = Math.abs(endY - startY);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const controlDistance = Math.min(distance * 0.4, Math.max(50, distance * 0.2));

    let controlPoint1X = startX;
    let controlPoint1Y = startY;
    let controlPoint2X = endX;
    let controlPoint2Y = endY;

    // Ajustar según posición de inicio
    switch (startPosition) {
      case "top":
        controlPoint1Y -= controlDistance;
        break;
      case "right":
        controlPoint1X += controlDistance;
        break;
      case "bottom":
        controlPoint1Y += controlDistance;
        break;
      case "left":
        controlPoint1X -= controlDistance;
        break;
    }

    // Ajustar según posición final
    switch (endPosition) {
      case "top":
        controlPoint2Y -= controlDistance;
        break;
      case "right":
        controlPoint2X += controlDistance;
        break;
      case "bottom":
        controlPoint2Y += controlDistance;
        break;
      case "left":
        controlPoint2X -= controlDistance;
        break;
    }

    return { controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y };
  };

  // Calcular punto en la curva Bezier según t [0..1]
  const getPointOnCurve = (t: number) => {
    const { controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y } =
      getBezierControlPoints();

    // Fórmula de Bézier cúbica
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

  // Obtener color base y calcular color de hover
  const baseColor = useMemo(() => {
    return isSelected ? "#3B82F6" : color || "#000000";
  }, [isSelected, color]);

  const hoverColor = useMemo(() => {
    if (baseColor.startsWith("#")) {
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.95)`;
    } else if (baseColor.startsWith("rgba")) {
      return baseColor.replace(/[\d\.]+\)$/, "0.95)");
    } else if (baseColor.startsWith("rgb")) {
      return baseColor.replace("rgb", "rgba").replace(")", ", 0.95)");
    }
    return "#3B82F6";
  }, [baseColor]);

  // State variables removed as they were not being used in the component

  // Calcular cabezas de flecha
  const arrowHeadStart =
    startArrowHead !== "none"
      ? calculateArrowHead(startPosition, startX, startY, startArrowHead)
      : null;
  const arrowHeadEnd =
    currentArrowHead !== "none"
      ? calculateArrowHead(endPosition, endX, endY, currentArrowHead)
      : null;

  // Función auxiliar para calcular path de cabeza de flecha
  function calculateArrowHead(
    position: ConnectionPosition,
    x: number,
    y: number,
    type: ArrowHeadType
  ): string {
    let dx = 0;
    let dy = 0;

    switch (position) {
      case "top":
        dy = 1;
        break;
      case "right":
        dx = -1;
        break;
      case "bottom":
        dy = -1;
        break;
      case "left":
        dx = 1;
        break;
    }

    const arrowSize = 18;
    const angle = Math.atan2(dy, dx);
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
        return `M ${exactX},${exactY} m ${-arrowSize / 2},0 a ${arrowSize / 2},${arrowSize / 2} 0 1,0 ${arrowSize},0 a ${arrowSize / 2},${arrowSize / 2} 0 1,0 ${-arrowSize},0`;
      }
      case "diamond": {
        const diamondSize = arrowSize * 0.8;

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

  // Obtener estilo de trazo según el tipo seleccionado
  function getDashArray(): string {
    if (
      currentAnimation === "traveling-dot" ||
      currentAnimation === "traveling-dot-fast" ||
      currentAnimation === "traveling-dot-fastest"
    ) {
      return "2, 4";
    }

    switch (currentStyle) {
      case "dashed":
        return "8, 4";
      case "dotted":
        return "2, 2";
      default:
        return "";
    }
  }

  // Obtener clase CSS para animación
  function getStrokeAnimation(): string {
    if (currentAnimation === "dash") {
      return "animate-dash";
    } else if (currentAnimation === "flow") {
      return "animate-flow";
    }
    return "";
  }

  // Obtener clase CSS para la flecha
  function getArrowClass(): string {
    return getStrokeAnimation();
  }

  // Obtener estilo CSS para la flecha
  function getArrowStyle(): React.CSSProperties {
    return {
      transition: "stroke 0.2s ease, stroke-width 0.2s ease",
      filter: isSelected
        ? "drop-shadow(0 0 3px rgba(0,0,0,0.3))"
        : "drop-shadow(0 0 2px rgba(0,0,0,0.2))",
      pointerEvents: "none" as const,
      zIndex: 40,
    };
  }

  // Obtener atributo de animación para la exportación GIF
  function getAnimationAttribute(): string {
    return currentAnimation !== "none" ? currentAnimation : "";
  }

  // Obtener icono para animación
  function getAnimationIcon(animation: ArrowAnimation): string {
    switch (animation) {
      case "none":
        return "⚊";
      case "pulse":
        return "💓";
      case "flow":
        return "🌊";
      case "dash":
        return "⚡";
      case "traveling-dot":
        return "●";
      case "traveling-dot-fast":
        return "●●";
      case "traveling-dot-fastest":
        return "●●●";
      default:
        return "⚊";
    }
  }

  // Función para cerrar el modal
  function closeModal() {
    setIsOptionsModalOpen(false);
    document.body.classList.remove("overflow-hidden");
  }

  // Renderizar punto viajero para las animaciones de tipo traveling-dot
  const renderTravelingDot = () => {
    if (
      currentAnimation !== "traveling-dot" &&
      currentAnimation !== "traveling-dot-fast" &&
      currentAnimation !== "traveling-dot-fastest"
    ) {
      return null;
    }

    const dotPos = getPointOnCurve(dotPosition);

    let dotColor = baseColor;
    if (currentAnimation === "traveling-dot-fast") {
      dotColor = "#4F46E5";
    } else if (currentAnimation === "traveling-dot-fastest") {
      dotColor = "#EF4444";
    }

    const dotSize = strokeWidth * 2.5;
    const shadowSize = dotSize + 2;

    return (
      <>
        <circle
          cx={dotPos.x}
          cy={dotPos.y}
          r={shadowSize}
          fill="#FFFFFF"
          opacity={0.6}
          style={{ zIndex: 45 }}
          data-animation={currentAnimation}
          className="traveling-dot-shadow"
        />
        <circle
          cx={dotPos.x}
          cy={dotPos.y}
          r={dotSize}
          fill={dotColor}
          style={{
            zIndex: 50,
            filter: "drop-shadow(0 0 3px rgba(0,0,0,0.3))",
          }}
          data-animation={currentAnimation}
          className="traveling-dot"
        />
      </>
    );
  };

  const handleMouseEnter = () => {
    // Funcionalidad de hover si se necesita
  };

  const handleMouseLeave = () => {
    // Funcionalidad de hover si se necesita
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onSelect) {
      onSelect(id);
    }

    setIsOptionsModalOpen(true);
    document.body.classList.add("overflow-hidden");
    setIsAnimationsMenuOpen(false);
    setIsMenuOpen(false);
  };

  const handleArrowDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Efecto para cerrar el modal al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isMenuOpen &&
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
        setIsAnimationsMenuOpen(false);
      }

      if (
        isAnimationsMenuOpen &&
        animationsMenuRef.current &&
        !animationsMenuRef.current.contains(event.target as Node)
      ) {
        setIsAnimationsMenuOpen(false);
      }

      if (
        isOptionsModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isAnimationsMenuOpen, isOptionsModalOpen]);

  // Actualizar estado local cuando cambian las props
  useEffect(() => {
    if (style !== currentStyle) setCurrentStyle(style || "solid");
    if (animation !== currentAnimation) setCurrentAnimation(animation);
    if (endArrowHead !== currentArrowHead) setCurrentArrowHead(endArrowHead || "arrow");
    if (startArrowHead !== currentStartArrowHead) setCurrentStartArrowHead(startArrowHead);

    console.log(
      `Arrow ${id}: Props actualizadas - style=${style}, animation=${animation}, startArrowHead=${startArrowHead}, endArrowHead=${endArrowHead}`
    );
  }, [id, style, animation, startArrowHead, endArrowHead]);

  // Efecto para actualizar propiedades cuando cambian
  useEffect(() => {
    if (
      onPropertiesChange &&
      (currentStyle !== style ||
        currentAnimation !== animation ||
        currentArrowHead !== endArrowHead ||
        currentStartArrowHead !== startArrowHead)
    ) {
      console.log(
        `Arrow ${id}: Enviando cambios al componente padre - style=${currentStyle}, animation=${currentAnimation}, startArrowHead=${currentStartArrowHead}, endArrowHead=${currentArrowHead}`
      );

      onPropertiesChange({
        style: currentStyle,
        animation: currentAnimation,
        endArrowHead: currentArrowHead,
        startArrowHead: currentStartArrowHead,
      });
    }
  }, [
    currentStyle,
    currentAnimation,
    currentArrowHead,
    currentStartArrowHead,
    style,
    animation,
    endArrowHead,
    startArrowHead,
    onPropertiesChange,
    id,
  ]);

  // Manejador para eliminar la conexión
  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta conexión?")) {
      if (onDelete) {
        onDelete(id);
      }
    }

    setIsMenuOpen(false);
    setIsOptionsModalOpen(false);
  };

  // Generar el path para la curva de Bezier
  const getBezierPath = (sX: number, sY: number, eX: number, eY: number): string => {
    const { controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y } =
      getBezierControlPoints();
    return `M ${sX} ${sY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${eX} ${eY}`;
  };

  // Generar path para la curva de Bezier
  const path = useMemo(() => {
    return getBezierPath(startX, startY, endX, endY);
  }, [startX, startY, endX, endY, startPosition, endPosition]);

  return (
    <div
      className="pointer-events-none absolute left-0 top-0 h-full w-full"
      style={{ zIndex: isOptionsModalOpen ? 25 : 15 }}
    >
      <svg
        width="100%"
        height="100%"
        className={`pointer-events-none absolute left-0 top-0 ${isSelected ? "z-40" : "z-35"}`}
        style={{
          overflow: "visible",
          filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))",
        }}
        preserveAspectRatio="none"
      >
        <path
          id={`arrow-path-${id}`}
          d={path}
          stroke="transparent"
          strokeWidth={Math.max(strokeWidth + 14, 18)}
          fill="none"
          style={{ cursor: "pointer", pointerEvents: "stroke", zIndex: 30 }}
          className="pointer-events-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleArrowClick}
          onDoubleClick={handleArrowDoubleClick}
        />

        <path
          d={path}
          fill="none"
          stroke="#ffffff"
          strokeWidth={isSelected ? strokeWidth + 3 : strokeWidth + 2}
          strokeOpacity="0.5"
          strokeDasharray={getDashArray()}
          style={{
            pointerEvents: "none",
            zIndex: 39,
          }}
        />

        <path
          d={path}
          fill="none"
          stroke={isSelected ? hoverColor : baseColor}
          strokeWidth={isSelected ? strokeWidth + 0.5 : strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={getDashArray()}
          className={getArrowClass()}
          data-animation={getAnimationAttribute()}
          style={getArrowStyle()}
        />

        <g style={{ zIndex: 50 }}>
          {arrowHeadStart && (
            <path
              d={arrowHeadStart}
              fill={isSelected ? hoverColor : baseColor}
              stroke={isSelected ? hoverColor : baseColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
              className={currentAnimation === "pulse" ? "pulsing" : ""}
              data-animation={currentAnimation}
              style={{
                transition: "fill 0.2s ease",
                pointerEvents: "none",
                zIndex: 55,
              }}
            />
          )}

          {arrowHeadEnd && (
            <path
              d={arrowHeadEnd}
              fill={isSelected ? hoverColor : baseColor}
              stroke={isSelected ? hoverColor : baseColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
              className={currentAnimation === "pulse" ? "pulsing" : ""}
              data-animation={currentAnimation}
              style={{
                transition: "fill 0.2s ease",
                pointerEvents: "none",
                zIndex: 55,
              }}
            />
          )}

          {(currentAnimation === "traveling-dot" ||
            currentAnimation === "traveling-dot-fast" ||
            currentAnimation === "traveling-dot-fastest") &&
            renderTravelingDot()}
        </g>
      </svg>

      {isOptionsModalOpen &&
        typeof window === "object" &&
        createPortal(
          <>
            <style>{scrollbarStyles}</style>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4 md:p-6"
              onClick={closeModal}
            >
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 18, stiffness: 500, delay: 0.1 }}
                className="connection-modal pointer-events-auto flex max-h-[95vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl sm:max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-white p-4 sm:p-5">
                  <motion.h3
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg font-semibold text-gray-900 sm:text-xl"
                  >
                    Opciones de conexión
                  </motion.h3>
                  <motion.button
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    onClick={closeModal}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto p-4 sm:p-5">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-gray-700">
                        Vista previa de la conexión
                      </h4>
                    </div>

                    <div className="flex justify-center py-6">
                      <svg width="300" height="60" className="pointer-events-none">
                        <path
                          d="M 50,30 C 100,30 200,30 250,30"
                          fill="none"
                          stroke={baseColor}
                          strokeWidth={strokeWidth}
                          strokeDasharray={getDashArray()}
                          className={getStrokeAnimation()}
                        />

                        {currentStartArrowHead !== "none" && (
                          <path
                            d={calculateArrowHead("right", 50, 30, currentStartArrowHead)}
                            fill={baseColor}
                            strokeWidth="0"
                          />
                        )}

                        {currentArrowHead !== "none" && (
                          <path
                            d={calculateArrowHead("left", 250, 30, currentArrowHead)}
                            fill={baseColor}
                            strokeWidth="0"
                          />
                        )}

                        {(currentAnimation === "traveling-dot" ||
                          currentAnimation === "traveling-dot-fast" ||
                          currentAnimation === "traveling-dot-fastest") && (
                          <circle
                            cx={50 + dotPosition * 200}
                            cy={30}
                            r={5}
                            fill={
                              currentAnimation === "traveling-dot-fastest"
                                ? "#FFCB00"
                                : currentAnimation === "traveling-dot-fast"
                                  ? "#FF9500"
                                  : "#000000"
                            }
                            stroke="#FFFFFF"
                            strokeWidth={1}
                          />
                        )}
                      </svg>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Estilo:</span> {getStyleName(currentStyle)}
                      </div>
                      <div>
                        <span className="font-medium">Animación:</span>{" "}
                        {getAnimationName(currentAnimation)}
                      </div>
                      <div>
                        <span className="font-medium">Punta inicial:</span>{" "}
                        {getArrowHeadName(currentStartArrowHead)}
                      </div>
                      <div>
                        <span className="font-medium">Punta final:</span>{" "}
                        {getArrowHeadName(currentArrowHead)}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div>
                      <label className="mb-3 block text-sm font-medium text-gray-700">
                        Estilo de línea
                      </label>
                      <div className="flex space-x-3">
                        {(["solid", "dashed", "dotted"] as ArrowStyle[]).map((styleOption) => (
                          <button
                            key={styleOption}
                            className={`connection-option flex-1 rounded-md border py-3 transition-colors ${currentStyle === styleOption ? "border-blue-300 bg-blue-50" : "hover:bg-gray-50"}`}
                            onClick={() => {
                              setCurrentStyle(styleOption || "solid");
                              if (onPropertiesChange) {
                                onPropertiesChange({ style: styleOption });
                              }
                            }}
                          >
                            <div
                              className={`mx-auto h-1 w-full ${
                                styleOption === "solid"
                                  ? "bg-gray-700"
                                  : styleOption === "dashed"
                                    ? "border-t-2 border-dashed border-gray-700"
                                    : "border-t-2 border-dotted border-gray-700"
                              }`}
                            />
                            <div className="mt-2 text-center text-sm">
                              {getStyleName(styleOption)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-3 block text-sm font-medium text-gray-700">
                        Animación
                      </label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {(
                          [
                            "none",
                            "dash",
                            "traveling-dot",
                            "traveling-dot-fast",
                            "traveling-dot-fastest",
                          ] as ArrowAnimation[]
                        ).map((animOption) => (
                          <button
                            key={animOption}
                            className={`connection-option rounded-md border px-2 py-3 text-sm transition-colors ${currentAnimation === animOption ? "border-blue-300 bg-blue-50" : "hover:bg-gray-50"}`}
                            onClick={() => {
                              setCurrentAnimation(animOption);
                              if (onPropertiesChange) {
                                onPropertiesChange({ animation: animOption });
                              }
                            }}
                          >
                            <div className="flex h-6 items-center justify-center text-xl">
                              {getAnimationIcon(animOption)}
                            </div>
                            <div className="mt-2 truncate text-center">
                              {getAnimationName(animOption)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-3 block text-sm font-medium text-gray-700">
                        Punta inicial
                      </label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {(["none", "arrow", "circle", "diamond"] as ArrowHeadType[]).map(
                          (headOption) => (
                            <button
                              key={headOption}
                              className={`connection-option rounded-md border px-2 py-3 transition-colors ${currentStartArrowHead === headOption ? "border-blue-300 bg-blue-50" : "hover:bg-gray-50"}`}
                              onClick={() => {
                                setCurrentStartArrowHead(headOption);
                                if (onPropertiesChange) {
                                  onPropertiesChange({ startArrowHead: headOption });
                                }
                              }}
                            >
                              <div className="flex h-6 items-center justify-center">
                                {headOption === "none" ? (
                                  <div className="h-0.5 w-6 bg-gray-300"></div>
                                ) : headOption === "arrow" ? (
                                  <svg
                                    width="24"
                                    height="10"
                                    viewBox="0 0 24 10"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M0 5H22M22 5L18 1M22 5L18 9"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    />
                                  </svg>
                                ) : headOption === "circle" ? (
                                  <svg
                                    width="24"
                                    height="10"
                                    viewBox="0 0 24 10"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle cx="5" cy="5" r="4" fill="currentColor" />
                                    <line
                                      x1="5"
                                      y1="5"
                                      x2="22"
                                      y2="5"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    width="24"
                                    height="10"
                                    viewBox="0 0 24 10"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M0 5H22M4 1L0 5L4 9"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div className="mt-2 text-center text-xs">
                                {getArrowHeadName(headOption)}
                              </div>
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="mb-3 block text-sm font-medium text-gray-700">
                        Punta final
                      </label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {(["none", "arrow", "circle", "diamond"] as ArrowHeadType[]).map(
                          (headOption) => (
                            <button
                              key={headOption}
                              className={`connection-option rounded-md border px-2 py-3 transition-colors ${currentArrowHead === headOption ? "border-blue-300 bg-blue-50" : "hover:bg-gray-50"}`}
                              onClick={() => {
                                setCurrentArrowHead(headOption || "arrow");
                                if (onPropertiesChange) {
                                  onPropertiesChange({ endArrowHead: headOption });
                                }
                              }}
                            >
                              <div className="flex h-6 items-center justify-center">
                                {headOption === "none" && (
                                  <span className="h-1 w-16 bg-gray-700"></span>
                                )}
                                {headOption === "arrow" && <span className="text-lg">→</span>}
                                {headOption === "circle" && <span className="text-lg">◯</span>}
                                {headOption === "diamond" && <span className="text-lg">♦</span>}
                              </div>
                              <div className="mt-2 text-center text-sm">
                                {getArrowHeadName(headOption)}
                              </div>
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {onDelete && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 border-t border-gray-200 pt-6"
                      >
                        <button
                          onClick={handleDelete}
                          className="flex w-full items-center justify-center rounded-md border border-red-200 bg-red-50 px-4 py-2.5 font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="mr-2 h-5 w-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Eliminar conexión
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </>,
          document.body
        )}
    </div>
  );
}

// Función para obtener el nombre legible de las animaciones
function getAnimationName(animation: ArrowAnimation): string {
  switch (animation) {
    case "none":
      return "Ninguna";
    case "pulse":
      return "Pulso";
    case "flow":
      return "Flujo";
    case "dash":
      return "Líneas";
    case "traveling-dot":
      return "Punto";
    case "traveling-dot-fast":
      return "Punto rápido";
    case "traveling-dot-fastest":
      return "Punto veloz";
    default:
      return "Desconocida";
  }
}

// Función para obtener el nombre legible del estilo de línea
function getStyleName(style: ArrowStyle): string {
  switch (style) {
    case "solid":
      return "Sólida";
    case "dashed":
      return "Rayada";
    case "dotted":
      return "Punteada";
    default:
      return "Desconocida";
  }
}

// Función para obtener el nombre legible del tipo de punta de flecha
function getArrowHeadName(arrowHead: ArrowHeadType): string {
  switch (arrowHead) {
    case "none":
      return "Ninguna";
    case "arrow":
      return "Flecha";
    case "circle":
      return "Círculo";
    case "diamond":
      return "Diamante";
    default:
      return "Desconocida";
  }
}
