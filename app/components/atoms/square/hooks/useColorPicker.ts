import { useState } from 'react';

interface UseColorPickerProps {
  initialColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

export function useColorPicker({
  initialColor,
  onSelect,
  onClose
}: UseColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState<string>(initialColor || '#FFFFFF');
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };
  
  const selectColor = (color: string) => {
    setSelectedColor(color);
  };
  
  const applyColor = () => {
    onSelect(selectedColor);
    onClose();
  };
  
  return {
    selectedColor,
    handleColorChange,
    handleTextChange,
    selectColor,
    applyColor
  };
} 