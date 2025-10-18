import { useCallback } from "react";

import { IconType } from "@/app/components/atoms/icon-selector/types";

import { NodeType } from "../types";

type DragAndDropConfig = {
  canvasRef: React.RefObject<HTMLDivElement>;
  scale: number;
  position: { x: number; y: number };
  addNode: (
    id: string,
    type: string,
    text: string,
    position: { x: number; y: number },
    size: { width: number; height: number },
    icon?: IconType
  ) => NodeType;
  onNodePropertiesChange?: (
    nodeId: string,
    properties: {
      icon?: IconType;
      backgroundColor?: string;
      speed?: "slow" | "medium" | "fast";
      maxMessages?: number;
      text?: string;
    }
  ) => void;
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
  onNodePropertiesChange,
  logDebug,
}: DragAndDropConfig) {
  /**
   * Agregar nodo al canvas cuando se arrastra un componente
   */
  const addNodeToCanvas = useCallback(
    (id: string, type: string, text: string = "", e: React.DragEvent) => {
      // Calcular la posición correcta en el canvas considerando el zoom y desplazamiento
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      // Calcular posición relativa al canvas
      const relativeX = e.clientX - canvasRect.left;
      const relativeY = e.clientY - canvasRect.top;

      // Convertir coordenadas de pantalla a coordenadas del canvas
      // La transformación CSS es: scale(scale) translate(position.x, position.y)
      // Para invertir esta transformación:
      // 1. Primero dividir por la escala para deshacer el scale
      // 2. Luego restar la traslación para deshacer el translate
      let dropX = relativeX / scale - position.x;
      let dropY = relativeY / scale - position.y;

      // Ajuste experimental: centrar el elemento en el cursor
      // Restar la mitad del tamaño del elemento para que aparezca centrado
      const elementWidth = type.includes("container") ? 400 : 220;
      const elementHeight = type.includes("container") ? 300 : 120;
      dropX -= elementWidth / 2;
      dropY -= elementHeight / 2;

      logDebug(`🎯 DROP EVENT DETAILS:`);
      logDebug(`  Mouse: (${e.clientX}, ${e.clientY})`);
      logDebug(
        `  Canvas rect: (${canvasRect.left}, ${canvasRect.top}) ${canvasRect.width}x${canvasRect.height}`
      );
      logDebug(`  Relative to canvas: (${relativeX}, ${relativeY})`);
      logDebug(`  Scale: ${scale}, Canvas position: (${position.x}, ${position.y})`);
      logDebug(`  Calculated drop position: (${dropX}, ${dropY})`);

      // Agregar información adicional para debugging
      const transformElement = canvasRef.current?.querySelector(
        "[data-diagram-transform]"
      ) as HTMLElement;
      if (transformElement) {
        const transformRect = transformElement.getBoundingClientRect();
        const transformRelativeX = e.clientX - transformRect.left;
        const transformRelativeY = e.clientY - transformRect.top;
        logDebug(
          `  Transform element rect: (${transformRect.left}, ${transformRect.top}) ${transformRect.width}x${transformRect.height}`
        );
        logDebug(`  Relative to transform: (${transformRelativeX}, ${transformRelativeY})`);
      }

      // Tamaños predeterminados según el tipo
      let size;
      if (type.includes("container")) {
        size = { width: 400, height: 300 }; // Tamaño predeterminado para contenedores
      } else if (type.includes("queue")) {
        size = { width: 220, height: 120 }; // Tamaño simple y compacto para queues
      } else {
        size = { width: 220, height: 120 }; // Tamaño predeterminado para squares
      }

      // Extraer tamaño del tipo si se especifica (ej: "square size:200x150")
      const sizeMatch = type.match(/size:(\d+)x(\d+)/);

      if (sizeMatch && sizeMatch[1] && sizeMatch[2]) {
        size = {
          width: parseInt(sizeMatch[1], 10),
          height: parseInt(sizeMatch[2], 10),
        };
        // Limpiar el tipo
        type = type.replace(/\s*size:\d+x\d+/, "");
      }

      // Extraer icono si se especifica (ej: "square icon:database")
      let icon: IconType | undefined = undefined;
      const iconMatch = type.match(/icon:(\w+)/);

      if (iconMatch) {
        icon = iconMatch[1] as IconType;
        // Limpiar el tipo
        type = type.replace(/\s*icon:\w+/, "");
      }

      // Asegurar que el tipo incluya el tamaño para que se conserve al guardar/cargar
      const finalType = `${type} size:${size.width}x${size.height}`;

      // Propiedades adicionales según el tipo
      let backgroundColor: string | undefined = undefined;

      if (type.includes("container")) {
        backgroundColor = "rgba(240, 249, 255, 0.3)"; // Color predeterminado para contenedores
      }

      // Generar un ID único si no se proporciona uno válido
      if (!id || id === "undefined" || id === "null") {
        id = `node-${Date.now()}`;
      }

      // Crear el nuevo nodo
      const newNode = addNode(id, finalType, text, { x: dropX, y: dropY }, size, icon);

      // Si se creó correctamente y tiene propiedades adicionales, actualizarlas
      if (onNodePropertiesChange && backgroundColor) {
        setTimeout(() => {
          // Actualizar propiedades adicionales después de crear el nodo
          onNodePropertiesChange(newNode.id, { backgroundColor });
        }, 0);
      }

      logDebug(
        `Nodo añadido: ${id} (${finalType}) en posición ${Math.round(dropX)},${Math.round(dropY)}`
      );
    },
    [canvasRef, scale, position, addNode, onNodePropertiesChange, logDebug]
  );

  /**
   * Previene el comportamiento predeterminado y establece el efecto de copia
   */
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      console.log("🎯 DRAG OVER en canvas - tipos disponibles:", e.dataTransfer.types);
      logDebug("Evento dragOver en el canvas");
    },
    [logDebug]
  );

  /**
   * Maneja cuando se suelta un componente en el canvas
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      console.log("🎯 DROP EVENT en canvas!");
      console.log("📋 Tipos disponibles:", e.dataTransfer.types);
      console.log("📍 Posición del mouse:", e.clientX, e.clientY);

      logDebug("Evento drop en el canvas");

      try {
        let data;
        let parsedData;

        // Intentar obtener datos como texto plano
        if (e.dataTransfer.types.includes("text/plain")) {
          data = e.dataTransfer.getData("text/plain");
          console.log(`📝 Datos de text/plain:`, data);
          logDebug(`Datos obtenidos de text/plain: ${data}`);

          if (data) {
            try {
              parsedData = JSON.parse(data);
              if (parsedData && parsedData.id && parsedData.type) {
                console.log("✅ Datos JSON válidos:", parsedData);
                logDebug(`Datos válidos en formato JSON: ${data}`);
                addNodeToCanvas(
                  String(parsedData.id),
                  String(parsedData.type),
                  parsedData.text || "",
                  e
                );
                return;
              }
            } catch (jsonError) {
              console.warn("⚠️ Error al parsear JSON:", jsonError);
              // Si no es JSON válido, podría ser un simple ID
              if (typeof data === "string" && data.trim()) {
                const id = `${data.trim()}-${Date.now()}`;
                console.log(`🔄 Generando ID: ${id}`);
                logDebug(`Añadiendo nodo con ID generado: ${id}`);
                addNodeToCanvas(id, "square", data.trim(), e);
                return;
              }
            }
          }
        }

        // Intentar application/json si está disponible
        if (e.dataTransfer.types.includes("application/json")) {
          data = e.dataTransfer.getData("application/json");
          console.log(`📝 Datos de application/json:`, data);
          if (data) {
            try {
              parsedData = JSON.parse(data);
              if (parsedData && parsedData.id && parsedData.type) {
                console.log("✅ Datos JSON válidos (application/json):", parsedData);
                addNodeToCanvas(
                  String(parsedData.id),
                  String(parsedData.type),
                  parsedData.text || "",
                  e
                );
                return;
              }
            } catch (jsonError) {
              console.warn("⚠️ Error al parsear JSON de application/json:", jsonError);
            }
          }
        }

        // Si no se pudo procesar como texto plano, verificar otros formatos
        const availableTypes = e.dataTransfer.types;
        console.log(`📋 Tipos disponibles en el evento drop: ${availableTypes.join(", ")}`);
        logDebug(`Tipos disponibles en el evento drop: ${availableTypes.join(", ")}`);

        // Último recurso: crear un nodo genérico
        const genericId = `node-${Date.now()}`;
        console.log(`🔄 Creando nodo genérico: ${genericId}`);
        logDebug(`Creando nodo genérico: ${genericId}`);
        addNodeToCanvas(genericId, "square", "Nuevo nodo", e);
      } catch (error) {
        console.error("❌ Error al procesar evento drop:", error);
        logDebug(`Error en el evento drop: ${error}`);
      }
    },
    [logDebug, addNodeToCanvas]
  );

  return {
    handleDragOver,
    handleDrop,
  };
}
