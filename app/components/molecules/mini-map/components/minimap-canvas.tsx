import React from 'react';
import { miniMapStyles } from '../styles';
import { EmptyMinimapMessage } from './empty-minimap-message';

type MinimapCanvasProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
  isEmpty: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
};

/**
 * Componente que renderiza el canvas del minimapa
 */
export function MinimapCanvas({
  canvasRef,
  width,
  height,
  isEmpty,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave
}: MinimapCanvasProps) {
  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className={miniMapStyles.canvas}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      />
      {isEmpty && <EmptyMinimapMessage />}
    </div>
  );
} 