import React from 'react';
import { StyleButtonProps } from '../types';
import { getLineStyleClass, buttonBaseClass } from '../styles';

export const StyleButton: React.FC<StyleButtonProps> = ({ style, onClick }) => {
  const lineStyleClass = getLineStyleClass(style);
  
  return (
    <button 
      onClick={onClick}
      className={`${buttonBaseClass} flex-1`}
    >
      <div className={lineStyleClass}></div>
    </button>
  );
}; 