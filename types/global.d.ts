// Global type definitions for ArchitStudio

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_APP_NAME: string;
      NEXT_PUBLIC_APP_VERSION: string;
      NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
      NEXT_PUBLIC_MIXPANEL_TOKEN?: string;
      NEXT_PUBLIC_ENABLE_COLLABORATION?: string;
      NEXT_PUBLIC_ENABLE_EXPORT?: string;
    }
  }
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Diagram types
export interface DiagramNode {
  id: string;
  type: 'aws' | 'gcp' | 'c4' | 'custom';
  position: { x: number; y: number };
  size: { width: number; height: number };
  data: Record<string, unknown>;
  label?: string;
}

export interface DiagramConnection {
  id: string;
  source: string;
  target: string;
  type: 'solid' | 'dashed' | 'dotted';
  label?: string;
  animated?: boolean;
}

export interface Diagram {
  id: string;
  name: string;
  nodes: DiagramNode[];
  connections: DiagramConnection[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export {}; 