"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
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

// Array de colores predefinidos para selección rápida
const predefinedColors = [
  "#FFFFFF", // Blanco
  "#F8F9FA", // Gris muy claro
  "#E9ECEF", // Gris claro
  "#DEE2E6", // Gris
  "#FFCDD2", // Rojo claro
  "#F8BBD0", // Rosa claro
  "#E1BEE7", // Púrpura claro
  "#D1C4E9", // Violeta claro
  "#C5CAE9", // Índigo claro
  "#BBDEFB", // Azul claro
  "#B3E5FC", // Azul claro oceánico
  "#B2EBF2", // Cian claro
  "#B2DFDB", // Verde azulado claro
  "#C8E6C9", // Verde claro
  "#DCEDC8", // Verde lima claro
  "#F0F4C3", // Amarillo claro
  "#FFF9C4", // Amarillo pastel
  "#FFECB3", // Ámbar claro
  "#FFE0B2", // Naranja claro
  "#FFCCBC", // Naranja profundo claro
];

interface SquareProps {
  className?: string;
  text?: string;
  editable?: boolean;
  initialText?: string;
  icon?: IconType;
  backgroundColor?: string;
  onIconChange?: (icon: IconType) => void;
  onColorChange?: (color: string) => void;
}

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (color: string) => void;
  initialColor: string;
}

// Componente ColorPicker
function ColorPicker({ isOpen, onClose, onSelect, initialColor }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState<string>(initialColor || "#FFFFFF");
  
  if (!isOpen) return null;
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };
  
  const selectColor = (color: string) => {
    setSelectedColor(color);
  };
  
  const applyColor = () => {
    onSelect(selectedColor);
    onClose();
  };
  
  return createPortal(
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Personalizar Color
          </h3>
          <button 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Contenido */}
        <div className="p-5">
          {/* Vista previa del color */}
          <div className="mb-6 flex flex-col items-center">
            <div
              className="w-24 h-24 rounded-lg shadow-md border border-gray-200 mb-2"
              style={{ backgroundColor: selectedColor }}
            ></div>
            <span className="text-sm font-mono">{selectedColor}</span>
          </div>
          
          {/* Input tipo color */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar color personalizado
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
                className="h-10 w-10 border-0 p-0 cursor-pointer"
              />
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
          
          {/* Colores predefinidos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colores predefinidos
            </label>
            <div className="grid grid-cols-5 gap-2">
              {predefinedColors.map((color, index) => (
                <button
                  key={index}
                  className={`w-full aspect-square rounded-md border ${
                    selectedColor === color ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => selectColor(color)}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Pie */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={applyColor}
          >
            Aplicar
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

export function Square({ 
  className = "", 
  text = "", 
  editable = false,
  initialText = "",
  icon = "none",
  backgroundColor = "#FFFFFF",
  onIconChange,
  onColorChange
}: SquareProps) {
  // Log al iniciar o re-renderizar el componente
  console.log(`Square renderizado con backgroundColor=${backgroundColor}, icon=${icon}`);
  
  const [innerText, setInnerText] = useState(initialText || text);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconType>(icon);
  const [selectedColor, setSelectedColor] = useState<string>(backgroundColor);
  
  // Actualizar el estado local cuando cambien las props
  React.useEffect(() => {
    console.log("Square - icon cambiado a:", icon);
    setSelectedIcon(icon);
  }, [icon]);
  
  React.useEffect(() => {
    console.log("Square - backgroundColor cambiado a:", backgroundColor);
    setSelectedColor(backgroundColor);
  }, [backgroundColor]);
  
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

  const handleSquareClick = (e: React.MouseEvent) => {
    if (editable) {
      e.stopPropagation();
      setShowColorPicker(true);
    }
  };

  const handleIconChange = (newIcon: IconType) => {
    console.log("Square - Cambiando icono a:", newIcon);
    setSelectedIcon(newIcon);
    if (onIconChange) {
      onIconChange(newIcon);
    }
  };

  const handleColorChange = (newColor: string) => {
    console.log("Square - Cambiando color a:", newColor);
    setSelectedColor(newColor);
    if (onColorChange) {
      onColorChange(newColor);
    }
  };

  // Log antes de renderizar para verificar el estilo
  console.log(`Square - Renderizando con style.backgroundColor=${selectedColor}`);
  
  return (
    <div 
      className={`w-full h-full border border-gray-300 rounded shadow-md 
                flex flex-col items-center justify-center p-2 relative ${className}`}
      style={{ backgroundColor: selectedColor }}
      onClick={handleSquareClick}
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
      
      {/* Indicador de color personalizado */}
      {editable && selectedColor !== "#FFFFFF" && (
        <div className="absolute top-1.5 right-1.5 flex items-center">
          <div
            className="w-3 h-3 rounded-full border border-gray-300"
            style={{ backgroundColor: selectedColor }}
          ></div>
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
            style={{ backgroundColor: 'transparent' }}
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
      
      {/* Selector de color (modal) */}
      <ColorPicker
        isOpen={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        onSelect={handleColorChange}
        initialColor={selectedColor}
      />
    </div>
  );
}
