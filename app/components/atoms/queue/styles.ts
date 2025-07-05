export const queueStyles = {
  container:
    "w-full h-full border-2 border-gray-300 rounded-lg shadow-lg flex flex-col justify-center relative ",
  icon: "absolute z-10",
  iconClickable: "cursor-pointer",
  addIconButton:
    "absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer z-10 hover:bg-blue-200 transition-colors",
  addIconSvg: "w-4 h-4 text-blue-600",
  colorIndicator: "absolute top-1.5 right-1.5 flex items-center z-10",
  colorDot:
    "w-3 h-3 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform",
  contentContainer: "w-full h-full flex flex-col items-center justify-center relative",
  input:
    "w-auto max-w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-1 py-0.5 bg-transparent text-sm font-medium text-gray-700 placeholder-gray-400",
  text: "text-sm font-medium text-gray-700 text-center break-words max-w-full",

  // Estilos para la animación - más visibles
  animationContainer: "absolute inset-0 pointer-events-none overflow-hidden rounded-lg",
  queueTrack:
    "absolute bottom-2 left-2 right-2 h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 rounded-full opacity-80",
  queueMessage:
    "absolute rounded-full border-2 border-white shadow-lg transition-all duration-100 ease-linear",

  // Tamaños de mensajes más grandes
  messageSmall: "w-4 h-4",
  messageMedium: "w-6 h-6",
  messageLarge: "w-8 h-8",

  // Indicador de queue activo
  queueIndicator:
    "absolute top-0.5 right-0.5 text-xs font-bold text-blue-600 bg-blue-200 px-1 rounded-full",

  // Efectos adicionales
  entryEffect:
    "absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-green-200 via-green-100 to-transparent opacity-60 rounded-l-lg",
  exitEffect:
    "absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-red-200 via-red-100 to-transparent opacity-60 rounded-r-lg",

  // Animaciones CSS
  pulseAnimation: "animate-pulse",
  bounceAnimation: "animate-bounce",
};

export const colorPickerStyles = {
  preview: "mb-6 flex flex-col items-center",
  previewColor: "w-24 h-24 rounded-lg shadow-md border border-gray-200 mb-2",
  colorValue: "text-sm font-mono",
  section: "mb-6",
  label: "block text-sm font-medium text-gray-700 mb-2",
  colorInputContainer: "flex items-center gap-4",
  colorInput: "h-10 w-10 border-0 p-0 cursor-pointer",
  hexInput: "flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none",
  colorsGrid: "grid grid-cols-5 gap-2",
  colorButton: "w-full aspect-square rounded-md border",
  colorButtonSelected: "border-2 border-blue-500",
  colorButtonHover: "",
  cancelButton: "px-4 py-2 bg-gray-200 text-gray-800 rounded-md",
  applyButton: "px-4 py-2 bg-blue-600 text-white rounded-md",
};
