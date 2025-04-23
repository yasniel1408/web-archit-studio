import React from 'react';
import { ArrowAnimation, ArrowHeadType, ArrowStyle } from '../types';

interface ArrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStyle: ArrowStyle;
  onStyleChange: (style: ArrowStyle) => void;
  currentAnimation: ArrowAnimation;
  onAnimationChange: (animation: ArrowAnimation) => void;
  startArrowHead: ArrowHeadType;
  endArrowHead: ArrowHeadType;
  onArrowHeadChange: (position: 'start' | 'end', type: ArrowHeadType) => void;
  onDelete: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
}

export const ArrowModal: React.FC<ArrowModalProps> = ({
  isOpen,
  onClose,
  currentStyle,
  onStyleChange,
  currentAnimation,
  onAnimationChange,
  startArrowHead,
  endArrowHead,
  onArrowHeadChange,
  onDelete,
  modalRef
}) => {
  if (!isOpen) return null;

  const styles: ArrowStyle[] = ['solid', 'dashed', 'dotted'];
  const animations: ArrowAnimation[] = [
    'none',
    'pulse',
    'flow',
    'dash',
    'traveling-dot',
    'traveling-dot-fast',
    'traveling-dot-fastest'
  ];
  const arrowHeadTypes: ArrowHeadType[] = ['none', 'arrow', 'circle', 'diamond'];

  return (
    <div
      ref={modalRef}
      className="fixed bg-white rounded-lg shadow-lg p-4 w-64 z-50"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <div className="flex justify-between mb-3">
        <h3 className="text-sm font-medium">Opciones de Flecha</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="mb-3">
        <h4 className="text-xs font-medium mb-2">Estilo de línea</h4>
        <div className="flex space-x-2">
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => onStyleChange(style)}
              className={`px-2 py-1 text-xs rounded ${
                currentStyle === style
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {style === 'solid' ? 'Sólido' : 
               style === 'dashed' ? 'Guiones' : 'Puntos'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <h4 className="text-xs font-medium mb-2">Animación</h4>
        <div className="grid grid-cols-2 gap-2">
          {animations.map((animation) => (
            <button
              key={animation}
              onClick={() => onAnimationChange(animation)}
              className={`px-2 py-1 text-xs rounded ${
                currentAnimation === animation
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {animation === 'none' ? 'Ninguna' :
               animation === 'pulse' ? 'Pulso' :
               animation === 'flow' ? 'Flujo' :
               animation === 'dash' ? 'Guiones' :
               animation === 'traveling-dot' ? 'Punto' :
               animation === 'traveling-dot-fast' ? 'Punto rápido' : 'Punto veloz'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <h4 className="text-xs font-medium mb-2">Puntas de flecha</h4>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <span className="text-xs w-16">Inicio:</span>
            <div className="flex space-x-1">
              {arrowHeadTypes.map((type) => (
                <button
                  key={`start-${type}`}
                  onClick={() => onArrowHeadChange('start', type)}
                  className={`px-2 py-1 text-xs rounded ${
                    startArrowHead === type
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {type === 'none' ? 'Ninguna' :
                   type === 'arrow' ? 'Flecha' :
                   type === 'circle' ? 'Círculo' : 'Diamante'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-xs w-16">Fin:</span>
            <div className="flex space-x-1">
              {arrowHeadTypes.map((type) => (
                <button
                  key={`end-${type}`}
                  onClick={() => onArrowHeadChange('end', type)}
                  className={`px-2 py-1 text-xs rounded ${
                    endArrowHead === type
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {type === 'none' ? 'Ninguna' :
                   type === 'arrow' ? 'Flecha' :
                   type === 'circle' ? 'Círculo' : 'Diamante'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}; 