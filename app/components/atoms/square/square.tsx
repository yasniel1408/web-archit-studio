"use client";

import React, { useState } from 'react';
import { IconType, IconRenderer, IconSelector } from '../icon-selector';

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

interface SquareProps {
  className?: string;
  text?: string;
  editable?: boolean;
  initialText?: string;
  icon?: IconType;
  onIconChange?: (icon: IconType) => void;
}

export function Square({ 
  className = "", 
  text = "", 
  editable = false,
  initialText = "",
  icon = "none",
  onIconChange
}: SquareProps) {
  const [innerText, setInnerText] = useState(initialText || text);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconType>(icon);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInnerText(e.target.value);
  };
  
  const handleInputClick = (e: React.MouseEvent) => {
    // Detener la propagación para que el clic en el input no inicie el arrastre
    e.stopPropagation();
  };

  const handleIconClick = (e: React.MouseEvent) => {
    if (editable) {
      e.stopPropagation();
      setShowIconSelector(true);
    }
  };

  const handleIconChange = (newIcon: IconType) => {
    setSelectedIcon(newIcon);
    if (onIconChange) {
      onIconChange(newIcon);
    }
  };

  return (
    <div 
      className={`w-full h-full ${className}`}
    >
      {/* Icono */}
      {selectedIcon !== 'none' && (
        <div 
          className={`absolute top-1.5 left-1.5 ${editable ? 'cursor-pointer hover:opacity-80' : ''}`} 
          onClick={handleIconClick}
        >
          <IconRenderer iconType={selectedIcon} className="w-9 h-9" />
        </div>
      )}
      
      {/* Botón para mostrar selector si no hay icono */}
      {selectedIcon === 'none' && editable && (
        <div 
          className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200"
          onClick={handleIconClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      )} 
       
      <div className="w-full h-full flex items-center justify-center">
        {editable ? (
          <input
            type="text"
            value={innerText}
            onChange={handleTextChange}
            onClick={handleInputClick}
            onMouseDown={e => e.stopPropagation()}
            className="w-auto max-w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent px-2 py-1 pointer-events-auto"
            placeholder="Texto aquí"
          />
        ) : (
          <div className="text-center w-auto max-w-full overflow-hidden text-black px-2 py-1 pointer-events-none">
            {innerText || text}
          </div>
        )}
      </div>
      
      {/* Selector de iconos (modal) */}
      <IconSelector
        isOpen={showIconSelector}
        onClose={() => setShowIconSelector(false)}
        onSelect={handleIconChange}
        initialIcon={selectedIcon}
      />
    </div>
  );
}
