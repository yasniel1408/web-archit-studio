"use client";

import React, { useState } from 'react';

interface DragWrapperProps {
  id: string;
  type: string;
  text?: string;
  children: React.ReactNode;
}

export function DragWrapper({ id, type, text, children }: DragWrapperProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    // Generar un ID único para este drag-and-drop
    const uniqueId = `${id}-${Date.now()}`;
    console.log('🚀 INICIANDO ARRASTRE:', { id: uniqueId, type, text });
    
    try {
      // Configurar datos para transferir con el ID único
      const data = JSON.stringify({ id: uniqueId, type, text });
      
      // Usar múltiples formatos para mayor compatibilidad
      // Se intenta primero text/plain porque algunos navegadores tienen problemas con tipos personalizados
      e.dataTransfer.setData('text/plain', data);
      e.dataTransfer.setData('application/reactflow', data);
      e.dataTransfer.setData('application/json', data);
      
      // Registrar qué tipos de datos se han establecido
      console.log('📋 Tipos de datos establecidos:', e.dataTransfer.types);
      console.log('📋 Datos JSON:', data);
      
      // Establecer efecto de copia explícitamente
      e.dataTransfer.effectAllowed = 'copy';
      
      // Crear imagen personalizada para el arrastre (más visible)
      const dragEl = document.createElement('div');
      dragEl.innerHTML = `<div style="
        padding: 12px;
        background-color: rgba(79, 70, 229, 0.2);
        border: 2px dashed rgb(79, 70, 229);
        border-radius: 6px;
        width: 120px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(79, 70, 229);
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      ">${text || type}</div>`;
      
      document.body.appendChild(dragEl);
      e.dataTransfer.setDragImage(dragEl.firstChild as HTMLElement, 60, 25);
      
      setTimeout(() => {
        try {
          document.body.removeChild(dragEl);
        } catch (e) {
          // Si ya se removió, no hay problema
        }
      }, 0);
      
      setIsDragging(true);
      
      // Añadir clase al body para indicar que se está arrastrando
      document.body.classList.add('is-dragging');
      
      console.log('✅ Arrastre configurado exitosamente');
    } catch (error) {
      console.error('❌ Error al iniciar arrastre:', error);
    }
  };
  
  const handleDragEnd = (e: React.DragEvent) => {
    console.log('Finalizado arrastre', { id, type, dropEffect: e.dataTransfer.dropEffect });
    setIsDragging(false);
    
    // Remover clase del body
    document.body.classList.remove('is-dragging');
  };

  // También añadimos eventos de dragEnter y dragOver para mejor depuración
  const handleDragOver = (e: React.DragEvent) => {
    // Prevenir que el evento propague para no interferir con otros manejadores
    e.stopPropagation();
  };

  return (
    <div
      className={`cursor-grab ${isDragging ? 'opacity-50' : ''}`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      {children}
    </div>
  );
}
