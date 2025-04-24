import React from 'react';
import { ColorPickerProps, predefinedColors } from '../types';
import { colorPickerStyles } from '../styles';
import { useColorPicker } from '../hooks/useColorPicker';
import { Modal } from '../../modal/Modal';

export function ColorPicker({ isOpen, onClose, onSelect, initialColor }: ColorPickerProps) {
  const {
    selectedColor,
    handleColorChange,
    handleTextChange,
    selectColor,
    applyColor
  } = useColorPicker({ initialColor, onSelect, onClose });
  
  const handleApplyColor = () => {
    applyColor();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Personalizar Color"
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