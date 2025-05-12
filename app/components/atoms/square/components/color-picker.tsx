import React from 'react';
import { ColorPickerProps, predefinedColors } from '../types';
import { colorPickerStyles } from '../styles';
import { useColorPicker } from '../hooks/useColorPicker';
import { Modal } from '../../modal/Modal';

export function ColorPicker({ 
  isOpen, 
  onClose, 
  onSelect, 
  initialColor,
  showZIndexControls = false,
  initialZIndex = 0
}: ColorPickerProps) {
  const {
    selectedColor,
    zIndex,
    handleColorChange,
    handleTextChange,
    handleZIndexChange,
    selectColor,
    applyColor
  } = useColorPicker({ 
    initialColor, 
    onSelect, 
    onClose,
    showZIndexControls,
    initialZIndex
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
          <label className={colorPickerStyles.label}>
            Seleccionar color personalizado
          </label>
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
            <label className={colorPickerStyles.label}>
              Prioridad de superposición
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={zIndex}
                onChange={handleZIndexChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={zIndex}
                onChange={handleZIndexChange}
                className="w-16 border border-gray-300 px-2 py-1 rounded-md text-sm focus:outline-none"
              />
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Mayor valor = Por encima de otros contenedores
            </div>
          </div>
        )}
        
        {/* Colores predefinidos */}
        <div>
          <label className={colorPickerStyles.label}>
            Colores predefinidos
          </label>
          <div className={colorPickerStyles.colorsGrid}>
            {predefinedColors.map((color, index) => (
              <button
                key={index}
                className={`${colorPickerStyles.colorButton} ${
                  selectedColor === color ? colorPickerStyles.colorButtonSelected : colorPickerStyles.colorButtonHover
                }`}
                style={{ backgroundColor: color }}
                onClick={() => selectColor(color)}
                aria-label={`Color ${color}`}
              />
            ))}
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className={colorPickerStyles.cancelButton}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={colorPickerStyles.applyButton}
            onClick={handleApplyColor}
          >
            Aplicar
          </button>
        </div>
      </div>
    </Modal>
  );
} 