import { IconType } from '../icon-selector';

export interface ContainerProps {
  className?: string;
  text?: string;
  editable?: boolean;
  initialText?: string;
  icon?: IconType;
  backgroundColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  onIconChange?: (icon: IconType) => void;
  onColorChange?: (color: string) => void;
  onColorPickerOpen?: () => void;
  onColorPickerClose?: () => void;
  onIconSelectorOpen?: () => void;
  onIconSelectorClose?: () => void;
} 