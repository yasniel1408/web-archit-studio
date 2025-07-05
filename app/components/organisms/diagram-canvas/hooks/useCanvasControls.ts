import { useCallback, useEffect, useRef, useState } from "react";

import { ViewportType } from "../types";

export function useCanvasControls() {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);
  const [debug, setDebug] = useState<string[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<HTMLDivElement>(null);

  // Función para registrar mensajes de debug
  const logDebug = useCallback((message: string) => {
    console.log(message);
    setDebug((prev) => {
      const newDebug = [...prev, `${new Date().toISOString().substring(11, 19)}: ${message}`];
      if (newDebug.length > 5) {
        return newDebug.slice(newDebug.length - 5);
      }
      return newDebug;
    });
  }, []);

  // Manejar eventos de teclado para detectar la tecla espacio
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
        logDebug("Modo navegación activado (espacio)");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsSpacePressed(false);
        logDebug("Modo navegación desactivado");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [logDebug]);

  // Manejar zoom y navegación con rueda del ratón o gestos de trackpad
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Identificar si se trata de un gesto de zoom (Ctrl+rueda o gesto de pellizco en trackpad)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        const delta = e.deltaY < 0 ? 0.05 : -0.05; // Reducir sensibilidad a la mitad
        const newScale = Math.min(Math.max(scale + delta, 0.25), 3);

        // Obtener posición del cursor relativa al canvas
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;

        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;

        // Ajustar posición para mantener el punto bajo el cursor
        const newPosition = {
          x: position.x - ((mouseX - position.x) * delta) / scale,
          y: position.y - ((mouseY - position.y) * delta) / scale,
        };

        setScale(newScale);
        setPosition(newPosition);
        logDebug(`Zoom: ${Math.round(newScale * 100)}%`);
      }
      // Navegación con dos dedos en trackpad (sin modificadores)
      else {
        e.preventDefault();

        // Mover el canvas basado en el desplazamiento de la rueda
        // En Mac, los gestos de dos dedos generan eventos wheelX y wheelY
        const newPosition = {
          x: position.x - e.deltaX / scale,
          y: position.y - e.deltaY / scale,
        };

        setPosition(newPosition);
      }
    };

    const currentCanvas = canvasRef.current;
    if (currentCanvas) {
      currentCanvas.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (currentCanvas) {
        currentCanvas.removeEventListener("wheel", handleWheel);
      }
    };
  }, [scale, position, logDebug]);

  // Iniciar arrastre del canvas (pan)
  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Solo activar pan si hacemos clic con botón central, tecla Alt, o espacio presionado
      if (e.button === 1 || e.altKey || isSpacePressed) {
        e.preventDefault();
        setIsDraggingCanvas(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      }
    },
    [isSpacePressed, position]
  );

  // Mover el canvas mientras se arrastra
  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDraggingCanvas && dragStart) {
        const newPosition = {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        };
        setPosition(newPosition);
      }
    },
    [isDraggingCanvas, dragStart]
  );

  // Finalizar arrastre del canvas
  const handleCanvasMouseUp = useCallback(() => {
    if (isDraggingCanvas) {
      setIsDraggingCanvas(false);
      setDragStart(null);
    }
  }, [isDraggingCanvas]);

  // Resetear zoom y posición
  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    logDebug("Vista reseteada");
  }, [logDebug]);

  // Zoom in
  const zoomIn = useCallback(() => {
    const newScale = Math.min(scale + 0.05, 3); // Reducir step de zoom de botones
    setScale(newScale);
    logDebug(`Zoom: ${Math.round(newScale * 100)}%`);
  }, [scale, logDebug]);

  // Zoom out
  const zoomOut = useCallback(() => {
    const newScale = Math.max(scale - 0.05, 0.25); // Reducir step de zoom de botones
    setScale(newScale);
    logDebug(`Zoom: ${Math.round(newScale * 100)}%`);
  }, [scale, logDebug]);

  // Manejar eventos de navegación desde el minimapa
  useEffect(() => {
    const handleMinimapNavigation = (e: CustomEvent) => {
      const { x, y } = e.detail;
      // Aplicar directamente la posición calculada desde el minimapa
      setPosition({ x, y });
      logDebug(`Navegación minimapa: (${Math.round(x)}, ${Math.round(y)})`);
    };

    window.addEventListener("minimap-navigation", handleMinimapNavigation as EventListener);

    return () => {
      window.removeEventListener("minimap-navigation", handleMinimapNavigation as EventListener);
    };
  }, [logDebug]);

  // Establecer el viewport con valores específicos (útil para cargar diagramas guardados)
  const setViewport = useCallback((viewport: ViewportType) => {
    setScale(viewport.scale);
    setPosition(viewport.position);
  }, []);

  // Obtener el estado actual del viewport (útil para guardar diagramas)
  const getViewport = useCallback((): ViewportType => {
    return {
      scale,
      position,
    };
  }, [scale, position]);

  return {
    canvasRef,
    transformRef,
    scale,
    position,
    isDraggingCanvas,
    isSpacePressed,
    debug,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    resetView,
    zoomIn,
    zoomOut,
    setViewport,
    getViewport,
    logDebug,
    dragStart,
    setPosition,
  };
}
