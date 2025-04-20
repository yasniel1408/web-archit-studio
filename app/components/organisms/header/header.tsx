"use client";

import React from 'react';

interface HeaderProps {
  onSaveDiagram?: () => void;
  onExportDiagram?: () => void;
  onClearCanvas?: () => void;
}

export function Header({ onSaveDiagram, onExportDiagram, onClearCanvas }: HeaderProps) {
  return (
    <header className="bg-slate-900 text-white h-14 flex items-center px-4 border-b border-slate-700">
      <h1 className="text-xl font-semibold mr-auto">ArchitStudio</h1>
      
      <div className="flex space-x-2">
        <button
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition"
          onClick={() => {
            if (onSaveDiagram) onSaveDiagram();
            else {
              // Guardar actual en localStorage con timestamp
              const timestamp = new Date().toISOString();
              const currentDiagram = localStorage.getItem('architectDiagram');
              if (currentDiagram) {
                localStorage.setItem(`architectDiagram_${timestamp}`, currentDiagram);
                alert('Diagrama guardado correctamente');
              }
            }
          }}
        >
          Guardar
        </button>
        
        <button
          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition"
          onClick={() => {
            if (onExportDiagram) onExportDiagram();
            else {
              // Exportar como JSON
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
            }
          }}
        >
          Exportar
        </button>
        
        <button
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition"
          onClick={() => {
            if (onClearCanvas) onClearCanvas();
            else if (confirm('¿Estás seguro de que deseas limpiar el lienzo? Esta acción no se puede deshacer.')) {
              localStorage.removeItem('architectDiagram');
              window.location.reload();
            }
          }}
        >
          Limpiar
        </button>
      </div>
    </header>
  );
}
