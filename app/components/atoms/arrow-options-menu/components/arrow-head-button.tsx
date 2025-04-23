import React from 'react';
import { ArrowHeadButtonProps } from '../types';
import { arrowHeadButtonClass, getArrowHeadSymbol } from '../styles';

export const ArrowHeadButton: React.FC<ArrowHeadButtonProps> = ({ arrowHead, position, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={arrowHeadButtonClass}
    >
      {getArrowHeadSymbol(arrowHead, position)}
    </button>
  );
}; 