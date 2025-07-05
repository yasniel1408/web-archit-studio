import { IconType } from "../icon-selector";

export interface SquareProps {
  className?: string;
  text?: string;
  editable?: boolean;
  initialText?: string;
  icon?: IconType;
  backgroundColor?: string;
  zIndex?: number;
  onIconChange?: (icon: IconType) => void;
  onColorChange?: (color: string, zIndex?: number) => void;
  onColorPickerOpen?: () => void;
  onColorPickerClose?: () => void;
  onIconSelectorOpen?: () => void;
  onIconSelectorClose?: () => void;
  onTextChange?: (text: string) => void;
}

export interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (color: string, zIndex?: number) => void;
  initialColor: string;
  showZIndexControls?: boolean;
  initialZIndex?: number;
}

export const predefinedColors = [
  "#FFFFFF", // Blanco
  "#F8F9FA", // Gris muy claro
  "#E9ECEF", // Gris claro
  "#DEE2E6", // Gris
  "#FFCDD2", // Rojo claro
  "#F8BBD0", // Rosa claro
  "#E1BEE7", // Púrpura claro
  "#D1C4E9", // Violeta claro
  "#C5CAE9", // Índigo claro
  "#BBDEFB", // Azul claro
  "#B3E5FC", // Azul claro oceánico
  "#B2EBF2", // Cian claro
  "#B2DFDB", // Verde azulado claro
  "#C8E6C9", // Verde claro
  "#DCEDC8", // Verde lima claro
  "#F0F4C3", // Amarillo claro
  "#FFF9C4", // Amarillo pastel
  "#FFECB3", // Ámbar claro
  "#FFE0B2", // Naranja claro
  "#FFCCBC", // Naranja profundo claro
];
