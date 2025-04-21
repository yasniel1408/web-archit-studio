import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  NodeType, 
  ConnectionType, 
  ViewportType, 
  DiagramDataType,
  TemplateType
} from '../types';

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
    importDiagram,
    triggerFileInput,
    showDiagramJson,
    copyJsonToClipboard,
    loadTemplate,
    mapTemplateNodes,
    mapTemplateConnections
  };
} 