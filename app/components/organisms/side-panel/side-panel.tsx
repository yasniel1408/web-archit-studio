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
              
              <DraggableItem 
                id={`container-${Date.now()}`} 
                type="container" 
                label="Contenedor" 
                text="Contenedor"
              />
            </div>
            
            <div className="mt-8 p-3 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">
              <h3 className="font-medium text-center mb-2">Instrucciones</h3>
              <p className="text-xs">
                1. Arrastra elementos desde aquí al lienzo<br/>
                2. Haz clic en el elemento para seleccionarlo<br/>
                3. Con 2 clicks encima de una tarjeta puedes cambiar su color<br/>
                4. Con la barra espaciadora puedes moverte por el lienzo<br/>
                {isMac && <span>5. En Mac, usa dos dedos en el trackpad para navegar<br/></span>}
                {isMac ? '6' : '5'}. Doble click en los nodos para cambiar su Color<br/>
                {isMac ? '7' : '6'}. Click en las lineas para editarlas y agregarles animaciones
              </p>
            </div>
            
            {/* Botón de Donación */}
            <div className="mt-8 flex justify-center">
              <a 
                href={generatePayPalLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm bg-gradient-to-r from-primary to-purple-600 text-white font-medium hover:shadow-lg transition-shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Apoyar este proyecto</span>
              </a>
            </div>
          </div>
      </div>
    </div>
  );
}
