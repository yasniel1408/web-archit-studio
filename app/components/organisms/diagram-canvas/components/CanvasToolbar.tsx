import React from "react";

import { DebugToggle } from "@/app/components/atoms/debug-toggle/debug-toggle";

type CanvasToolbarProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onExport: () => void;
  onExportGif: () => void;
  onExportModernGif: () => void;
  onImport: () => void;
  onShowJson: () => void;
  onShowTemplates: () => void;
  onClearCanvas: () => void;
  scale: number;
};

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  onExport,
  onExportGif,
  onExportModernGif,
  onImport,
  onShowJson,
  onShowTemplates,
  onClearCanvas,
  scale,
}) => {
  return (
    <div className="mb-2 flex items-center gap-2 rounded-lg border bg-white p-2 shadow-sm">
      <div className="mr-4 flex items-center">
        <button
          className="rounded-md p-1.5 transition-colors hover:bg-gray-100"
          onClick={onZoomOut}
          title="Reducir zoom"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
          </svg>
        </button>

        <span className="mx-2 rounded bg-gray-50 px-2 py-0.5 font-mono text-xs">
          {Math.round(scale * 100)}%
        </span>

        <button
          className="rounded-md p-1.5 transition-colors hover:bg-gray-100"
          onClick={onZoomIn}
          title="Aumentar zoom"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </button>

        <button
          className="ml-2 rounded-md p-1.5 transition-colors hover:bg-gray-100"
          onClick={onResetView}
          title="Restablecer vista"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
            />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-1.5 border-l pl-4">
        <button
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors hover:bg-gray-100 hover:text-primary"
          onClick={onImport}
          title="Importar diagrama"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
          </svg>
          <span>Importar</span>
        </button>

        <button
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors hover:bg-gray-100 hover:text-primary"
          onClick={onExport}
          title="Exportar diagrama como JSON"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
          </svg>
          <span>JSON</span>
        </button>

        <button
          className="flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs text-primary shadow-sm transition-colors hover:bg-primary/20"
          onClick={onExportGif}
          title="Exportar diagrama animado como GIF (5 segundos / 30 FPS)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z" />
          </svg>
          <span>Exportar GIF</span>
        </button>

        <button
          className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-green-500/10 to-blue-500/10 px-3 py-1.5 text-xs text-green-700 shadow-sm transition-all hover:scale-105 hover:from-green-500/20 hover:to-blue-500/20"
          onClick={onExportModernGif}
          title="Exportar como MP4 usando WebCodecs API - Hasta 10x más rápido que GIF tradicional"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M7 2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2.5L17 3a1 1 0 0 1 1.5.9v8.2a1 1 0 0 1-1.5.9L15 11.5V14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V2z" />
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          </svg>
          <span className="font-semibold">🚀 MP4 Pro</span>
        </button>

        <button
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors hover:bg-gray-100 hover:text-primary"
          onClick={onShowJson}
          title="Ver JSON"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M6.854 4.646a.5.5 0 0 1 0 .708L4.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0zm2.292 0a.5.5 0 0 0 0 .708L11.793 8l-2.647 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0z" />
          </svg>
          <span>Ver JSON</span>
        </button>

        <button
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors hover:bg-gray-100 hover:text-primary"
          onClick={onShowTemplates}
          title="Plantillas"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M3 0h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3zm0 8h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H3z" />
          </svg>
          <span>Plantillas</span>
        </button>

        <button
          className="ml-2 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
          onClick={onClearCanvas}
          title="Eliminar todos los elementos del lienzo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
          </svg>
          <span>Limpiar Lienzo</span>
        </button>
      </div>

      {/* Sección de herramientas de desarrollo */}
      <div className="ml-2 flex items-center gap-1.5 border-l pl-4">
        <DebugToggle showText={false} compact={true} />
      </div>
    </div>
  );
};
