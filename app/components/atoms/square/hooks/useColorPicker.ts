import { useState } from 'react';

interface UseColorPickerProps {
  initialColor: string;
  onSelect: (color: string, zIndex?: number) => void;
  onClose: () => void;
  showZIndexControls?: boolean;
  initialZIndex?: number;
}

export function useColorPicker({
  initialColor,
  onSelect,
  onClose,
  showZIndexControls = false,
  initialZIndex = 0
}: UseColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState<string>(initialColor || '#FFFFFF');
  const [zIndex, setZIndex] = useState<number>(initialZIndex);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };
  
  const handleZIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setZIndex(isNaN(value) ? 0 : value);
  };
  
  const selectColor = (color: string) => {
    setSelectedColor(color);
  };
  
  const applyColor = () => {
    if (showZIndexControls) {
      onSelect(selectedColor, zIndex);
    } else {
      onSelect(selectedColor);
    }
    onClose();
  };
  
  return {
    selectedColor,
    zIndex,
    handleColorChange,
    handleTextChange,
    handleZIndexChange,
    selectColor,
    applyColor
  };
} 