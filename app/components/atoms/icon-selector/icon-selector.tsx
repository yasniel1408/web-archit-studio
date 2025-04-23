import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/app/components/atoms/modal';
import { IconType, iconsMetadata, getCategories } from './types';
import { IconRenderer } from './icon-renderer';

// Definir estilos para el scrollbar personalizado
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c5c5c5;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

interface IconSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (icon: IconType) => void;
  initialIcon?: IconType;
}

export function IconSelector({ isOpen, onClose, onSelect, initialIcon = 'none' }: IconSelectorProps) {
  const [selectedIcon, setSelectedIcon] = useState<IconType>(initialIcon);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Actualizar el icono seleccionado cuando cambia el prop
  useEffect(() => {
    setSelectedIcon(initialIcon);
  }, [initialIcon]);

  // Cerrar el selector y limpiar filtros
  const closeIconSelector = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    onClose();
  };

  // Seleccionar un icono y cerrar el selector
  const selectIcon = (newIcon: IconType) => {
    setSelectedIcon(newIcon);
    onSelect(newIcon);
    closeIconSelector();
  };

  // Filtrar iconos basados en búsqueda y categoría
  const filterIcons = () => {
    return iconsMetadata.filter(icon => {
      // Filtrar por categoría si hay una seleccionada
      if (selectedCategory && icon.category !== selectedCategory) {
        return false;
      }
      
      // Si no hay término de búsqueda, mostrar todos
      if (!searchTerm) return true;
      
      // Buscar en nombre, categoría y etiquetas
      const searchLower = searchTerm.toLowerCase();
      return (
        icon.name.toLowerCase().includes(searchLower) ||
        icon.category.toLowerCase().includes(searchLower) ||
        icon.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    });
  };

  return (
    <>
      {/* Estilos para el scrollbar personalizado */}
      <style>{customScrollbarStyles}</style>
      
      <Modal 
        isOpen={isOpen}
        onClose={closeIconSelector}
        title="Seleccionar Icono"
        size="fullscreen"
      >
        {/* Barra de búsqueda y filtros */}
        <div className="mb-4 bg-gray-50 p-3 rounded-md">
          <div className="flex flex-col space-y-3">
            {/* Campo de búsqueda */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Buscar icono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filtros por categoría */}
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedCategory === null 
                    ? 'bg-blue-100 border-blue-300 text-blue-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                Todos
              </button>
              
              {getCategories().map(category => (
                <button
                  key={category}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selectedCategory === category 
                      ? 'bg-blue-100 border-blue-300 text-blue-800' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Contenido con scroll - Grid de iconos */}
        <div className="custom-scrollbar overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {filterIcons().length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
              {filterIcons().map(icon => (
                <motion.div
                  key={icon.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center justify-center p-2 md:p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedIcon === icon.id 
                      ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-300' 
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => selectIcon(icon.id)}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                    {icon.id === 'none' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 md:w-8 md:h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <IconRenderer iconType={icon.id} />
                    )}
                  </div>
                  <span className="mt-1 md:mt-2 text-[10px] md:text-xs text-center text-gray-700 truncate w-full">{icon.name}</span>
                  <span className="text-[8px] md:text-[10px] text-gray-500 truncate w-full">{icon.category}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 7V5M18 11v-2" />
              </svg>
              <p>No se encontraron iconos que coincidan con tu búsqueda</p>
              <button 
                className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
              >
                Borrar filtros
              </button>
            </div>
          )}
        </div>
        
        {/* Pie del modal */}
        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {filterIcons().length} {filterIcons().length === 1 ? 'icono' : 'iconos'} disponible{filterIcons().length !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 md:px-5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
              onClick={closeIconSelector}
            >
              Cancelar
            </button>
            <button
              className="px-3 py-2 md:px-5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              onClick={() => {
                if (selectedIcon) {
                  selectIcon(selectedIcon);
                } else {
                  closeIconSelector();
                }
              }}
            >
              Seleccionar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
} 