import { ArrowAnimation, ArrowHeadType, ArrowStyle } from "@/app/components/atoms/arrow/types";

export interface ArrowOptionsMenuProps {
  connectionId: string;
  x: number;
  y: number;
  onStyleChange: (id: string, style: ArrowStyle) => void;
  onAnimationChange: (id: string, animation: ArrowAnimation) => void;
  onArrowHeadChange: (id: string, position: "start" | "end", type: ArrowHeadType) => void;
  onClose: () => void;
}

export interface StyleButtonProps {
  style: ArrowStyle;
  onClick: () => void;
}

export interface AnimationButtonProps {
  animation: ArrowAnimation;
  onClick: () => void;
}

export interface ArrowHeadButtonProps {
  arrowHead: ArrowHeadType;
  position: "start" | "end";
  onClick: () => void;
}
