import React from "react";

import { buttonBaseClass, getAnimationName } from "../styles";
import { AnimationButtonProps } from "../types";

export const AnimationButton: React.FC<AnimationButtonProps> = ({ animation, onClick }) => {
  return (
    <button onClick={onClick} className={buttonBaseClass}>
      {getAnimationName(animation)}
    </button>
  );
};
