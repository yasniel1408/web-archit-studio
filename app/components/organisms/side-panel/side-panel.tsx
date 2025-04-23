"use client";

import React, { useState } from 'react';
import { DraggableItem } from '@/app/components/molecules/draggable-item/draggable-item';

export function SidePanel() {
  const generatePayPalLink = () => {
      return `https://www.paypal.com/donate?business=yasnielfajardoegues@icloud.com&item_name=Donaci%C3%B3n%20para%20Archit%20Studio&currency_code=USD`;
  };

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Contenido de la pestaña activa */}
      <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-sm uppercase font-medium text-gray-500 mb-2">Componentes</h3>
            <div className="space-y-2">
              <DraggableItem 
                id={`square-${Date.now()}`} 
                type="square" 
                label="Tarjeta" 
                text=""
              />
            </div>
            
            <div className="mt-8 p-3 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">
              <h3 className="font-medium text-center mb-2">Instrucciones</h3>
              <p className="text-xs">
                1. Arrastra elementos desde aquí al lienzo<br/>
                2. Haz clic en el elemento para seleccionarlo<br/>
                3. Con 2 clicks encima de una tarjeta puedes cambiar su color<br/>
                4. Con la barra espaciadora puedes moverte por el lienzo<br/>
                {isMac && <span>4. En Mac, usa dos dedos en el trackpad para navegar<br/></span>}
                {isMac ? '6' : '5'}. Doble click en los nodos para cambiar su Color<br/>
                {isMac ? '7' : '6'}. Click en las lineas para editarlas y agregarles animaciones
              </p>
            </div>
            
            {/* Botón de Donación */}
            <div className="mt-4 space-y-3">
              <h4 className="text-xs uppercase font-medium text-gray-500 text-center">¿Te gusta Archit Studio?</h4>
              
              <a 
                href={generatePayPalLink()}
                target="_blank"
                rel="noopener noreferrer" 
                className="flex items-center justify-center w-full py-1.5 px-3 bg-[#3eaf7c] hover:bg-[#318f64] text-white rounded-md transition-colors duration-200 shadow-sm text-xs"
              >
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 10h18v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8zm0-4a2 2 0 012-2h14a2 2 0 012 2v2H3V6zm4 10a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2z"></path>
                </svg>
                Donar con tarjeta
              </a>
              
              <div className="text-center text-xs text-gray-500 mt-1">
                Tu apoyo permite seguir mejorando 🙌
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
