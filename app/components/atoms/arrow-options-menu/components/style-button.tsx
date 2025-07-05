import React from "react";

import { buttonBaseClass, getLineStyleClass } from "../styles";
import { StyleButtonProps } from "../types";

export const StyleButton: React.FC<StyleButtonProps> = ({ style, onClick }) => {
  const lineStyleClass = getLineStyleClass(style);

  return (
    <button onClick={onClick} className={`${buttonBaseClass} flex-1`}>
      <div className={lineStyleClass}></div>
    </button>
  );
};
