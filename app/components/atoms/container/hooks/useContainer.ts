import { useState, useEffect } from 'react';
import { IconType } from '../../icon-selector';

interface UseContainerProps {
  initialText?: string;
  text?: string;
  icon?: IconType;
  backgroundColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  editable?: boolean;
  onIconChange?: (icon: IconType) => void;
  onColorChange?: (color: string) => void;
  onIconSelectorOpen?: () => void;
  onIconSelectorClose?: () => void;
  onColorPickerOpen?: () => void;
  onColorPickerClose?: () => void;
}

export function useContainer({
  initialText = '',
  text = '',
  icon = 'none',
  backgroundColor = 'transparent',
  borderStyle = 'dashed',
  editable = false,
  onIconChange,
  onColorChange,
  onIconSelectorOpen,
  onIconSelectorClose,
  onColorPickerOpen,
  onColorPickerClose
}: UseContainerProps) {
  const [innerText, setInnerText] = useState(initialText || text);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconType>(icon);
  const [selectedColor, setSelectedColor] = useState<string>(backgroundColor);
  const [selectedBorderStyle, setSelectedBorderStyle] = useState<string>(borderStyle);
  
  // Actualizar el estado local cuando cambien las props
  useEffect(() => {
    setSelectedIcon(icon);
  }, [icon]);
  
  useEffect(() => {
    setSelectedColor(backgroundColor);
  }, [backgroundColor]);
  
  useEffect(() => {
    setSelectedBorderStyle(borderStyle);
  }, [borderStyle]);
  
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
      if (onIconSelectorOpen) {
        onIconSelectorOpen();
      }
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (editable) {
      e.stopPropagation();
    }
  };
  
  const handleContainerDoubleClick = (e: React.MouseEvent) => {
    if (editable) {
      // Verificar si el evento ocurrió dentro del elemento de texto
      const target = e.target as HTMLElement;
      const isTextElement = 
        target.tagName === 'INPUT' || 
        target.classList.contains('container-text-element') ||
        target.closest('.container-text-element') !== null;
      
      // Solo abrir el selector de color si el doble clic no fue en un elemento de texto
      if (!isTextElement) {
        e.stopPropagation();
        setShowColorPicker(true);
        if (onColorPickerOpen) {
          onColorPickerOpen();
        }
      }
    }
  };

  const handleIconChange = (newIcon: IconType) => {
    setSelectedIcon(newIcon);
    setShowIconSelector(false);
    if (onIconChange) {
      onIconChange(newIcon);
    }
    if (onIconSelectorClose) {
      onIconSelectorClose();
    }
  };

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor);
    setShowColorPicker(false);
    if (onColorChange) {
      onColorChange(newColor);
    }
    if (onColorPickerClose) {
      onColorPickerClose();
    }
  };

  const handleCloseColorPicker = () => {
    setShowColorPicker(false);
    if (onColorPickerClose) {
      onColorPickerClose();
    }
  };

  const handleCloseIconSelector = () => {
    setShowIconSelector(false);
    if (onIconSelectorClose) {
      onIconSelectorClose();
    }
  };

  return {
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
  };
} 