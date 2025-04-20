"use client";

import { useState, useRef } from 'react';
import { SidePanel } from "@/app/components/organisms/side-panel/side-panel";
import { DiagramCanvas } from "@/app/components/organisms/diagram-canvas/diagram-canvas";

export default function Home() {
  const diagramCanvasRef = useRef<HTMLDivElement | null>(null);
  const [canvasKey, setCanvasKey] = useState<number>(Date.now());

  // Implementar función para exportar como imagen
  const handleExportDiagram = () => {
    if (!diagramCanvasRef.current) return;
    
    try {
      // Intentar exportar como imagen usando html2canvas
      import('html2canvas').then(({ default: html2canvas }) => {
        if (!diagramCanvasRef.current) return;
        
        html2canvas(diagramCanvasRef.current).then((canvas) => {
          const url = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = url;
          a.download = `diagram-${new Date().toISOString()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
      }).catch(err => {
        console.error('Error al cargar html2canvas:', err);
        alert('No se pudo exportar como imagen. Exportando como JSON...');
        
        // Si falla, exportar como JSON
        const diagram = localStorage.getItem('architectDiagram');
        if (diagram) {
          const blob = new Blob([diagram], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `diagram-${new Date().toISOString()}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      });
    } catch (error) {
      console.error('Error al exportar diagrama:', error);
      alert('Error al exportar el diagrama');
    }
  };

  // Función para limpiar el lienzo
  const handleClearCanvas = () => {
    if (confirm('¿Estás seguro de que deseas limpiar el lienzo? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('architectDiagram');
      // Forzar el remontaje del componente DiagramCanvas
      setCanvasKey(Date.now());
    }
  };

  return (
    <main className="flex h-screen w-full">
      <div className="flex flex-col w-64 border-r border-border/30">
        {/* Nombre de la aplicación en la parte superior izquierda */}
        <div className="py-5 px-5 border-b border-border/30 bg-gradient-to-r from-primary/5 to-white">
          <h1 className="font-bold text-gray-800 text-xl flex items-center">
            <span className="text-primary">Archit</span>Studio
            <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">v1.0</span>
          </h1>
        </div>
        
        {/* Panel lateral */}
        <div className="flex-1 overflow-auto">
          <SidePanel />
        </div>
      </div>
      
      {/* Canvas de diagrama */}
      <DiagramCanvas key={canvasKey} />
    </main>
  );
}
