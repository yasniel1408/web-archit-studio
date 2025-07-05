import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

import { Modal } from "@/app/components/atoms/modal";

import { IconRenderer } from "./icon-renderer";
import { getCategories, iconsMetadata, IconType } from "./types";

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

export function IconSelector({
  isOpen,
  onClose,
  onSelect,
  initialIcon = "none",
}: IconSelectorProps) {
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
    return iconsMetadata.filter((icon) => {
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
        icon.tags.some((tag) => tag.toLowerCase().includes(searchLower))
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
        <div className="mb-4 rounded-md bg-gray-50 p-3">
          <div className="flex flex-col space-y-3">
            {/* Campo de búsqueda */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="Buscar icono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtros por categoría */}
            <div className="flex flex-wrap gap-2">
              <button
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  selectedCategory === null
                    ? "border-blue-300 bg-blue-100 text-blue-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                Todos
              </button>

              {getCategories().map((category) => (
                <button
                  key={category}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    selectedCategory === category
                      ? "border-blue-300 bg-blue-100 text-blue-800"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
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
        <div className="custom-scrollbar overflow-y-auto" style={{ maxHeight: "60vh" }}>
          {filterIcons().length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4 lg:grid-cols-8">
              {filterIcons().map((icon) => (
                <motion.div
                  key={icon.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border p-2 transition-colors md:p-3 ${
                    selectedIcon === icon.id
                      ? "border-blue-300 bg-blue-50 ring-2 ring-blue-300"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => selectIcon(icon.id)}
                >
                  <div className="flex h-10 w-10 items-center justify-center md:h-12 md:w-12">
                    {icon.id === "none" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-gray-400 md:h-8 md:w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <IconRenderer iconType={icon.id} />
                    )}
                  </div>
                  <span className="mt-1 w-full truncate text-center text-[10px] text-gray-700 md:mt-2 md:text-xs">
                    {icon.name}
                  </span>
                  <span className="w-full truncate text-[8px] text-gray-500 md:text-[10px]">
                    {icon.category}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mb-4 h-12 w-12 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M18 7V5M18 11v-2"
                />
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
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
          <span className="text-sm text-gray-500">
            {filterIcons().length} {filterIcons().length === 1 ? "icono" : "iconos"} disponible
            {filterIcons().length !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-2">
            <button
              className="rounded-md bg-gray-200 px-3 py-2 text-sm text-gray-800 transition-colors hover:bg-gray-300 md:px-5"
              onClick={closeIconSelector}
            >
              Cancelar
            </button>
            <button
              className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700 md:px-5"
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
