"use client";

import React from "react";

import { DraggableItem } from "@/app/components/molecules/draggable-item/draggable-item";

export function SidePanel() {
  const generatePayPalLink = () => {
    return `https://www.paypal.com/donate?business=yasnielfajardoegues@icloud.com&item_name=Donaci%C3%B3n%20para%20Archit%20Studio&currency_code=USD`;
  };

  const isMac =
    typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Contenido de la pestaña activa */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <h3 className="mb-2 text-sm font-medium uppercase text-gray-500">Componentes</h3>
          <div className="space-y-2">
            <DraggableItem id={`square-${Date.now()}`} type="square" label="Tarjeta" text="" />

            <DraggableItem
              id={`container-${Date.now()}`}
              type="container"
              label="Contenedor"
              text="Contenedor"
            />
          </div>

          <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-3 text-blue-700">
            <h3 className="mb-2 text-center font-medium">Instrucciones</h3>
            <p className="text-xs">
              1. Arrastra elementos desde aquí al lienzo
              <br />
              2. Haz clic en el elemento para seleccionarlo
              <br />
              3. Con 2 clicks encima de una tarjeta puedes cambiar su color
              <br />
              4. Con la barra espaciadora puedes moverte por el lienzo
              <br />
              {isMac && (
                <span>
                  5. En Mac, usa dos dedos en el trackpad para navegar
                  <br />
                </span>
              )}
              {isMac ? "6" : "5"}. Doble click en los nodos para cambiar su Color
              <br />
              {isMac ? "7" : "6"}. Click en las lineas para editarlas y agregarles animaciones
            </p>
          </div>

          {/* Botón de Donación */}
          <div className="mt-8 flex justify-center">
            <a
              href={generatePayPalLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-purple-600 px-4 py-2 text-sm font-medium text-white transition-shadow hover:shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>Apoyar este proyecto</span>
            </a>
          </div>

          {/* Segundo anuncio más pequeño */}
          {/* <div className="mt-4">
            <GoogleAds
              adSlot="0987654321" // Reemplazar con tu segundo Ad Slot ID real
              adFormat="banner"
              className="mx-auto w-full max-w-sm"
              style={{ minHeight: "100px" }}
              fallbackText="💡 Los anuncios nos ayudan a mantener esta herramienta gratuita"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}
