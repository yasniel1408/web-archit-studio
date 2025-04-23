"use client";

import React from 'react';
import { ArrowStyle, ArrowAnimation, ArrowHeadType } from '@/app/components/atoms/arrow/types';
import { 
  backdropClass, 
  menuContainerClass, 
  menuHeaderClass, 
  menuTitleClass,
  closeButtonClass,
  buttonGroupClass,
  buttonGridClass,
  sectionContainerClass
} from './styles';
import { useMenuPosition } from './hooks/useMenuPosition';
import { StyleButton } from './components/style-button';
import { AnimationButton } from './components/animation-button';
import { ArrowHeadButton } from './components/arrow-head-button';
import { MenuSection } from './components/menu-section';
import { ArrowOptionsMenuProps } from './types';

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
  const animationOptions: ArrowAnimation[] = ['none', 'pulse', 'flow', 'dash', 'traveling-dot', 'traveling-dot-fast', 'traveling-dot-fastest'];
  const arrowHeadOptions: ArrowHeadType[] = ['none', 'arrow', 'circle', 'diamond'];
  
  // Calculamos la posición para que el menú no se salga de la pantalla
  const menuPosition = useMenuPosition({ x, y });
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className={backdropClass}
      onClick={handleBackdropClick}
    >
      <div 
        className={menuContainerClass}
        style={menuPosition}
      >
        <div className={menuHeaderClass}>
          <h3 className={menuTitleClass}>Opciones de conexión</h3>
          <button 
            onClick={onClose}
            className={closeButtonClass}
          >
            ✕
          </button>
        </div>
        
        <div className={sectionContainerClass}>
          {/* Estilos de línea */}
          <MenuSection title="Estilo de línea">
            <div className={buttonGroupClass}>
              {styleOptions.map(style => (
                <StyleButton 
                  key={style}
                  style={style}
                  onClick={() => onStyleChange(connectionId, style)}
                />
              ))}
            </div>
          </MenuSection>
          
          {/* Animaciones */}
          <MenuSection title="Animación">
            <div className={buttonGridClass}>
              {animationOptions.map(anim => (
                <AnimationButton 
                  key={anim}
                  animation={anim}
                  onClick={() => onAnimationChange(connectionId, anim)}
                />
              ))}
            </div>
          </MenuSection>
          
          {/* Flecha inicial */}
          <MenuSection title="Flecha inicial">
            <div className={buttonGridClass}>
              {arrowHeadOptions.map(arrow => (
                <ArrowHeadButton 
                  key={`start-${arrow}`}
                  arrowHead={arrow}
                  position="start"
                  onClick={() => onArrowHeadChange(connectionId, 'start', arrow)}
                />
              ))}
            </div>
          </MenuSection>
          
          {/* Flecha final */}
          <MenuSection title="Flecha final">
            <div className={buttonGridClass}>
              {arrowHeadOptions.map(arrow => (
                <ArrowHeadButton 
                  key={`end-${arrow}`}
                  arrowHead={arrow}
                  position="end"
                  onClick={() => onArrowHeadChange(connectionId, 'end', arrow)}
                />
              ))}
            </div>
          </MenuSection>
        </div>
      </div>
    </div>
  );
}
