import { IconType } from '@/app/components/atoms/icon-selector/types';

export type NodeType = {
  id: string;
  position: { x: number; y: number };
  text: string;
  type: string;
  size: { width: number; height: number };
  icon?: IconType;
  backgroundColor?: string;
};

export type ConnectionPosition = 'top' | 'right' | 'bottom' | 'left';

export type ConnectionType = {
  id: string;
  sourceId: string;
  targetId: string;
  sourcePosition: ConnectionPosition;
  targetPosition: ConnectionPosition;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  style?: 'solid' | 'dashed' | 'dotted';
  animation?: 'none' | 'pulse' | 'flow' | 'dash' | 'traveling-dot' | 'traveling-dot-fast' | 'traveling-dot-fastest';
  startArrowHead?: 'none' | 'arrow' | 'circle' | 'diamond';
  endArrowHead?: 'none' | 'arrow' | 'circle' | 'diamond';
  color?: string;
  strokeWidth?: number;
  isSyncEnabled?: boolean;
};

export type ActiveConnectionType = {
  sourceId: string;
  sourcePosition: ConnectionPosition;
  sourceX: number;
  sourceY: number;
  currentX: number;
  currentY: number;
};

export type ConnectionPropertiesType = {
  style?: 'solid' | 'dashed' | 'dotted';
  animation?: 'none' | 'pulse' | 'flow' | 'dash' | 'traveling-dot' | 'traveling-dot-fast' | 'traveling-dot-fastest';
  startArrowHead?: 'none' | 'arrow' | 'circle' | 'diamond';
  endArrowHead?: 'none' | 'arrow' | 'circle' | 'diamond';
  color?: string;
  strokeWidth?: number;
};

export type ViewportType = {
  scale: number;
  position: { x: number, y: number };
};

export type TemplateType = {
  id: string;
  name: string;
  description: string;
  image: string;
  version: string;
  nodes: any[];
  connections: any[];
  viewport?: ViewportType;
  metadata?: {
    exportedAt: string;
    nodeCount: number;
    connectionCount: number;
  };
};

export type DiagramDataType = {
  savedNodes: NodeType[];
  savedConnections: ConnectionType[];
  savedViewport: ViewportType;
}; 