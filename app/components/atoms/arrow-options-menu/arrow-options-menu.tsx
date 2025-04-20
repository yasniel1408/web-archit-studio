"use client";

import React from 'react';
import { ArrowStyle, ArrowAnimation, ArrowHeadType } from '@/app/components/atoms/arrow/arrow';

interface ArrowOptionsMenuProps {
  connectionId: string;
  x: number;
  y: number;
  onStyleChange: (id: string, style: ArrowStyle) => void;
  onAnimationChange: (id: string, animation: ArrowAnimation) => void;
  onArrowHeadChange: (id: string, position: 'start' | 'end', type: ArrowHeadType) => void;
  onClose: () => void;
}

export function ArrowOptionsMenu({
  connectionId,
  x,
  y,
  onStyleChange,
  onAnimationChange,
  onArrowHeadChange,
  onClose
}: ArrowOptionsMenuProps) {
  const styleOptions: ArrowStyle[] = ['solid', 'dashed', 'dotted'];
  const animationOptions: ArrowAnimation[] = ['none', 'pulse', 'flow', 'dash'];
  const arrowHeadOptions: ArrowHeadType[] = ['none', 'arrow', 'circle', 'diamond'];
  
  // Para evitar que el menú se salga de la pantalla
  const menuX = Math.min(x, window.innerWidth - 300);
  const menuY = Math.min(y, window.innerHeight - 400);
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-4 w-72"
        style={{
          position: 'absolute',
          left: `${menuX}px`,
          top: `${menuY}px`
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Opciones de conexión</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Estilos de línea */}
          <div>
            <h4 className="font-medium mb-2">Estilo de línea</h4>
            <div className="flex space-x-2">
              {styleOptions.map(style => (
                <button 
                  key={style}
                  onClick={() => onStyleChange(connectionId, style)}
                  className="flex-1 py-2 px-2 border rounded hover:bg-gray-100"
                >
                  <div className={`w-full h-0.5 bg-black ${
                    style === 'dashed' ? 'border-dashed border-t border-black h-0' : 
                    style === 'dotted' ? 'border-dotted border-t border-black h-0' : ''
                  }`}></div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Animaciones */}
          <div>
            <h4 className="font-medium mb-2">Animación</h4>
            <div className="grid grid-cols-2 gap-2">
              {animationOptions.map(anim => (
                <button 
                  key={anim}
                  onClick={() => onAnimationChange(connectionId, anim)}
                  className="py-2 px-3 border rounded hover:bg-gray-100"
                >
                  {anim === 'none' ? 'Ninguna' : 
                   anim === 'pulse' ? 'Pulso' : 
                   anim === 'flow' ? 'Flujo' : 'Discontinua'}
                </button>
              ))}
            </div>
          </div>
          
          {/* Flechas */}
          <div>
            <h4 className="font-medium mb-2">Flecha inicial</h4>
            <div className="grid grid-cols-2 gap-2">
              {arrowHeadOptions.map(arrow => (
                <button 
                  key={`start-${arrow}`}
                  onClick={() => onArrowHeadChange(connectionId, 'start', arrow)}
                  className="py-2 px-3 border rounded hover:bg-gray-100 flex items-center justify-center"
                >
                  {arrow === 'none' ? 'Ninguna' : 
                   arrow === 'arrow' ? '←' : 
                   arrow === 'circle' ? '◯' : '◇'}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Flecha final</h4>
            <div className="grid grid-cols-2 gap-2">
              {arrowHeadOptions.map(arrow => (
                <button 
                  key={`end-${arrow}`}
                  onClick={() => onArrowHeadChange(connectionId, 'end', arrow)}
                  className="py-2 px-3 border rounded hover:bg-gray-100 flex items-center justify-center"
                >
                  {arrow === 'none' ? 'Ninguna' : 
                   arrow === 'arrow' ? '→' : 
                   arrow === 'circle' ? '◯' : '◇'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
