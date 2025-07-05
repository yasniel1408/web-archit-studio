import React from "react";

import { miniMapStyles } from "../styles";

/**
 * Componente que muestra un mensaje cuando no hay contenido en el minimapa
 */
export function EmptyMinimapMessage() {
  return (
    <div className={miniMapStyles.emptyMessageContainer}>
      Añade nodos para
      <br />
      activar el minimapa
    </div>
  );
}
