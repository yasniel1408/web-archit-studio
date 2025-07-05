import { useEffect, useState } from "react";

import { IconType } from "../../icon-selector";

interface UseQueueProps {
  initialText?: string;
  text?: string;
  icon?: IconType;
  backgroundColor?: string;
  editable?: boolean;
  onIconChange?: (icon: IconType) => void;
  onColorChange?: (color: string, zIndex?: number) => void;
  onIconSelectorOpen?: () => void;
  onIconSelectorClose?: () => void;
  onColorPickerOpen?: () => void;
  onColorPickerClose?: () => void;
  onTextChange?: (text: string) => void;
}

export function useQueue({
  initialText = "",
  text = "",
  icon = "none",
  backgroundColor = "#FFFFFF",
  editable = false,
  onIconChange,
  onColorChange,
  onIconSelectorOpen,
  onIconSelectorClose,
  onColorPickerOpen,
  onColorPickerClose,
  onTextChange,
}: UseQueueProps) {
  const [innerText, setInnerText] = useState(initialText || text);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconType>(icon);
  const [selectedColor, setSelectedColor] = useState<string>(backgroundColor);

  // Actualizar el estado local cuando cambien las props
  useEffect(() => {
    setSelectedIcon(icon);
  }, [icon]);

  useEffect(() => {
    setSelectedColor(backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    // Actualizar el texto interno si cambia la prop text
    if (text && text !== innerText) {
      setInnerText(text);
    }
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setInnerText(newText);

    // Notificar al componente padre sobre el cambio de texto
    if (onTextChange) {
      onTextChange(newText);
    }
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

  const handleQueueClick = (e: React.MouseEvent) => {
    if (editable) {
      e.stopPropagation();
    }
  };

  const handleQueueDoubleClick = (e: React.MouseEvent) => {
    if (editable) {
      // Verificar si el evento ocurrió dentro del elemento de texto
      const target = e.target as HTMLElement;
      const isTextElement =
        target.tagName === "INPUT" ||
        target.classList.contains("queue-text-element") ||
        target.closest(".queue-text-element") !== null;

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

  const handleColorChange = (newColor: string, newZIndex?: number) => {
    setSelectedColor(newColor);
    setShowColorPicker(false);
    if (onColorChange) {
      onColorChange(newColor, newZIndex);
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
    handleTextChange,
    handleInputClick,
    handleIconClick,
    handleQueueClick,
    handleQueueDoubleClick,
    handleIconChange,
    handleColorChange,
    handleCloseColorPicker,
    handleCloseIconSelector,
  };
}
