import { ArrowAnimation, ArrowHeadType, ArrowStyle } from "./types";

// Estilos personalizados para la barra de desplazamiento
export const scrollbarStyles = `
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

// Clases para el SVG path de la flecha
export const getPathClass = (animation: ArrowAnimation, isSelected: boolean): string => {
  const animClass =
    animation === "dash" ? "animate-dash" : animation === "flow" ? "animate-flow" : "";
  return `${animClass} pointer-events-none ${isSelected ? "connection-selected" : ""}`;
};

// Obtener el patrón de trazo según el estilo y animación
export const getDashArray = (style: ArrowStyle, animation: ArrowAnimation): string => {
  if (
    animation === "traveling-dot" ||
    animation === "traveling-dot-fast" ||
    animation === "traveling-dot-fastest"
  ) {
    return "2, 4"; // Estilo discontinuo fino para el punto viajero
  }

  switch (style) {
    case "dashed":
      return "8, 4";
    case "dotted":
      return "2, 2";
    default:
      return ""; // Solid
  }
};

// Clases para elementos UI
export const optionsMenuClass =
  "absolute bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden min-w-[200px] text-xs fade-in z-50 pointer-events-auto";
export const optionButtonClass =
  "flex items-center justify-between w-full px-3 py-2 text-gray-600 hover:bg-gray-50";

// Estilos para el svg principal
export const svgMainStyle = {
  overflow: "visible" as const,
  filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))",
};

// Estilos para el path interactivo invisible
export const pathInteractiveStyle = {
  cursor: "pointer" as const,
  pointerEvents: "stroke" as const,
  zIndex: 30,
};

// Estilos para el path de sombra
export const pathShadowStyle = {
  pointerEvents: "none" as const,
  zIndex: 39,
};

// Estilos para el path visible
export const getPathVisibleStyle = (isSelected: boolean) => {
  return {
    transition: "stroke 0.2s ease, stroke-width 0.2s ease",
    filter: isSelected
      ? "drop-shadow(0 0 3px rgba(0,0,0,0.3))"
      : "drop-shadow(0 0 2px rgba(0,0,0,0.2))",
    pointerEvents: "none" as const,
    zIndex: 40,
  };
};

// Estilos para cabezas de flecha
export const arrowHeadStyle = () => {
  return {
    transition: "fill 0.2s ease",
    pointerEvents: "none" as const,
    zIndex: 55,
  };
};

// Estilo para el contenedor principal
export const containerStyle = (isModalOpen: boolean) => {
  return {
    zIndex: isModalOpen ? 25 : 15,
  };
};

// Nombres para mostrar en la UI
export const getAnimationName = (animation: ArrowAnimation): string => {
  switch (animation) {
    case "none":
      return "Sin animación";
    case "pulse":
      return "Pulso";
    case "flow":
      return "Flujo";
    case "dash":
      return "Línea en movimiento";
    case "traveling-dot":
      return "Punto viajero";
    case "traveling-dot-fast":
      return "Punto viajero rápido";
    case "traveling-dot-fastest":
      return "Punto viajero muy rápido";
    default:
      return "Desconocido";
  }
};

export const getStyleName = (style: ArrowStyle): string => {
  switch (style) {
    case "solid":
      return "Sólida";
    case "dashed":
      return "Discontinua";
    case "dotted":
      return "Punteada";
    default:
      return "Desconocido";
  }
};

export const getArrowHeadName = (arrowHead: ArrowHeadType): string => {
  switch (arrowHead) {
    case "none":
      return "Sin punta";
    case "arrow":
      return "Flecha";
    case "circle":
      return "Círculo";
    case "diamond":
      return "Diamante";
    default:
      return "Desconocido";
  }
};
