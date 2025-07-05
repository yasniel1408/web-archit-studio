import { IconType } from "../icon-selector";

export interface ContainerProps {
  className?: string;
  text?: string;
  editable?: boolean;
  initialText?: string;
  icon?: IconType;
  backgroundColor?: string;
  borderStyle?: "solid" | "dashed" | "dotted" | "double" | "none";
  zIndex?: number;
  onIconChange?: (icon: IconType) => void;
  onColorChange?: (color: string, zIndex?: number) => void;
  onColorPickerOpen?: () => void;
  onColorPickerClose?: () => void;
  onIconSelectorOpen?: () => void;
  onIconSelectorClose?: () => void;
  onTextChange?: (text: string) => void;
}
