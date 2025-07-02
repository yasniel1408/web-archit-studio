"use client";

import { useCallback, useEffect, useRef } from 'react';
import { NodeType } from '../types';

interface UseCopyPasteConfig {
  nodes: NodeType[];
  selectedNodeIds: string[];
  addNode: (node: Omit<NodeType, 'id'>) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  scale: number;
  position: { x: number; y: number };
  logDebug: (message: string) => void;
}

interface ClipboardData {
  nodes: NodeType[];
  timestamp: number;
}

export function useCopyPaste({
  nodes,
  selectedNodeIds,
  addNode,
  canvasRef,
  scale,
  position,
  logDebug
}: UseCopyPasteConfig) {
  const clipboardRef = useRef<ClipboardData | null>(null);
  const lastMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Actualizar posición del mouse para saber dónde pegar
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const relativeY = e.clientY - rect.top;
        
        // Convertir a coordenadas del canvas
        const canvasX = (relativeX / scale) - position.x;
        const canvasY = (relativeY / scale) - position.y;
        
        lastMousePositionRef.current = { x: canvasX, y: canvasY };
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }
  }, [canvasRef, scale, position]);

  // Copiar nodos seleccionados
  const copyNodes = useCallback(() => {
    if (selectedNodeIds.length === 0) {
      logDebug('No hay nodos seleccionados para copiar');
      return;
    }

    const nodesToCopy = nodes.filter(node => selectedNodeIds.includes(node.id));
    
    if (nodesToCopy.length === 0) {
      logDebug('No se encontraron nodos válidos para copiar');
      return;
    }

    clipboardRef.current = {
      nodes: nodesToCopy.map(node => ({ ...node })), // Clonar profundo
      timestamp: Date.now()
    };

    logDebug(`${nodesToCopy.length} nodo(s) copiado(s) al portapapeles`);
    
    // Feedback visual opcional: podríamos mostrar una notificación
    console.log('📋 Nodos copiados:', nodesToCopy.map(n => n.text || n.type));
  }, [selectedNodeIds, nodes, logDebug]);

  // Pegar nodos desde el portapapeles
  const pasteNodes = useCallback(() => {
    if (!clipboardRef.current) {
      logDebug('No hay nodos en el portapapeles para pegar');
      return;
    }

    const { nodes: clipboardNodes } = clipboardRef.current;
    const pastePosition = lastMousePositionRef.current;

    // Calcular el centro de los nodos copiados para pegar relativamente
    const bounds = clipboardNodes.reduce(
      (acc, node) => ({
        minX: Math.min(acc.minX, node.position.x),
        minY: Math.min(acc.minY, node.position.y),
        maxX: Math.max(acc.maxX, node.position.x + (node.size?.width || 120)),
        maxY: Math.max(acc.maxY, node.position.y + (node.size?.height || 120))
      }),
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
    );

    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;

    // Offset para no pegar exactamente encima
    const pasteOffset = { x: 30, y: 30 };
    const targetX = pastePosition.x + pasteOffset.x;
    const targetY = pastePosition.y + pasteOffset.y;

    clipboardNodes.forEach((node, index) => {
      // Calcular nueva posición relativa al centro
      const relativeX = node.position.x - centerX;
      const relativeY = node.position.y - centerY;
      
      const newNode: Omit<NodeType, 'id'> = {
        position: {
          x: targetX + relativeX,
          y: targetY + relativeY
        },
        text: node.text ? `${node.text} (copia)` : '',
        type: node.type,
        size: node.size ? { ...node.size } : { width: 120, height: 120 },
        zIndex: (node.zIndex || 0) + 1, // Poner encima de los originales
        ...(node.backgroundColor && { backgroundColor: node.backgroundColor }),
        ...(node.icon && { icon: node.icon })
      };

      addNode(newNode);
    });

    logDebug(`${clipboardNodes.length} nodo(s) pegado(s) en posición (${Math.round(targetX)}, ${Math.round(targetY)})`);
    console.log('📄 Nodos pegados en:', { x: Math.round(targetX), y: Math.round(targetY) });
  }, [addNode, logDebug]);

  // Duplicar nodos seleccionados (atajo rápido)
  const duplicateNodes = useCallback(() => {
    copyNodes();
    // Pequeño delay para asegurar que la copia se completó
    setTimeout(pasteNodes, 10);
  }, [copyNodes, pasteNodes]);

  // Manejar atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Solo procesar si no estamos escribiendo en un input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd && e.key === 'c') {
        e.preventDefault();
        copyNodes();
      } else if (isCtrlOrCmd && e.key === 'v') {
        e.preventDefault();
        pasteNodes();
      } else if (isCtrlOrCmd && e.key === 'd') {
        e.preventDefault();
        duplicateNodes();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [copyNodes, pasteNodes, duplicateNodes]);

  // Verificar si hay algo en el portapapeles
  const hasClipboardData = useCallback(() => {
    return clipboardRef.current !== null && clipboardRef.current.nodes.length > 0;
  }, []);

  // Limpiar portapapeles
  const clearClipboard = useCallback(() => {
    clipboardRef.current = null;
    logDebug('Portapapeles limpiado');
  }, [logDebug]);

  return {
    copyNodes,
    pasteNodes,
    duplicateNodes,
    hasClipboardData,
    clearClipboard,
    clipboardCount: clipboardRef.current?.nodes.length || 0
  };
} 