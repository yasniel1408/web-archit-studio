import { IconType } from "../icon-selector";

export interface QueueProps {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  icon?: IconType;
  innerText?: string;
  speed?: "slow" | "medium" | "fast";
  maxMessages?: number;
  className?: string;
  style?: React.CSSProperties;
  editable?: boolean;
  backgroundColor?: string;
  zIndex?: number;
  onSelect?: (id: string) => void;
  onDoubleClick?: (id: string) => void;
  onDelete?: (id: string) => void;
  onTextChange?: (id: string, text: string) => void;
  onColorChange?: (id: string, color: string) => void;
  onSpeedChange?: (id: string, speed: "slow" | "medium" | "fast") => void;
  onMaxMessagesChange?: (id: string, maxMessages: number) => void;
  onIconChange?: (icon: IconType) => void;
  onColorPickerOpen?: () => void;
  onColorPickerClose?: () => void;
  onIconSelectorOpen?: () => void;
  onIconSelectorClose?: () => void;
  isSelected?: boolean;
  isAnimating?: boolean;
  showControls?: boolean;
  isDragging?: boolean;
  isConnectable?: boolean;
  connectionPoints?: Array<{
    id: string;
    position: "top" | "bottom" | "left" | "right";
    isConnected: boolean;
  }>;
}

export interface QueueAnimationProps {
  isActive?: boolean;
  speed?: "slow" | "medium" | "fast";
  messageColor?: string;
}

export interface QueueMessage {
  id: string;
  position: number;
  size: "small" | "medium" | "large";
  color: string;
  speed: number;
  state?: "entering" | "queued" | "processing" | "exiting";
  opacity?: number;
  scale?: number;
  rotation?: number;
}

export const queueMessageColors = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#84CC16", // Lime
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#F43F5E", // Rose
  "#14B8A6", // Teal
] as const;

export const predefinedQueueColors = [
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
