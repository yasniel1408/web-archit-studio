import React from 'react';
import { diagramCanvasStyles } from '../styles';

type DebugPanelProps = {
  messages: string[];
};

/**
 * Componente que muestra mensajes de depuración
 */
export function DebugPanel({ messages }: DebugPanelProps) {
  if (messages.length === 0) return null;
  
  return (
    <div className={diagramCanvasStyles.debugPanel}>
      {messages.map((msg, i) => (
        <div key={i} className={diagramCanvasStyles.debugMessage}>{msg}</div>
      ))}
    </div>
  );
} 