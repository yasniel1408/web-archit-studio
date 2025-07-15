"use client";

import React from "react";

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  // Props del toolbar
  canvasToolbarProps?: {
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
}

export function Header({ onMenuToggle, isMobileMenuOpen, canvasToolbarProps }: HeaderProps) {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border/30 bg-gradient-to-r from-primary/5 to-white px-4 md:px-6">
      {/* Logo y título */}
      <div className="flex items-center gap-4">
        {/* Botón hamburguesa para móvil */}
        <button
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white p-2 transition-colors hover:bg-gray-50 md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className={`h-5 w-5 text-gray-600 transition-transform duration-200 ${
              isMobileMenuOpen ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Logo y título de la aplicación */}
        <div className="flex items-center">
          <h1 className="flex items-center text-xl font-bold text-gray-800 md:text-2xl">
            <span className="text-primary">Archit</span>Studio
            <span className="ml-2 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary md:text-xs">
              v1.2
            </span>
          </h1>
        </div>
      </div>

      {/* Toolbar para desktop (hidden en tablet/mobile) */}
      {canvasToolbarProps && (
        <div className="hidden min-w-0 flex-1 justify-center px-6 xl:flex">
          <div className="flex items-center gap-2 rounded-lg border bg-white p-2 shadow-sm">
            {/* Controles de zoom */}
            <div className="flex items-center">
              <button
                className="rounded-md p-1.5 transition-colors hover:bg-gray-100"
                onClick={canvasToolbarProps.onZoomOut}
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
                {Math.round(canvasToolbarProps.scale * 100)}%
              </span>

              <button
                className="rounded-md p-1.5 transition-colors hover:bg-gray-100"
                onClick={canvasToolbarProps.onZoomIn}
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
                onClick={canvasToolbarProps.onResetView}
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

            {/* Separador */}
            <div className="mx-2 h-6 w-px bg-gray-200" />

            {/* Controles principales */}
            <div className="flex items-center gap-1">
              <button
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors hover:bg-gray-100 hover:text-primary"
                onClick={canvasToolbarProps.onImport}
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
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors hover:bg-gray-100 hover:text-primary"
                onClick={canvasToolbarProps.onExport}
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
                className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary shadow-sm transition-colors hover:bg-primary/20"
                onClick={canvasToolbarProps.onExportGif}
                title="Exportar diagrama animado como GIF"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z" />
                </svg>
                <span>GIF</span>
              </button>

              <button
                className="flex items-center gap-1 rounded-md bg-gradient-to-r from-green-500/10 to-blue-500/10 px-2 py-1 text-xs text-green-700 shadow-sm transition-all hover:scale-105"
                onClick={canvasToolbarProps.onExportModernGif}
                title="Exportar como MP4 Pro"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M7 2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2.5L17 3a1 1 0 0 1 1.5.9v8.2a1 1 0 0 1-1.5.9L15 11.5V14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V2z" />
                </svg>
                <span>MP4 Pro</span>
              </button>

              <button
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors hover:bg-gray-100 hover:text-primary"
                onClick={canvasToolbarProps.onShowJson}
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
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors hover:bg-gray-100 hover:text-primary"
                onClick={canvasToolbarProps.onShowTemplates}
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
                className="ml-2 flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
                onClick={canvasToolbarProps.onClearCanvas}
                title="Limpiar lienzo"
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
                <span>Limpiar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enlaces del header */}
      <nav className="flex items-center gap-3 md:gap-6">
        {/* Link "Sobre mi" */}
        <a
          href="https://www.yasniel.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-primary/10 hover:text-primary md:text-base"
        >
          <svg
            className="h-4 w-4 transition-transform group-hover:scale-110 md:h-5 md:w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="hidden sm:inline">Sobre mi</span>
          <svg
            className="h-3 w-3 transition-transform group-hover:translate-x-0.5 md:h-4 md:w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>

        {/* Indicador de versión mobile */}
        <div className="hidden items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 sm:flex">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span>Online</span>
        </div>
      </nav>
    </header>
  );
}
