import { useCallback } from 'react';
import { IconType } from '@/app/components/atoms/icon-selector/types';

type DragAndDropConfig = {
  canvasRef: React.RefObject<HTMLDivElement>;
  scale: number;
  position: { x: number; y: number };
  addNode: (id: string, type: string, text: string, position: { x: number; y: number }, size: { width: number; height: number }, icon?: IconType) => void;
  logDebug: (message: string) => void;
};

/**
 * Hook para manejar la funcionalidad de arrastrar y soltar elementos al canvas
 */
export function useDragAndDrop({
  canvasRef,
  scale,
  position,
  addNode,
  logDebug
}: DragAndDropConfig) {
  
  /**
   * Previene el comportamiento predeterminado y establece el efecto de copia
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    logDebug("Evento dragOver en el canvas");
  }, [logDebug]);

  /**
   * Maneja cuando se suelta un componente en el canvas
   */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    logDebug("Evento drop en el canvas");
    
    try {
      let data;
      let parsedData;
      
      // Intentar obtener datos como texto plano
      if (e.dataTransfer.types.includes('text/plain')) {
        data = e.dataTransfer.getData('text/plain');
        logDebug(`Datos obtenidos de text/plain: ${data}`);
        
        if (data) {
          try {
            parsedData = JSON.parse(data);
            if (parsedData && parsedData.id && parsedData.type) {
              logDebug(`Datos válidos en formato JSON: ${data}`);
              addNodeToCanvas(parsedData.id, parsedData.type, parsedData.text || "", e);
              return;
            }
          } catch (jsonError) {
            console.warn("Error al parsear JSON:", jsonError);
            // Si no es JSON válido, podría ser un simple ID
            if (typeof data === 'string' && data.trim()) {
              const id = `${data.trim()}-${Date.now()}`;
              logDebug(`Añadiendo nodo con ID generado: ${id}`);
              addNodeToCanvas(id, 'square', data.trim(), e);
              return;
            }
          }
        }
      }
      
      // Si no se pudo procesar como texto plano, verificar otros formatos
      const availableTypes = e.dataTransfer.types;
      logDebug(`Tipos disponibles en el evento drop: ${availableTypes.join(', ')}`);
      
      // Último recurso: crear un nodo genérico
      const genericId = `node-${Date.now()}`;
      logDebug(`Creando nodo genérico: ${genericId}`);
      addNodeToCanvas(genericId, 'square', 'Nuevo nodo', e);
      
    } catch (error) {
      console.error('Error al procesar evento drop:', error);
      logDebug(`Error en el evento drop: ${error}`);
    }
  }, [logDebug, addNode]);

  /**
   * Agregar nodo al canvas cuando se arrastra un componente
   */
  const addNodeToCanvas = useCallback((id: string, type: string, text: string = "", e: React.DragEvent) => {
    // Calcular la posición correcta en el canvas considerando el zoom y desplazamiento
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    // Calcular posición relativa
    const relativeX = e.clientX - canvasRect.left;
    const relativeY = e.clientY - canvasRect.top;
    
    // Convertir coordenadas de pantalla a coordenadas del canvas
    // En esta aplicación, position representa el desplazamiento del canvas que se aplica
    // después del zoom, por lo que la fórmula correcta es:
    const dropX = relativeX / scale - position.x;
    const dropY = relativeY / scale - position.y;
    
    logDebug(`Posición de drop: clientX=${e.clientX}, clientY=${e.clientY}`);
    logDebug(`Canvas rect: left=${canvasRect.left}, top=${canvasRect.top}`);
    logDebug(`Posición relativa al canvas: ${relativeX}, ${relativeY}`);
    logDebug(`Escala: ${scale}, Posición canvas: ${position.x}, ${position.y}`);
    logDebug(`Posición final calculada: ${dropX}, ${dropY}`);
    
    // Extraer tamaño del tipo si se especifica (ej: "square size:200x150")
    let size = { width: 220, height: 120 }; // Tamaño predeterminado
    const sizeMatch = type.match(/size:(\d+)x(\d+)/);
    
    if (sizeMatch) {
      size = {
        width: parseInt(sizeMatch[1], 10),
        height: parseInt(sizeMatch[2], 10)
      };
      // Limpiar el tipo
      type = type.replace(/\s*size:\d+x\d+/, '');
    }
    
    // Extraer icono si se especifica (ej: "square icon:database")
    let icon: IconType | undefined = undefined;
    const iconMatch = type.match(/icon:(\w+)/);
    
    if (iconMatch) {
      icon = iconMatch[1] as IconType;
      // Limpiar el tipo
      type = type.replace(/\s*icon:\w+/, '');
    }
    
    // Asegurar que el tipo incluya el tamaño para que se conserve al guardar/cargar
    const finalType = `${type} size:${size.width}x${size.height}`;
    
    // Crear el nuevo nodo
    addNode(id, finalType, text, { x: dropX, y: dropY }, size, icon);
    
    logDebug(`Nodo añadido: ${id} (${finalType}) en posición ${Math.round(dropX)},${Math.round(dropY)}`);
  }, [canvasRef, scale, position, addNode, logDebug]);

  return {
    handleDragOver,
    handleDrop
  };
} 