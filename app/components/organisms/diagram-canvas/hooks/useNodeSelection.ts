"use client";

import { useCallback, useState, useRef, useEffect } from 'react';

interface UseNodeSelectionConfig {
  logDebug: (message: string) => void;
}

export function useNodeSelection({ logDebug }: UseNodeSelectionConfig) {
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const selectionBoxRef = useRef<{ startX: number; startY: number; isActive: boolean }>({ 
    startX: 0, 
    startY: 0, 
    isActive: false 
  });

  // Seleccionar/deseleccionar un nodo individual
  const toggleNodeSelection = useCallback((nodeId: string, isMultiSelect: boolean = false) => {
    setSelectedNodeIds(prev => {
      if (isMultiSelect) {
        // Multi-selección con Ctrl/Cmd
        if (prev.includes(nodeId)) {
          // Deseleccionar si ya estaba seleccionado
          return prev.filter(id => id !== nodeId);
        } else {
          // Agregar a la selección
          return [...prev, nodeId];
        }
      } else {
        // Selección simple
        if (prev.length === 1 && prev[0] === nodeId) {
          // Si es el único seleccionado, deseleccionar
          return [];
        } else {
          // Seleccionar solo este nodo
          return [nodeId];
        }
      }
    });
  }, []);

  // Seleccionar un nodo específico (forzar selección)
  const selectNode = useCallback((nodeId: string, isMultiSelect: boolean = false) => {
    setSelectedNodeIds(prev => {
      if (isMultiSelect) {
        if (!prev.includes(nodeId)) {
          return [...prev, nodeId];
        }
        return prev;
      } else {
        return [nodeId];
      }
    });
  }, []);

  // Deseleccionar un nodo específico
  const deselectNode = useCallback((nodeId: string) => {
    setSelectedNodeIds(prev => prev.filter(id => id !== nodeId));
  }, []);

  // Seleccionar múltiples nodos
  const selectMultipleNodes = useCallback((nodeIds: string[], replace: boolean = true) => {
    setSelectedNodeIds(prev => {
      if (replace) {
        return [...nodeIds];
      } else {
        const newIds = nodeIds.filter(id => !prev.includes(id));
        return [...prev, ...newIds];
      }
    });
  }, []);

  // Limpiar selección
  const clearSelection = useCallback(() => {
    setSelectedNodeIds([]);
  }, []);

  // Verificar si un nodo está seleccionado
  const isNodeSelected = useCallback((nodeId: string) => {
    return selectedNodeIds.includes(nodeId);
  }, [selectedNodeIds]);

  // Obtener el primer nodo seleccionado
  const getFirstSelectedNode = useCallback(() => {
    return selectedNodeIds.length > 0 ? selectedNodeIds[0] : null;
  }, [selectedNodeIds]);

  // Manejar click en el canvas (deseleccionar si no hay nodo clickeado)
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Si el click fue en el canvas vacío (no en un nodo)
    const isClickOnCanvas = target === e.currentTarget || 
                           target.hasAttribute('data-diagram-export') ||
                           target.hasAttribute('data-diagram-transform');
    
    if (isClickOnCanvas && !e.ctrlKey && !e.metaKey) {
      clearSelection();
      logDebug('Selección limpiada por click en canvas vacío');
    }
  }, [clearSelection, logDebug]);

  // Manejar teclas para selección
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Solo procesar si no estamos escribiendo en un input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Escape') {
        clearSelection();
        logDebug('Selección limpiada con Escape');
      } else if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        // Aquí podríamos seleccionar todos los nodos, pero necesitaríamos la lista de nodos
        logDebug('Seleccionar todos (no implementado aún)');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection, logDebug]);

  // Información sobre la selección actual
  const selectionInfo = {
    count: selectedNodeIds.length,
    hasSelection: selectedNodeIds.length > 0,
    isMultipleSelection: selectedNodeIds.length > 1,
    selectedIds: selectedNodeIds
  };

  return {
    selectedNodeIds,
    toggleNodeSelection,
    selectNode,
    deselectNode,
    selectMultipleNodes,
    clearSelection,
    isNodeSelected,
    getFirstSelectedNode,
    handleCanvasClick,
    selectionInfo
  };
} 