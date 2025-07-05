import React from "react";

import { Modal } from "../../modal/Modal";
import { useColorPicker } from "../hooks/useColorPicker";
import { colorPickerStyles } from "../styles";
import { ColorPickerProps, predefinedColors } from "../types";

export function ColorPicker({
  isOpen,
  onClose,
  onSelect,
  initialColor,
  showZIndexControls = false,
  initialZIndex = 0,
}: ColorPickerProps) {
  const {
    selectedColor,
    zIndex,
    handleColorChange,
    handleTextChange,
    handleZIndexChange,
    selectColor,
    applyColor,
  } = useColorPicker({
    initialColor,
    onSelect,
    onClose,
    showZIndexControls,
    initialZIndex,
  });

  const handleApplyColor = () => {
    applyColor();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Personalizar Contenedor"
      size="small"
      className="overflow-hidden"
    >
      <div className="flex flex-col">
        {/* Vista previa del color */}
        <div className={colorPickerStyles.preview}>
          <div
            className={colorPickerStyles.previewColor}
            style={{ backgroundColor: selectedColor }}
          ></div>
          <span className={colorPickerStyles.colorValue}>{selectedColor}</span>
        </div>

        {/* Input tipo color */}
        <div className={colorPickerStyles.section}>
          <label className={colorPickerStyles.label}>Seleccionar color personalizado</label>
          <div className={colorPickerStyles.colorInputContainer}>
            <input
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className={colorPickerStyles.colorInput}
            />
            <input
              type="text"
              value={selectedColor}
              onChange={handleTextChange}
              className={colorPickerStyles.hexInput}
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        {/* Control de prioridad de superposición (Z-Index) */}
        {showZIndexControls && (
          <div className={colorPickerStyles.section}>
            <label className={colorPickerStyles.label}>Prioridad de superposición</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={zIndex}
                onChange={handleZIndexChange}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={zIndex}
                onChange={handleZIndexChange}
                className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none"
              />
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Mayor valor = Por encima de otros contenedores
            </div>
          </div>
        )}

        {/* Colores predefinidos */}
        <div>
          <label className={colorPickerStyles.label}>Colores predefinidos</label>
          <div className={colorPickerStyles.colorsGrid}>
            {predefinedColors.map((color, index) => (
              <button
                key={index}
                className={`${colorPickerStyles.colorButton} ${
                  selectedColor === color
                    ? colorPickerStyles.colorButtonSelected
                    : colorPickerStyles.colorButtonHover
                }`}
                style={{ backgroundColor: color }}
                onClick={() => selectColor(color)}
                aria-label={`Color ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex justify-end gap-2">
          <button className={colorPickerStyles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button className={colorPickerStyles.applyButton} onClick={handleApplyColor}>
            Aplicar
          </button>
        </div>
      </div>
    </Modal>
  );
}
