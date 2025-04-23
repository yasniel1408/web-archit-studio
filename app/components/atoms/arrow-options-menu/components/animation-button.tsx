import React from 'react';
import { AnimationButtonProps } from '../types';
import { buttonBaseClass, getAnimationName } from '../styles';

export const AnimationButton: React.FC<AnimationButtonProps> = ({ animation, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={buttonBaseClass}
    >
      {getAnimationName(animation)}
    </button>
  );
}; 