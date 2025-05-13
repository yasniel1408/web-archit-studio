"use client";

import React from 'react';
import { ContainerProps } from './types';
import { containerStyles } from './styles';
import { IconRenderer, IconSelector } from '../icon-selector';
import { ColorPicker } from '../square/components/color-picker';
import { useContainer } from './hooks/useContainer';

export function Container({ 
  className = "", 
  text = "", 
  editable = false,
  initialText = "",
  icon = "none",
  backgroundColor = "transparent",
  borderStyle = "dashed",
  zIndex = 0,
  onIconChange,
  onColorChange,
  onColorPickerOpen,
  onColorPickerClose,
  onIconSelectorOpen,
  onIconSelectorClose,
  onTextChange
}: ContainerProps) {
  const {
    innerText,
    showIconSelector,
    showColorPicker,
    selectedIcon,
    selectedColor,
    selectedBorderStyle,
    handleTextChange,
    handleInputClick,
    handleIconClick,
    handleContainerClick,
    handleContainerDoubleClick,
    handleIconChange,
    handleColorChange,
    handleCloseColorPicker,
    handleCloseIconSelector
  } = useContainer({
    initialText,
    text,
    icon,
    backgroundColor,
    borderStyle,
    zIndex,
    editable,
    onIconChange,
    onColorChange,
    onIconSelectorOpen,
    onIconSelectorClose,
    onColorPickerOpen,
    onColorPickerClose,
    onTextChange
  });
  
  // Estilo sin transiciones para asegurar movimiento instantáneo
  const noTransitionStyle = {
    backgroundColor: selectedColor,
    transition: 'none',
    animation: 'none',
    borderStyle: selectedBorderStyle,
    zIndex: zIndex
  };
  
  return (
    <div 
      className={`${containerStyles.container} ${className}`}
      style={noTransitionStyle}
      onClick={handleContainerClick}
      onDoubleClick={handleContainerDoubleClick}
    >
      {/* Título (en la parte superior) */}
      <div className={containerStyles.titleContainer} 
           style={{ transition: 'none', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
           data-export-important="true">
        {/* Icono (al lado del título) */}
        {selectedIcon !== 'none' && (
          <div 
            className={`${containerStyles.icon} ${editable ? containerStyles.iconClickable : ''}`} 
            onClick={handleIconClick}
            style={{ transition: 'none' }}
          >
            <IconRenderer iconType={selectedIcon} className="w-5 h-5" />
          </div>
        )}
        
        {/* Texto del título */}
        {editable ? (
          <input
            type="text"
            value={innerText}
            onChange={handleTextChange}
            onClick={handleInputClick}
            onMouseDown={e => e.stopPropagation()}
            className={`${containerStyles.input} container-text-element`}
            placeholder="Título aquí"
            style={{ 
              backgroundColor: 'transparent', 
              transition: 'none', 
              lineHeight: '1.2', 
              verticalAlign: 'middle',
              marginTop: '0',
              marginBottom: '0'
            }}
            data-html2canvas-capture="true"
            data-export-text="true"
          />
        ) : (
          <div 
            className={`${containerStyles.text} container-text-element`} 
            style={{ 
              transition: 'none', 
              lineHeight: '1.2', 
              verticalAlign: 'middle',
              marginTop: '0',
              marginBottom: '0'
            }}
            data-html2canvas-capture="true"
            data-export-text="true"
          >
            {innerText || text}
          </div>
        )}
      </div>
      
      {/* Área de contenido (para los nodos hijos) */}
      <div className={containerStyles.contentArea} style={{ transition: 'none' }}>
        {/* Aquí se renderizarán los nodos hijos */}
      </div>
      
      {/* Botón para mostrar selector si no hay icono */}
      {selectedIcon === 'none' && editable && (
        <div 
          className={containerStyles.addIconButton}
          onClick={handleIconClick}
          style={{ transition: 'none' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={containerStyles.addIconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      )}
      
      {/* Indicador de color personalizado */}
      {editable && selectedColor !== "transparent" && (
        <div className={containerStyles.colorIndicator} style={{ transition: 'none' }}>
          <div
            className={containerStyles.colorDot}
            style={{ backgroundColor: selectedColor, transition: 'none' }}
          ></div>
        </div>
      )}
      
      {/* Selector de iconos (modal) */}
      <IconSelector 
        isOpen={showIconSelector}
        onClose={handleCloseIconSelector}
        onSelect={handleIconChange}
        initialIcon={selectedIcon}
      />
      
      {/* Selector de color (modal) */}
      <ColorPicker
        isOpen={showColorPicker}
        onClose={handleCloseColorPicker}
        onSelect={handleColorChange}
        initialColor={selectedColor}
        showZIndexControls={true}
        initialZIndex={zIndex}
      />
    </div>
  );
} 