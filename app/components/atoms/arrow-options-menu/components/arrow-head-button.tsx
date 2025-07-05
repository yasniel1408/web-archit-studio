import React from "react";

import { arrowHeadButtonClass, getArrowHeadSymbol } from "../styles";
import { ArrowHeadButtonProps } from "../types";

export const ArrowHeadButton: React.FC<ArrowHeadButtonProps> = ({
  arrowHead,
  position,
  onClick,
}) => {
  return (
    <button onClick={onClick} className={arrowHeadButtonClass}>
      {getArrowHeadSymbol(arrowHead, position)}
    </button>
  );
};
