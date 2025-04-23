import { useMemo } from 'react';

interface UseMenuPositionProps {
  x: number;
  y: number;
}

/**
 * Hook para calcular la posición del menú evitando que se salga de los límites de la pantalla
 */
export const useMenuPosition = ({ x, y }: UseMenuPositionProps) => {
  // Calculamos la posición para que el menú no se salga de la pantalla
  const position = useMemo(() => {
    const menuWidth = 288; // 72px * 4 (w-72)
    const menuHeight = 400; // Altura estimada del menú

    // Si estamos en el navegador, ajustar según el tamaño de la ventana
    if (typeof window !== 'undefined') {
      const menuX = Math.min(x, window.innerWidth - menuWidth);
      const menuY = Math.min(y, window.innerHeight - menuHeight);
      
      return {
        left: `${menuX}px`,
        top: `${menuY}px`
      };
    }
    
    // Fallback para SSR
    return {
      left: `${x}px`,
      top: `${y}px`
    };
  }, [x, y]);

  return position;
}; 