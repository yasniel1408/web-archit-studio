import React from 'react';
import { miniMapStyles } from '../styles';

type MinimapHeaderProps = {
  isEmpty: boolean;
};

/**
 * Componente para el encabezado del minimapa
 */
export function MinimapHeader({ isEmpty }: MinimapHeaderProps) {
  return (
    <div className={miniMapStyles.header}>
      <span className={miniMapStyles.headerTitle}>Mini-Mapa</span>
      {isEmpty && (
        <span className={miniMapStyles.emptyText}>(Sin contenido)</span>
      )}
    </div>
  );
} 