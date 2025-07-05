import { ArrowStyle } from "@/app/components/atoms/arrow/types";

// Estilo para el backdrop del modal
export const backdropClass =
  "fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center";

// Estilo base para el contenedor del menú
export const menuContainerClass = "bg-white rounded-lg shadow-xl p-4 w-72";

// Estilo para el encabezado del menú
export const menuHeaderClass = "flex justify-between items-center mb-4";
export const menuTitleClass = "text-lg font-medium";
export const closeButtonClass = "text-gray-500 hover:text-gray-700";

// Estilos para la sección de contenido
export const sectionContainerClass = "space-y-4";
export const sectionTitleClass = "font-medium mb-2";

// Estilos para botones
export const buttonGroupClass = "flex space-x-2";
export const buttonGridClass = "grid grid-cols-2 gap-2";
export const buttonBaseClass = "py-2 px-3 border rounded hover:bg-gray-100";
export const arrowHeadButtonClass = `${buttonBaseClass} flex items-center justify-center`;

// Función para obtener la clase del estilo de línea según el tipo
export const getLineStyleClass = (style: ArrowStyle): string => {
  switch (style) {
    case "dashed":
      return "w-full h-0.5 border-dashed border-t border-black h-0";
    case "dotted":
      return "w-full h-0.5 border-dotted border-t border-black h-0";
    case "solid":
    default:
      return "w-full h-0.5 bg-black";
  }
};

// Función para obtener el símbolo adecuado para cada tipo de punta de flecha
export const getArrowHeadSymbol = (arrowType: string, position: "start" | "end"): string => {
  if (arrowType === "none") return "Ninguna";
  if (arrowType === "arrow") return position === "start" ? "←" : "→";
  if (arrowType === "circle") return "◯";
  if (arrowType === "diamond") return "◇";
  return "";
};

// Función para obtener el nombre de la animación
export const getAnimationName = (animation: string): string => {
  switch (animation) {
    case "none":
      return "Ninguna";
    case "pulse":
      return "Pulso";
    case "flow":
      return "Flujo";
    case "dash":
      return "Discontinua";
    case "traveling-dot":
      return "Punto";
    case "traveling-dot-fast":
      return "Punto rápido";
    case "traveling-dot-fastest":
      return "Punto veloz";
    default:
      return animation;
  }
};
