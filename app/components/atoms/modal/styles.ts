import { ModalSize } from "./types";

export const modalOverlayStyles = "fixed inset-0 bg-black/50 flex items-center justify-center z-50";

export const modalContainerStyles =
  "bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col";

export const modalHeaderStyles = "px-6 py-4 border-b flex justify-between items-center";

export const modalBodyStyles = "px-6 py-4 overflow-y-auto flex-grow";

export const modalFooterStyles = "px-6 py-4 border-t flex justify-end gap-2";

export const closeButtonStyles = "text-gray-500 hover:text-gray-700 transition-colors";

export const getSizeStyles = (size: ModalSize = "medium"): string => {
  const sizeMap: Record<ModalSize, string> = {
    small: "w-full max-w-md",
    medium: "w-full max-w-lg",
    large: "w-full max-w-xl",
    fullscreen: "w-[95%] h-[90%]",
  };

  return sizeMap[size];
};

export const modalStyles = {
  overlay: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4",
  container: "relative w-full max-w-md rounded-lg bg-white p-5 shadow-lg",
  header: "flex items-center justify-between mb-4",
  title: "text-xl font-medium text-gray-900",
  closeButton:
    "text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center",
  content: "max-h-[70vh] overflow-y-auto",
  footer: "mt-5 flex justify-end space-x-2 pt-4 border-t border-gray-200",

  // Animaciones
  fadeIn: "animate-fadeIn",
  fadeOut: "animate-fadeOut",
};
