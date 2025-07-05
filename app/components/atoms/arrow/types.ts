import { ConnectionPosition } from "@/app/components/atoms/connection-point/connection-point";

export type ArrowStyle = "solid" | "dashed" | "dotted";
export type ArrowAnimation =
  | "none"
  | "pulse"
  | "flow"
  | "dash"
  | "traveling-dot"
  | "traveling-dot-fast"
  | "traveling-dot-fastest";
export type ArrowHeadType = "none" | "arrow" | "circle" | "diamond";

export interface ArrowProps {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startPosition: ConnectionPosition;
  endPosition: ConnectionPosition;
  startArrowHead?: ArrowHeadType;
  endArrowHead?: ArrowHeadType;
  style?: ArrowStyle;
  animation?: ArrowAnimation;
  roundTrip?: boolean;
  color?: string;
  strokeWidth?: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onPropertiesChange?: (properties: {
    style?: ArrowStyle;
    animation?: ArrowAnimation;
    startArrowHead?: ArrowHeadType;
    endArrowHead?: ArrowHeadType;
    roundTrip?: boolean;
    color?: string;
    strokeWidth?: number;
  }) => void;
  onDelete?: (id: string) => void;
}

export interface PointCoordinates {
  x: number;
  y: number;
}

export interface BezierControlPoints {
  controlPoint1X: number;
  controlPoint1Y: number;
  controlPoint2X: number;
  controlPoint2Y: number;
}

export interface ArrowHeadProps {
  position: ConnectionPosition;
  x: number;
  y: number;
  isStart: boolean;
  type: ArrowHeadType;
  color: string;
  animation: ArrowAnimation;
  id: string;
}
