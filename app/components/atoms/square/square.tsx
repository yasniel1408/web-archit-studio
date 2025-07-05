"use client";

import React from "react";

import { IconRenderer, IconSelector } from "../icon-selector";
import { ColorPicker } from "./components/color-picker";
import { useSquare } from "./hooks/useSquare";
import { squareStyles } from "./styles";
import { SquareProps } from "./types";

export function Square({
  className = "",
  text = "",
  editable = false,
  initialText = "",
  icon = "none",
  backgroundColor = "#FFFFFF",
  zIndex = 0,
  onIconChange,
  onColorChange,
  onColorPickerOpen,
  onColorPickerClose,
  onIconSelectorOpen,
  onIconSelectorClose,
  onTextChange,
}: SquareProps) {
  const {
    innerText,
    showIconSelector,
    showColorPicker,
    selectedIcon,
    selectedColor,
    handleTextChange,
    handleInputClick,
    handleIconClick,
    handleSquareClick,
    handleSquareDoubleClick,
    handleIconChange,
    handleColorChange,
    handleCloseColorPicker,
    handleCloseIconSelector,
  } = useSquare({
    initialText,
    text,
    icon,
    backgroundColor,
    editable,
    ...(onIconChange && { onIconChange }),
    ...(onColorChange && { onColorChange }),
    ...(onIconSelectorOpen && { onIconSelectorOpen }),
    ...(onIconSelectorClose && { onIconSelectorClose }),
    ...(onColorPickerOpen && { onColorPickerOpen }),
    ...(onColorPickerClose && { onColorPickerClose }),
    ...(onTextChange && { onTextChange }),
  });

  // Estilo sin transiciones para asegurar movimiento instantáneo
  const noTransitionStyle = {
    backgroundColor: selectedColor,
    transition: "none",
    animation: "none",
  };

  return (
    <div
      className={`${squareStyles.container} ${className}`}
      style={noTransitionStyle}
      onClick={handleSquareClick}
      onDoubleClick={handleSquareDoubleClick}
    >
      {/* Icono */}
      {selectedIcon !== "none" && (
        <div
          className={`${squareStyles.icon} ${editable ? squareStyles.iconClickable : ""}`}
          onClick={handleIconClick}
          style={{ transition: "none" }}
        >
          <IconRenderer iconType={selectedIcon} className="h-9 w-9" />
        </div>
      )}

      {/* Botón para mostrar selector si no hay icono */}
      {selectedIcon === "none" && editable && (
        <div
          className={squareStyles.addIconButton}
          onClick={handleIconClick}
          style={{ transition: "none" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={squareStyles.addIconSvg}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      )}

      {/* Indicador de color personalizado */}
      {editable && selectedColor !== "#FFFFFF" && (
        <div className={squareStyles.colorIndicator} style={{ transition: "none" }}>
          <div
            className={squareStyles.colorDot}
            style={{ backgroundColor: selectedColor, transition: "none" }}
          ></div>
        </div>
      )}

      <div className={squareStyles.contentContainer} style={{ transition: "none" }}>
        {editable ? (
          <input
            type="text"
            value={innerText}
            onChange={handleTextChange}
            onClick={handleInputClick}
            onMouseDown={(e) => e.stopPropagation()}
            className={`${squareStyles.input} square-text-element`}
            placeholder="Texto aquí"
            style={{
              backgroundColor: "transparent",
              transition: "none",
              lineHeight: "1.2",
              verticalAlign: "middle",
              marginTop: "0",
              marginBottom: "0",
            }}
            data-html2canvas-capture="true"
            data-export-text="true"
          />
        ) : (
          <div
            className={`${squareStyles.text} square-text-element`}
            style={{
              transition: "none",
              lineHeight: "1.2",
              verticalAlign: "middle",
              marginTop: "0",
              marginBottom: "0",
            }}
            data-html2canvas-capture="true"
            data-export-text="true"
          >
            {innerText || text}
          </div>
        )}
      </div>

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
