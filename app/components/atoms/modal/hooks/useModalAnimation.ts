import { useState, useEffect } from 'react';

export interface UseModalAnimationProps {
  isOpen: boolean;
  animationDuration?: number;
}

export const useModalAnimation = ({ isOpen, animationDuration = 200 }: UseModalAnimationProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);
    } else if (shouldRender) {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, animationDuration);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDuration]);

  return {
    shouldRender,
    isAnimating,
  };
}; 