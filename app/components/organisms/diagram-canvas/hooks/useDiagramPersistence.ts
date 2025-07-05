import GIF from "gif.js";
import html2canvas from "html2canvas";
import { useCallback, useEffect, useRef, useState } from "react";

import { ConnectionType, NodeType, TemplateType, ViewportType } from "../types";

export function useDiagramPersistence(
  setNodes: React.Dispatch<React.SetStateAction<NodeType[]>>,
  setConnections: React.Dispatch<React.SetStateAction<ConnectionType[]>>,
  setViewport: (viewport: ViewportType) => void,
  logDebug: (message: string) => void
) {
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [formattedJson, setFormattedJson] = useState<string>("");
  const [showTemplatesModal, setShowTemplatesModal] = useState<boolean>(false);

  // Referencia para el input de archivo JSON
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos guardados al montar el componente
  useEffect(() => {
    try {
      const savedDiagram = localStorage.getItem("architectDiagram");
      if (savedDiagram) {
        const { savedNodes, savedConnections, savedViewport } = JSON.parse(savedDiagram);

        // Crear un mapa para detectar IDs duplicados
        const idMap = new Map<string, number>();

        // Cargar nodos, asegurándose de que todos los campos estén presentes y los IDs sean únicos
        const nodesWithCorrectProps = (savedNodes || []).map((node: any) => {
          // Verificar si este ID ya existe en nuestro mapa
          let uniqueId = node.id;
          if (idMap.has(uniqueId)) {
            // Si existe, actualizamos el ID para hacerlo único
            uniqueId = `${node.id}-${Date.now()}-${idMap.get(uniqueId)}`;
            console.log(`ID duplicado detectado: ${node.id}, generando nuevo ID: ${uniqueId}`);
          }

          // Registrar este ID en el mapa (incremantando el contador para este ID)
          idMap.set(node.id, (idMap.get(node.id) || 0) + 1);

          // Asegurar que el tamaño del nodo esté incluido en su tipo si es un nodo square
          let nodeType = node.type || "square";
          const hasDefinedSize = node.size && node.size.width && node.size.height;

          // Solo agregamos el tamaño al tipo si no está ya incluido y tenemos dimensiones
          if (hasDefinedSize && nodeType === "square" && !nodeType.includes("size:")) {
            nodeType = `${nodeType} size:${node.size.width}x${node.size.height}`;
          }

          return {
            id: uniqueId, // Usar el ID único (ya sea el original o el modificado)
            position: node.position,
            text: node.text || "",
            type: nodeType,
            size: node.size || { width: 140, height: 80 },
            // Corregir el mapeo: usar node.icon o node.iconType (para compatibilidad)
            icon: node.icon || node.iconType || undefined,
            backgroundColor: node.backgroundColor || undefined,
            zIndex: node.zIndex || 0,
          };
        });

        console.log("Nodos cargados desde localStorage:", nodesWithCorrectProps);
        nodesWithCorrectProps.forEach((node: NodeType) => {
          if (node.backgroundColor) {
            console.log(`Nodo ${node.id} tiene backgroundColor: ${node.backgroundColor}`);
          }
        });

        setNodes(nodesWithCorrectProps);

        // También necesitamos actualizar las referencias a los nodos en las conexiones
        const nodeIdMapping = new Map<string, string>();
        savedNodes.forEach((originalNode: any, index: number) => {
          nodeIdMapping.set(originalNode.id, nodesWithCorrectProps[index].id);
        });

        // Cargar conexiones asegurando que todas las propiedades estén presentes y los IDs de nodos sean correctos
        const connectionsWithDefaultProps = (savedConnections || []).map(
          (conn: ConnectionType) => ({
            id: conn.id,
            sourceId: nodeIdMapping.get(conn.sourceId) || conn.sourceId, // Usar el ID actualizado si existe
            targetId: nodeIdMapping.get(conn.targetId) || conn.targetId, // Usar el ID actualizado si existe
            sourcePosition: conn.sourcePosition,
            targetPosition: conn.targetPosition,
            sourceX: conn.sourceX,
            sourceY: conn.sourceY,
            targetX: conn.targetX,
            targetY: conn.targetY,
            style: conn.style || "solid",
            animation: conn.animation || "none",
            startArrowHead: conn.startArrowHead || "none",
            endArrowHead: conn.endArrowHead || "arrow",
            color: conn.color || "#000000",
            strokeWidth: conn.strokeWidth || 2,
            isSyncEnabled: conn.isSyncEnabled || false, // Añadir propiedad de sincronización
          })
        );

        setConnections(connectionsWithDefaultProps);

        // Restaurar la posición y escala del viewport si existe
        if (savedViewport) {
          setViewport(savedViewport || { scale: 1, position: { x: 0, y: 0 } });
        }

        logDebug(
          `Cargados ${nodesWithCorrectProps.length} nodos y ${connectionsWithDefaultProps.length} conexiones del almacenamiento local`
        );
      }
    } catch (error) {
      console.error("Error al cargar diagrama guardado:", error);
    }
  }, [setNodes, setConnections, setViewport, logDebug]);

  // Guardar el diagrama actual en localStorage
  const saveDiagram = useCallback(
    (nodes: NodeType[], connections: ConnectionType[], viewport: ViewportType) => {
      // Verificar que los nodos tengan todas sus propiedades
      const completedNodes = nodes.map((node) => {
        // Asegurar que el tamaño del nodo esté incluido en su tipo si es un nodo square
        let nodeType = node.type || "square";
        const hasDefinedSize = node.size && node.size.width && node.size.height;

        // Solo agregamos el tamaño al tipo si no está ya incluido y tenemos dimensiones
        if (hasDefinedSize && nodeType === "square" && !nodeType.includes("size:")) {
          nodeType = `${nodeType} size:${node.size.width}x${node.size.height}`;
        }

        return {
          ...node,
          type: nodeType,
          text: node.text || "",
          size: node.size || { width: 140, height: 80 },
          icon: node.icon || undefined,
          backgroundColor: node.backgroundColor || undefined,
          zIndex: node.zIndex || 0,
        };
      });

      // Verificar que las conexiones tengan todas sus propiedades
      const completedConnections = connections.map((conn) => ({
        ...conn,
        style: conn.style || "solid",
        animation: conn.animation || "none",
        startArrowHead: conn.startArrowHead || "none",
        endArrowHead: conn.endArrowHead || "arrow",
        color: conn.color || "#000000",
        strokeWidth: conn.strokeWidth || 2,
        isSyncEnabled: conn.isSyncEnabled || false, // Añadir propiedad de sincronización
      }));

      // Guardar en localStorage
      localStorage.setItem(
        "architectDiagram",
        JSON.stringify({
          savedNodes: completedNodes,
          savedConnections: completedConnections,
          savedViewport: viewport,
        })
      );

      // Log para verificación (versión resumida para no saturar la consola)
      logDebug(
        `Diagrama guardado: ${completedNodes.length} nodos, ${completedConnections.length} conexiones`
      );

      // Log detallado de algunos nodos y conexiones para verificar propiedades
      if (completedNodes.length > 0) {
        const sampleNode = completedNodes[0];
        if (sampleNode) {
          logDebug(
            `Ejemplo nodo: id=${sampleNode.id}, tipo=${sampleNode.type}, icono=${sampleNode.icon || "ninguno"}, color=${sampleNode.backgroundColor || "default"}`
          );
        }
      }

      if (completedConnections.length > 0) {
        const sampleConn = completedConnections[0];
        if (sampleConn) {
          logDebug(
            `Ejemplo conexión: id=${sampleConn.id}, estilo=${sampleConn.style}, animación=${sampleConn.animation}, punta inicio=${sampleConn.startArrowHead}, punta fin=${sampleConn.endArrowHead}, sincronización=${sampleConn.isSyncEnabled ? "activada" : "desactivada"}`
          );
        }
      }
    },
    [logDebug]
  );

  // Exportar el diagrama a un JSON
  const exportDiagram = useCallback(
    (nodes: NodeType[], connections: ConnectionType[], viewport: ViewportType) => {
      try {
        // Completar propiedades de nodos
        const completedNodes = nodes.map((node) => {
          // Asegurar que el tamaño del nodo esté incluido en su tipo si es un nodo square
          let nodeType = node.type || "square";
          const hasDefinedSize = node.size && node.size.width && node.size.height;

          // Solo agregamos el tamaño al tipo si no está ya incluido y tenemos dimensiones
          if (hasDefinedSize && nodeType === "square" && !nodeType.includes("size:")) {
            nodeType = `${nodeType} size:${node.size.width}x${node.size.height}`;
          }

          return {
            ...node,
            type: nodeType,
            text: node.text || "",
            size: node.size || { width: 140, height: 80 },
            icon: node.icon || undefined,
            backgroundColor: node.backgroundColor || undefined,
          };
        });

        // Completar propiedades de conexiones
        const completedConnections = connections.map((conn) => ({
          ...conn,
          style: conn.style || "solid",
          animation: conn.animation || "none",
          startArrowHead: conn.startArrowHead || "none",
          endArrowHead: conn.endArrowHead || "arrow",
          color: conn.color || "#000000",
          strokeWidth: conn.strokeWidth || 2,
          isSyncEnabled: conn.isSyncEnabled || false, // Añadir propiedad de sincronización
        }));

        const diagramData = {
          version: "1.0",
          nodes: completedNodes,
          connections: completedConnections,
          viewport,
          metadata: {
            exportedAt: new Date().toISOString(),
            nodeCount: completedNodes.length,
            connectionCount: completedConnections.length,
          },
        };

        const json = JSON.stringify(diagramData, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `architect-diagram-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        logDebug("Diagrama exportado correctamente con todas las propiedades");
      } catch (error) {
        console.error("Error al exportar diagrama:", error);
        logDebug("Error al exportar diagrama");
      }
    },
    [logDebug]
  );

  // Exportar el diagrama a formato GIF con animaciones
  const exportToGif = useCallback(
    async (
      diagramRef: React.RefObject<HTMLDivElement>,
      viewportData?: { scale: number; position: { x: number; y: number } }
    ) => {
      try {
        if (!diagramRef.current) {
          logDebug("No se pudo encontrar el elemento del diagrama para exportar");
          return;
        }

        logDebug("Preparando exportación a GIF animado...");

        // Obtenemos el contenedor principal del diagrama (el canvas)
        const diagramContainer = document.querySelector('[data-diagram-export="true"]');
        if (!diagramContainer) {
          throw new Error("No se pudo encontrar el contenedor del diagrama");
        }

        // Obtenemos la capa de transformación (el div con el transform)
        const transformLayer = diagramContainer.querySelector(".absolute");
        if (!transformLayer || !(transformLayer instanceof HTMLElement)) {
          throw new Error("No se pudo encontrar la capa de transformación del diagrama");
        }

        // Guardamos el estado original de la transformación para restaurarla después
        const originalTransform = transformLayer.style.transform;
        const originalWidth = transformLayer.style.width;
        const originalHeight = transformLayer.style.height;

        // Importante: No modificamos la transformación, queremos capturar exactamente lo que se ve
        // incluyendo el zoom y la posición actual

        // Datos del viewport actual
        const currentScale = viewportData?.scale || 1;
        const currentPosition = viewportData?.position || { x: 0, y: 0 };

        // Calcular el área visible actualmente
        const visibleArea = {
          top: -currentPosition.y,
          left: -currentPosition.x,
          width: diagramContainer.clientWidth / currentScale,
          height: diagramContainer.clientHeight / currentScale,
        };

        logDebug(`Área visible: ${JSON.stringify(visibleArea)}`);
        logDebug(`Transformación actual: ${originalTransform}`);

        // Ocultamos temporalmente elementos que no queremos en la exportación
        const elementsToHide = document.querySelectorAll(
          '.ignore-export, .minimap-container, [data-minimap="true"]'
        );
        const originalStyles = new Map();

        elementsToHide.forEach((el) => {
          if (el instanceof HTMLElement) {
            // Guardamos el display original
            originalStyles.set(el, el.style.display);
            // Ocultamos el elemento
            el.style.display = "none";
          }
        });

        logDebug(
          `Ocultos ${elementsToHide.length} elementos que no deben aparecer en la exportación`
        );

        // Buscamos específicamente el minimapa para asegurarnos que está oculto
        const minimap = document.querySelector(".absolute.bottom-4.right-4.z-10");
        if (minimap && minimap instanceof HTMLElement) {
          originalStyles.set(minimap, minimap.style.display);
          minimap.style.display = "none";
          logDebug("Minimapa ocultado para la exportación");
        }

        // Configuración para la animación - MEJORADA para mejor calidad
        const fps = 20; // Aumentado para mejor fluidez (antes 15)
        const duration = 4; // Duración optimizada (antes 3)
        const totalFrames = fps * duration; // Frames totales optimizados
        const frameDelay = Math.round(100 / fps); // Delay entre frames en centésimas de segundo

        // Creamos un div para mostrar progreso
        const progressContainer = document.createElement("div");
        progressContainer.style.position = "fixed";
        progressContainer.style.top = "50%";
        progressContainer.style.left = "50%";
        progressContainer.style.transform = "translate(-50%, -50%)";
        progressContainer.style.padding = "20px";
        progressContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        progressContainer.style.color = "white";
        progressContainer.style.borderRadius = "8px";
        progressContainer.style.zIndex = "10000";
        progressContainer.style.textAlign = "center";
        progressContainer.innerHTML = `
        <div>Grabando GIF animado...</div>
        <div id="gif-progress-text">0%</div>
        <div style="width: 200px; height: 10px; background: #333; margin-top: 10px; border-radius: 5px; overflow: hidden;">
          <div id="gif-progress-bar" style="width: 0%; height: 100%; background: #3b82f6;"></div>
        </div>
      `;
        document.body.appendChild(progressContainer);

        const progressBar = document.getElementById("gif-progress-bar");
        const progressText = document.getElementById("gif-progress-text");

        // Dimensiones del contenedor del diagrama
        const containerWidth = diagramContainer.clientWidth;
        const containerHeight = diagramContainer.clientHeight;

        // Ajustamos la escala para obtener mayor calidad
        const scale = 0.92; // Aumentamos la escala (antes 0.85) para mejorar calidad
        const scaledWidth = Math.floor(containerWidth * scale);
        const scaledHeight = Math.floor(containerHeight * scale);

        // Inicializamos el generador de GIF con opciones de alta calidad manteniendo buen rendimiento
        const gif = new GIF({
          workers: 4, // Mantener 4 workers para procesamiento paralelo
          quality: 2, // Mejoramos la calidad (1=mejor calidad, 20=menor calidad)
          workerScript: "/gif.worker.js", // Worker script path
          width: scaledWidth, // Ancho con mejor calidad
          height: scaledHeight, // Alto con mejor calidad
          dither: false, // Sin dithering para mantener colores limpios
          background: "#FFFFFF", // Fondo blanco
        } as any); // Utilizamos as any para evitar errores de tipado

        try {
          // Capturar frames en un bucle
          const captureFrame = async (frameIndex: number) => {
            // Actualizar progreso
            if (progressBar && progressText) {
              const progress = Math.round((frameIndex / totalFrames) * 100);
              progressBar.style.width = `${progress}%`;
              progressText.innerText = `${progress}% (Frame ${frameIndex}/${totalFrames})`;
            }

            // Opciones para captura optimizada
            const options = {
              backgroundColor: "#FFFFFF",
              scale: 1, // Mantenemos escala 1 para el html2canvas
              useCORS: true,
              allowTaint: true,
              logging: false,
              width: containerWidth,
              height: containerHeight,
              onclone: (clonedDoc: Document) => {
                // Corregir la posición de los textos en los contenedores
                const allExportTexts = clonedDoc.querySelectorAll('[data-export-text="true"]');
                allExportTexts.forEach((el) => {
                  if (el instanceof HTMLElement) {
                    // Aplicar ajustes más agresivos para corregir el desplazamiento en la captura
                    el.style.transform = "translateY(-2px)";
                    el.style.display = "inline-block";
                    el.style.position = "relative";
                    el.style.lineHeight = "1.1";
                    el.style.paddingTop = "0";
                    el.style.paddingBottom = "0";
                    el.style.margin = "0";
                    el.style.verticalAlign = "top";
                    el.style.letterSpacing = "normal";
                    el.style.textRendering = "optimizeLegibility";
                    el.style.setProperty("-webkit-font-smoothing", "antialiased");
                    el.style.setProperty("-moz-osx-font-smoothing", "grayscale");

                    // Asegurarse de que el texto sea priorizado en la captura
                    el.setAttribute("data-html2canvas-capture", "true");
                    el.setAttribute("data-html2canvas-priority", "1");
                  }
                });

                // Ajustes específicos para los textos de contenedores
                const containerTexts = clonedDoc.querySelectorAll(".container-text-element");
                containerTexts.forEach((el) => {
                  if (el instanceof HTMLElement) {
                    el.style.transform = "translateY(-2px)";
                  }
                });

                // Ajustes específicos para los textos de nodos
                const squareTexts = clonedDoc.querySelectorAll(".square-text-element");
                squareTexts.forEach((el) => {
                  if (el instanceof HTMLElement) {
                    el.style.transform = "translateY(-1px)";
                  }
                });

                // También ajustar contenedores de título
                const titleWrappers = clonedDoc.querySelectorAll('[data-export-important="true"]');
                titleWrappers.forEach((wrapper) => {
                  if (wrapper instanceof HTMLElement) {
                    wrapper.style.paddingTop = "2px";
                    wrapper.style.paddingBottom = "2px";
                    wrapper.style.marginBottom = "2px";
                    wrapper.style.display = "flex";
                    wrapper.style.alignItems = "center";
                    wrapper.style.height = "auto";
                  }
                });

                // Manejar las animaciones
                const animatedElements = clonedDoc.querySelectorAll(".animation, [data-animation]");
                animatedElements.forEach((el) => {
                  if (el instanceof HTMLElement) {
                    // Calcular la fase de animación (0-1) basada en el frame actual
                    const phase = (frameIndex / totalFrames) * Math.PI * 2;

                    // Aplicar un efecto de pulso o movimiento suave
                    if (
                      el.classList.contains("pulse") ||
                      el.getAttribute("data-animation") === "pulse"
                    ) {
                      const scale = 1 + 0.05 * Math.sin(phase);
                      el.style.transform = `scale(${scale})`;
                    } else if (
                      el.classList.contains("flow") ||
                      el.getAttribute("data-animation") === "flow"
                    ) {
                      // Para conexiones animadas, modificamos el dash-offset
                      if (el.tagName === "path" || el.tagName === "LINE") {
                        const currentOffset = (-20 * (frameIndex % 30)) / 30;
                        el.setAttribute("stroke-dashoffset", String(currentOffset));
                      }
                    } else if (
                      el.classList.contains("bounce") ||
                      el.getAttribute("data-animation") === "bounce"
                    ) {
                      const translateY = 2 * Math.sin(phase);
                      el.style.transform = `translateY(${translateY}px)`;
                    } else {
                      // Animación genérica con pequeño movimiento
                      const translateX = 1 * Math.sin(phase);
                      const translateY = 1 * Math.cos(phase);
                      el.style.transform = `translate(${translateX}px, ${translateY}px)`;
                    }
                  }
                });
              },
              ignoreElements: (element: Element) => {
                // Ignorar elementos marcados explícitamente y el minimapa
                return (
                  element.classList.contains("ignore-export") ||
                  element.hasAttribute("data-minimap") ||
                  element.parentElement?.hasAttribute("data-minimap") ||
                  false ||
                  element.classList.contains("minimap-container") ||
                  element.parentElement?.classList.contains("minimap-container") ||
                  false
                );
              },
            };

            // Capturar el frame actual
            const canvas = await html2canvas(diagramContainer as HTMLElement, options);

            // Crear un canvas más pequeño para reducir el tamaño del GIF
            const scaledCanvas = document.createElement("canvas");
            scaledCanvas.width = scaledWidth;
            scaledCanvas.height = scaledHeight;
            const ctx = scaledCanvas.getContext("2d");

            if (ctx) {
              // Dibujar el canvas original reducido
              ctx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight);

              // Añadir el canvas redimensionado al GIF
              gif.addFrame(scaledCanvas, { copy: true, delay: frameDelay * 10 }); // delay en ms
            } else {
              // Si falla la creación del contexto, usar el canvas original como fallback
              gif.addFrame(canvas, { copy: true, delay: frameDelay * 10 });
            }

            // Si aún faltan frames, programar el siguiente
            if (frameIndex < totalFrames - 1) {
              // Esperar el tiempo adecuado según FPS antes de tomar el siguiente frame
              return new Promise<void>((resolve) => {
                setTimeout(() => {
                  captureFrame(frameIndex + 1).then(resolve);
                }, 1000 / fps); // Tiempo en ms entre capturas para mantener los FPS
              });
            }
          };

          // Iniciar captura de frames
          await captureFrame(0);

          // Actualizar mensaje de progreso
          if (progressText) {
            progressText.innerText = "Generando archivo GIF...";
          }

          // Renderizar y descargar el GIF
          gif.on("finished", (blob: Blob) => {
            // Crear URL y descargar
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `architect-diagram-anim-${new Date().toISOString().split("T")[0]}.gif`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Eliminar el contenedor de progreso
            document.body.removeChild(progressContainer);

            // Restaurar elementos ocultos
            elementsToHide.forEach((el) => {
              if (el instanceof HTMLElement) {
                el.style.display = originalStyles.get(el) || "";
              }
            });

            // Restaurar específicamente el minimapa si fue ocultado
            if (minimap && minimap instanceof HTMLElement) {
              minimap.style.display = originalStyles.get(minimap) || "";
            }

            // Restaurar la transformación original si fue modificada
            if (transformLayer) {
              transformLayer.style.transform = originalTransform;
              transformLayer.style.width = originalWidth;
              transformLayer.style.height = originalHeight;
            }

            logDebug(`GIF animado exportado correctamente (${Math.round(blob.size / 1024)} KB)`);
          });

          // Iniciar la generación del GIF (esto dispara el evento 'finished' cuando termina)
          gif.render();
        } catch (error) {
          // Limpiar en caso de error
          document.body.removeChild(progressContainer);

          // Restaurar elementos ocultos
          elementsToHide.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.display = originalStyles.get(el) || "";
            }
          });

          // Restaurar la transformación original si fue modificada
          if (transformLayer) {
            transformLayer.style.transform = originalTransform;
            transformLayer.style.width = originalWidth;
            transformLayer.style.height = originalHeight;
          }

          throw error;
        }
      } catch (error) {
        console.error("Error al exportar diagrama como GIF animado:", error);
        logDebug("Error al exportar diagrama como GIF animado");
      }
    },
    [logDebug]
  );

  // Importar un diagrama desde un archivo JSON
  const importDiagram = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        if (!event.target.files || event.target.files.length === 0) {
          return;
        }

        const file = event.target.files[0];
        if (!file) {
          return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const data = JSON.parse(content);

            if (!data.nodes || !Array.isArray(data.nodes)) {
              throw new Error("Formato JSON inválido: no contiene una lista de nodos");
            }

            // Procesar nodos garantizando todas las propiedades necesarias
            const importedNodes = data.nodes.map((node: any) => {
              // Asegurar que el tamaño del nodo esté incluido en su tipo si es un nodo square
              let nodeType = node.type || "square";
              const hasDefinedSize = node.size && node.size.width && node.size.height;

              // Solo agregamos el tamaño al tipo si no está ya incluido y tenemos dimensiones
              if (hasDefinedSize && nodeType === "square" && !nodeType.includes("size:")) {
                nodeType = `${nodeType} size:${node.size.width}x${node.size.height}`;
              }

              return {
                id: node.id || `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                position: node.position || { x: 0, y: 0 },
                text: node.text || "",
                type: nodeType,
                size: node.size || { width: 140, height: 80 },
                icon: node.icon || undefined,
                backgroundColor: node.backgroundColor || undefined,
              };
            });

            // Crear un mapa para detectar IDs duplicados
            const idMap = new Map<string, number>();

            // Verificar IDs duplicados
            importedNodes.forEach((node: NodeType, index: number) => {
              if (idMap.has(node.id)) {
                // Si existe un duplicado, generar un nuevo ID
                const newId = `${node.id}-${Date.now()}-${index}`;
                importedNodes[index].id = newId;
                logDebug(`ID duplicado detectado: ${node.id}, generado nuevo ID: ${newId}`);
              }
              idMap.set(node.id, 1);
            });

            setNodes(importedNodes);

            // Procesar conexiones con actualización de referencias y garantizar propiedades
            if (data.connections && Array.isArray(data.connections)) {
              const importedConnections = data.connections.map((conn: any) => ({
                id: conn.id || `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                sourceId: conn.sourceId,
                targetId: conn.targetId,
                sourcePosition: conn.sourcePosition || "right",
                targetPosition: conn.targetPosition || "left",
                sourceX: conn.sourceX || 0,
                sourceY: conn.sourceY || 0,
                targetX: conn.targetX || 0,
                targetY: conn.targetY || 0,
                style: conn.style || "solid",
                animation: conn.animation || "none",
                startArrowHead: conn.startArrowHead || "none",
                endArrowHead: conn.endArrowHead || "arrow",
                color: conn.color || "#000000",
                strokeWidth: conn.strokeWidth || 2,
                isSyncEnabled: conn.isSyncEnabled || false, // Añadir propiedad de sincronización
              }));

              setConnections(importedConnections);
            } else {
              setConnections([]);
            }

            // Importar viewport si existe
            if (data.viewport) {
              setViewport(data.viewport);
            } else {
              setViewport({ scale: 1, position: { x: 0, y: 0 } });
            }

            logDebug(
              `Importados ${importedNodes.length} nodos y ${data.connections ? data.connections.length : 0} conexiones`
            );
          } catch (error) {
            console.error("Error al procesar archivo JSON:", error);
            logDebug("Error al procesar archivo JSON");
          }
        };

        reader.readAsText(file);
      } catch (error) {
        console.error("Error al importar diagrama:", error);
        logDebug("Error al importar diagrama");
      }

      // Limpiar el valor del input para permitir cargar el mismo archivo nuevamente
      if (event.target) {
        event.target.value = "";
      }
    },
    [setNodes, setConnections, setViewport, logDebug]
  );

  // Activar el input de archivo
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Mostrar el JSON del diagrama actual
  const showDiagramJson = useCallback(
    (nodes: NodeType[], connections: ConnectionType[], viewport: ViewportType) => {
      try {
        // Completar propiedades de nodos
        const completedNodes = nodes.map((node) => {
          // Asegurar que el tamaño del nodo esté incluido en su tipo si es un nodo square
          let nodeType = node.type || "square";
          const hasDefinedSize = node.size && node.size.width && node.size.height;

          // Solo agregamos el tamaño al tipo si no está ya incluido y tenemos dimensiones
          if (hasDefinedSize && nodeType === "square" && !nodeType.includes("size:")) {
            nodeType = `${nodeType} size:${node.size.width}x${node.size.height}`;
          }

          return {
            ...node,
            type: nodeType,
            text: node.text || "",
            size: node.size || { width: 140, height: 80 },
            icon: node.icon || undefined,
            backgroundColor: node.backgroundColor || undefined,
          };
        });

        // Completar propiedades de conexiones
        const completedConnections = connections.map((conn) => ({
          ...conn,
          style: conn.style || "solid",
          animation: conn.animation || "none",
          startArrowHead: conn.startArrowHead || "none",
          endArrowHead: conn.endArrowHead || "arrow",
          color: conn.color || "#000000",
          strokeWidth: conn.strokeWidth || 2,
          isSyncEnabled: conn.isSyncEnabled || false, // Añadir propiedad de sincronización
        }));

        const diagramData = {
          version: "1.0",
          nodes: completedNodes,
          connections: completedConnections,
          viewport,
          metadata: {
            exportedAt: new Date().toISOString(),
            nodeCount: completedNodes.length,
            connectionCount: completedConnections.length,
          },
        };

        const json = JSON.stringify(diagramData, null, 2);
        setFormattedJson(json);
        setShowJsonModal(true);
        logDebug("JSON generado con todas las propiedades del diagrama");
      } catch (error) {
        console.error("Error al generar JSON:", error);
        logDebug("Error al generar JSON del diagrama");
      }
    },
    [logDebug]
  );

  // Copiar el JSON al portapapeles
  const copyJsonToClipboard = useCallback(() => {
    try {
      navigator.clipboard.writeText(formattedJson);
      logDebug("JSON copiado al portapapeles");
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
      logDebug("Error al copiar al portapapeles");
    }
  }, [formattedJson, logDebug]);

  // Función auxiliar para mapear nodos de un template
  const mapTemplateNodes = useCallback((templateNodes: any[]): NodeType[] => {
    return templateNodes.map((node) => {
      // Si el nodo tiene un tipo definido y es square, verificar si necesitamos incluir el tamaño
      const hasDefinedSize = node.size && node.size.width && node.size.height;
      let nodeType = node.type || "square";

      // Solo agregamos el tamaño al tipo si no está ya incluido y tenemos dimensiones
      if (hasDefinedSize && nodeType === "square" && !nodeType.includes("size:")) {
        nodeType = `${nodeType} size:${node.size.width}x${node.size.height}`;
      }

      return {
        id: node.id || `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: node.position || { x: 0, y: 0 },
        text: node.text || "",
        type: nodeType,
        size: node.size || { width: 140, height: 80 },
        icon: node.icon || node.iconType || undefined,
        backgroundColor: node.backgroundColor || undefined,
      };
    });
  }, []);

  // Convertir plantilla a conexiones
  const mapTemplateConnections = useCallback(
    (templateConnections: any[], _nodes: NodeType[]): ConnectionType[] => {
      return templateConnections.map((conn) => ({
        id: conn.id,
        sourceId: conn.sourceId,
        targetId: conn.targetId,
        sourcePosition: conn.sourcePosition,
        targetPosition: conn.targetPosition,
        sourceX: conn.sourceX,
        sourceY: conn.sourceY,
        targetX: conn.targetX,
        targetY: conn.targetY,
        style: conn.style || "solid",
        animation: conn.animation || "none",
        startArrowHead: conn.startArrowHead || "none",
        endArrowHead: conn.endArrowHead || "arrow",
        color: conn.color || "#000000",
        strokeWidth: conn.strokeWidth || 2,
        isSyncEnabled: conn.isSyncEnabled || false, // Añadir propiedad de sincronización
      }));
    },
    []
  );

  // Función para cargar una plantilla
  const loadTemplate = useCallback(
    (template: TemplateType) => {
      try {
        if (!template) return;

        // Mapear los nodos de la plantilla
        const mappedNodes = mapTemplateNodes(template.nodes || []);
        setNodes(mappedNodes);

        // Mapear las conexiones de la plantilla
        const mappedConnections = mapTemplateConnections(template.connections || [], mappedNodes);
        setConnections(mappedConnections);

        // Configurar el viewport si existe
        if (template.viewport) {
          setTimeout(() => {
            if (template.viewport && template.viewport.scale) {
              setViewport(template.viewport);
            }
            if (template.viewport && template.viewport.position) {
              setViewport(template.viewport);
            }
          }, 100);
        }

        setShowTemplatesModal(false);
        logDebug(`Plantilla "${template.name}" cargada correctamente`);
        return { nodes: mappedNodes, connections: mappedConnections };
      } catch (error) {
        console.error("Error al cargar la plantilla:", error);
        logDebug("Error al cargar plantilla");
        return null;
      }
    },
    [
      mapTemplateNodes,
      mapTemplateConnections,
      setNodes,
      setConnections,
      setViewport,
      logDebug,
      setShowTemplatesModal,
    ]
  );

  return {
    fileInputRef,
    showJsonModal,
    setShowJsonModal,
    formattedJson,
    showTemplatesModal,
    setShowTemplatesModal,
    saveDiagram,
    exportDiagram,
    exportToGif,
    importDiagram,
    triggerFileInput,
    showDiagramJson,
    copyJsonToClipboard,
    loadTemplate,
    mapTemplateNodes,
    mapTemplateConnections,
  };
}
