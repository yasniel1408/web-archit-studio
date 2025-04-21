import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  NodeType, 
  ConnectionType, 
  ViewportType, 
  DiagramDataType,
  TemplateType
} from '../types';
import html2canvas from 'html2canvas';
import GIF from 'gif.js';

export function useDiagramPersistence(
  setNodes: React.Dispatch<React.SetStateAction<NodeType[]>>,
  setConnections: React.Dispatch<React.SetStateAction<ConnectionType[]>>,
  setViewport: (viewport: ViewportType) => void,
  logDebug: (message: string) => void
) {
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [formattedJson, setFormattedJson] = useState<string>('');
  const [showTemplatesModal, setShowTemplatesModal] = useState<boolean>(false);
  
  // Referencia para el input de archivo JSON
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos guardados al montar el componente
  useEffect(() => {
    try {
      const savedDiagram = localStorage.getItem('architectDiagram');
      if (savedDiagram) {
        const { savedNodes, savedConnections, savedViewport } = JSON.parse(savedDiagram);
        
        // Cargar nodos, asegurándose de que todos los campos estén presentes
        const nodesWithCorrectProps = (savedNodes || []).map((node: any) => ({
          id: node.id,
          position: node.position,
          text: node.text || "",
          type: node.type || "square",
          size: node.size || { width: 140, height: 80 },
          // Corregir el mapeo: usar node.icon o node.iconType (para compatibilidad)
          icon: node.icon || node.iconType || undefined,
          backgroundColor: node.backgroundColor || undefined
        }));
        
        console.log("Nodos cargados desde localStorage:", nodesWithCorrectProps);
        nodesWithCorrectProps.forEach(node => {
          if (node.backgroundColor) {
            console.log(`Nodo ${node.id} tiene backgroundColor: ${node.backgroundColor}`);
          }
        });
        
        setNodes(nodesWithCorrectProps);
        
        // Cargar conexiones asegurando que todas las propiedades estén presentes
        const connectionsWithDefaultProps = (savedConnections || []).map((conn: ConnectionType) => ({
          id: conn.id,
          sourceId: conn.sourceId,
          targetId: conn.targetId,
          sourcePosition: conn.sourcePosition,
          targetPosition: conn.targetPosition,
          sourceX: conn.sourceX,
          sourceY: conn.sourceY,
          targetX: conn.targetX,
          targetY: conn.targetY,
          style: conn.style || 'solid',
          animation: conn.animation || 'none',
          startArrowHead: conn.startArrowHead || 'none',
          endArrowHead: conn.endArrowHead || 'arrow',
          color: conn.color || '#000000',
          strokeWidth: conn.strokeWidth || 2
        }));
        
        setConnections(connectionsWithDefaultProps);
        
        // Restaurar la posición y escala del viewport si existe
        if (savedViewport) {
          setViewport(savedViewport || { scale: 1, position: { x: 0, y: 0 } });
        }
        
        logDebug(`Cargados ${nodesWithCorrectProps.length} nodos y ${connectionsWithDefaultProps.length} conexiones del almacenamiento local`);
      }
    } catch (error) {
      console.error('Error al cargar diagrama guardado:', error);
    }
  }, [setNodes, setConnections, setViewport, logDebug]);

  // Guardar el diagrama actual en localStorage
  const saveDiagram = useCallback((
    nodes: NodeType[], 
    connections: ConnectionType[], 
    viewport: ViewportType
  ) => {
    localStorage.setItem('architectDiagram', JSON.stringify({
      savedNodes: nodes,
      savedConnections: connections,
      savedViewport: viewport
    }));
    logDebug('Diagrama guardado en almacenamiento local');
  }, [logDebug]);

  // Exportar el diagrama a un JSON
  const exportDiagram = useCallback((
    nodes: NodeType[], 
    connections: ConnectionType[], 
    viewport: ViewportType
  ) => {
    try {
      const diagramData = {
        version: "1.0",
        nodes,
        connections,
        viewport,
        metadata: {
          exportedAt: new Date().toISOString(),
          nodeCount: nodes.length,
          connectionCount: connections.length
        }
      };
      
      const json = JSON.stringify(diagramData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `architect-diagram-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      logDebug('Diagrama exportado correctamente');
    } catch (error) {
      console.error('Error al exportar diagrama:', error);
      logDebug('Error al exportar diagrama');
    }
  }, [logDebug]);

  // Exportar el diagrama a formato GIF con animaciones
  const exportToGif = useCallback(async (
    diagramRef: React.RefObject<HTMLDivElement>,
    viewportData?: { scale: number; position: { x: number, y: number } } 
  ) => {
    try {
      if (!diagramRef.current) {
        logDebug('No se pudo encontrar el elemento del diagrama para exportar');
        return;
      }

      logDebug('Preparando exportación a GIF animado...');
      
      // Obtenemos el contenedor principal del diagrama (el canvas)
      const diagramContainer = document.querySelector('[data-diagram-export="true"]');
      if (!diagramContainer) {
        throw new Error('No se pudo encontrar el contenedor del diagrama');
      }
      
      // Obtenemos la capa de transformación (el div con el transform)
      const transformLayer = diagramContainer.querySelector('.absolute');
      if (!transformLayer || !(transformLayer instanceof HTMLElement)) {
        throw new Error('No se pudo encontrar la capa de transformación del diagrama');
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
        height: diagramContainer.clientHeight / currentScale
      };
      
      logDebug(`Área visible: ${JSON.stringify(visibleArea)}`);
      logDebug(`Transformación actual: ${originalTransform}`);
      
      // Ocultamos temporalmente elementos que no queremos en la exportación
      const elementsToHide = document.querySelectorAll('.ignore-export, .minimap-container, [data-minimap="true"]');
      let originalStyles = new Map();
      
      elementsToHide.forEach((el) => {
        if (el instanceof HTMLElement) {
          // Guardamos el display original
          originalStyles.set(el, el.style.display);
          // Ocultamos el elemento
          el.style.display = 'none';
        }
      });
      
      logDebug(`Ocultos ${elementsToHide.length} elementos que no deben aparecer en la exportación`);
      
      // Buscamos específicamente el minimapa para asegurarnos que está oculto
      const minimap = document.querySelector('.absolute.bottom-4.right-4.z-10');
      if (minimap && minimap instanceof HTMLElement) {
        originalStyles.set(minimap, minimap.style.display);
        minimap.style.display = 'none';
        logDebug('Minimapa ocultado para la exportación');
      }
      
      // Configuración para la animación
      const fps = 30; // Frames por segundo
      const duration = 5; // Duración en segundos
      const totalFrames = fps * duration; // Total de frames a capturar
      const frameDelay = Math.round(100 / fps); // Delay entre frames en centésimas de segundo
      
      // Creamos un div para mostrar progreso
      const progressContainer = document.createElement('div');
      progressContainer.style.position = 'fixed';
      progressContainer.style.top = '50%';
      progressContainer.style.left = '50%';
      progressContainer.style.transform = 'translate(-50%, -50%)';
      progressContainer.style.padding = '20px';
      progressContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      progressContainer.style.color = 'white';
      progressContainer.style.borderRadius = '8px';
      progressContainer.style.zIndex = '10000';
      progressContainer.style.textAlign = 'center';
      progressContainer.innerHTML = `
        <div>Grabando GIF animado...</div>
        <div id="gif-progress-text">0%</div>
        <div style="width: 200px; height: 10px; background: #333; margin-top: 10px; border-radius: 5px; overflow: hidden;">
          <div id="gif-progress-bar" style="width: 0%; height: 100%; background: #3b82f6;"></div>
        </div>
      `;
      document.body.appendChild(progressContainer);
      
      const progressBar = document.getElementById('gif-progress-bar');
      const progressText = document.getElementById('gif-progress-text');
      
      // Dimensiones del contenedor del diagrama
      const containerWidth = diagramContainer.clientWidth;
      const containerHeight = diagramContainer.clientHeight;
      
      // Inicializamos el generador de GIF con opciones de alta calidad
      const gif = new GIF({
        workers: 4,              // Cantidad de workers para procesamiento paralelo
        quality: 1,              // Menor valor = mejor calidad (pero archivo más grande)
        workerScript: '/gif.worker.js', // Worker script path
        width: containerWidth,
        height: containerHeight,
        dither: false,          // Sin dithering para mantener colores limpios
        background: '#FFFFFF',  // Fondo blanco
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
          
          // Simular animaciones aplicando pequeños cambios en la posición
          // de elementos con clase animation para que se vean en movimiento
          const animatedElements = document.querySelectorAll('.animation, [data-animation]');
          animatedElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              // Calcular la fase de animación (0-1) basada en el frame actual
              const phase = (frameIndex / totalFrames) * Math.PI * 2;
              
              // Aplicar un efecto de pulso o movimiento suave
              if (el.classList.contains('pulse') || el.getAttribute('data-animation') === 'pulse') {
                const scale = 1 + 0.05 * Math.sin(phase);
                el.style.transform = `scale(${scale})`;
              } else if (el.classList.contains('flow') || el.getAttribute('data-animation') === 'flow') {
                // Para conexiones animadas, modificamos el dash-offset
                if (el.tagName === 'path' || el.tagName === 'LINE') {
                  const currentOffset = -20 * (frameIndex % 30) / 30;
                  el.setAttribute('stroke-dashoffset', String(currentOffset));
                }
              } else if (el.classList.contains('bounce') || el.getAttribute('data-animation') === 'bounce') {
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
          
          // Opciones para captura de alta calidad y visualización actual
          const options = {
            backgroundColor: '#FFFFFF',
            scale: 1,             // Usamos escala 1 porque queremos exactamente lo que se ve
            useCORS: true,
            allowTaint: true,
            logging: false,
            // Estas configuraciones son cruciales para respetar el transform:
            // NO debemos aplicar ninguna transformación adicional
            // html2canvas debe capturar exactamente lo que está en pantalla
            width: containerWidth,
            height: containerHeight,
            // No modificamos nada - esto es esencial
            ignoreElements: (element: Element) => {
              // Ignorar elementos marcados explícitamente y el minimapa
              return element.classList.contains('ignore-export') || 
                     element.hasAttribute('data-minimap') || 
                     (element.parentElement?.hasAttribute('data-minimap') || false) ||
                     element.classList.contains('minimap-container') ||
                     (element.parentElement?.classList.contains('minimap-container') || false);
            }
          };

          // Capturar el frame actual
          const canvas = await html2canvas(diagramContainer as HTMLElement, options);
          
          // Añadir frame al GIF
          gif.addFrame(canvas, { copy: true, delay: frameDelay * 10 }); // delay en ms
          
          // Si aún faltan frames, programar el siguiente
          if (frameIndex < totalFrames - 1) {
            // Esperar el tiempo adecuado según FPS antes de tomar el siguiente frame
            return new Promise<void>(resolve => {
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
          progressText.innerText = 'Generando archivo GIF...';
        }
        
        // Renderizar y descargar el GIF
        gif.on('finished', (blob: Blob) => {
          // Crear URL y descargar
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `architect-diagram-anim-${new Date().toISOString().split('T')[0]}.gif`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          // Eliminar el contenedor de progreso
          document.body.removeChild(progressContainer);
          
          // Restaurar elementos ocultos
          elementsToHide.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.display = originalStyles.get(el) || '';
            }
          });
          
          // Restaurar específicamente el minimapa si fue ocultado
          if (minimap && minimap instanceof HTMLElement) {
            minimap.style.display = originalStyles.get(minimap) || '';
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
            el.style.display = originalStyles.get(el) || '';
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
      console.error('Error al exportar diagrama como GIF animado:', error);
      logDebug('Error al exportar diagrama como GIF animado');
    }
  }, [logDebug]);

  // Importar un diagrama desde un archivo JSON
  const importDiagram = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = e.target?.result as string;
          const data = JSON.parse(json);
          
          if (!data.nodes || !Array.isArray(data.nodes)) {
            throw new Error('Formato de archivo inválido: No se encontraron nodos');
          }
          
          // Normalizar nodos
          const importedNodes: NodeType[] = (data.nodes || []).map((node: any) => ({
            id: node.id,
            position: node.position,
            text: node.text || "",
            type: node.type || "square",
            size: node.size || { width: 140, height: 80 },
            icon: node.icon || node.iconType || undefined,
            backgroundColor: node.backgroundColor || undefined
          }));
          
          // Normalizar conexiones
          const importedConnections: ConnectionType[] = (data.connections || []).map((conn: any) => ({
            id: conn.id,
            sourceId: conn.sourceId,
            targetId: conn.targetId,
            sourcePosition: conn.sourcePosition,
            targetPosition: conn.targetPosition,
            sourceX: conn.sourceX,
            sourceY: conn.sourceY,
            targetX: conn.targetX,
            targetY: conn.targetY,
            style: conn.style || 'solid',
            animation: conn.animation || 'none',
            startArrowHead: conn.startArrowHead || 'none',
            endArrowHead: conn.endArrowHead || 'arrow',
            color: conn.color || '#000000',
            strokeWidth: conn.strokeWidth || 2
          }));
          
          setNodes(importedNodes);
          setConnections(importedConnections);
          
          // Importar viewport si existe
          if (data.viewport) {
            setViewport(data.viewport);
          } else {
            setViewport({ scale: 1, position: { x: 0, y: 0 } });
          }
          
          logDebug(`Importados ${importedNodes.length} nodos y ${importedConnections.length} conexiones`);
        } catch (error) {
          console.error('Error al procesar archivo JSON:', error);
          logDebug('Error al procesar archivo JSON');
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error al importar diagrama:', error);
      logDebug('Error al importar diagrama');
    }
    
    // Limpiar el valor del input para permitir cargar el mismo archivo nuevamente
    if (event.target) {
      event.target.value = '';
    }
  }, [setNodes, setConnections, setViewport, logDebug]);

  // Activar el input de archivo
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Mostrar el JSON del diagrama actual
  const showDiagramJson = useCallback((
    nodes: NodeType[], 
    connections: ConnectionType[], 
    viewport: ViewportType
  ) => {
    try {
      const diagramData = {
        version: "1.0",
        nodes,
        connections,
        viewport,
        metadata: {
          exportedAt: new Date().toISOString(),
          nodeCount: nodes.length,
          connectionCount: connections.length
        }
      };
      
      const json = JSON.stringify(diagramData, null, 2);
      setFormattedJson(json);
      setShowJsonModal(true);
    } catch (error) {
      console.error('Error al generar JSON:', error);
      logDebug('Error al generar JSON del diagrama');
    }
  }, [logDebug]);

  // Copiar el JSON al portapapeles
  const copyJsonToClipboard = useCallback(() => {
    try {
      navigator.clipboard.writeText(formattedJson);
      logDebug('JSON copiado al portapapeles');
    } catch (error) {
      console.error('Error al copiar al portapapeles:', error);
      logDebug('Error al copiar al portapapeles');
    }
  }, [formattedJson, logDebug]);

  // Convertir plantilla a nodos
  const mapTemplateNodes = useCallback((templateNodes: any[]): NodeType[] => {
    return templateNodes.map(node => ({
      id: node.id,
      position: node.position,
      text: node.text || "",
      type: node.type || "square",
      size: node.size || { width: 140, height: 80 },
      icon: node.icon || node.iconType || undefined,
      backgroundColor: node.backgroundColor || undefined
    }));
  }, []);

  // Convertir plantilla a conexiones
  const mapTemplateConnections = useCallback((templateConnections: any[]): ConnectionType[] => {
    return templateConnections.map(conn => ({
      id: conn.id,
      sourceId: conn.sourceId,
      targetId: conn.targetId,
      sourcePosition: conn.sourcePosition,
      targetPosition: conn.targetPosition,
      sourceX: conn.sourceX,
      sourceY: conn.sourceY,
      targetX: conn.targetX,
      targetY: conn.targetY,
      style: conn.style || 'solid',
      animation: conn.animation || 'none',
      startArrowHead: conn.startArrowHead || 'none',
      endArrowHead: conn.endArrowHead || 'arrow',
      color: conn.color || '#000000',
      strokeWidth: conn.strokeWidth || 2
    }));
  }, []);

  // Cargar una plantilla predefinida
  const loadTemplate = useCallback((
    template: TemplateType
  ) => {
    try {
      const templateNodes = mapTemplateNodes(template.nodes);
      const templateConnections = mapTemplateConnections(template.connections);
      
      setNodes(templateNodes);
      setConnections(templateConnections);
      
      if (template.viewport) {
        setViewport(template.viewport);
      }
      
      setShowTemplatesModal(false);
      logDebug(`Plantilla "${template.name}" cargada correctamente`);
    } catch (error) {
      console.error('Error al cargar plantilla:', error);
      logDebug('Error al cargar plantilla');
    }
  }, [setNodes, setConnections, setViewport, mapTemplateNodes, mapTemplateConnections, logDebug]);

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
    mapTemplateConnections
  };
} 