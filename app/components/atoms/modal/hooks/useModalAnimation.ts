import { useEffect, useState } from "react";

export interface UseModalAnimationProps {
  isOpen: boolean;
  animationDuration?: number;
}

export const useModalAnimation = ({ isOpen, animationDuration = 200 }: UseModalAnimationProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);
    } else if (shouldRender) {
      setIsAnimating(false);
      timer = setTimeout(() => {
        setShouldRender(false);
      }, animationDuration);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen, animationDuration, shouldRender]);

  return {
    shouldRender,
    isAnimating,
  };
};
