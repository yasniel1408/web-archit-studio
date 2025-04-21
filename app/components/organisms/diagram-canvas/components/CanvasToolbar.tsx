import React from 'react';

type CanvasToolbarProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onExport: () => void;
  onExportGif: () => void;
  onImport: () => void;
  onShowJson: () => void;
  onShowTemplates: () => void;
  scale: number;
};

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  onExport,
  onExportGif,
  onImport,
  onShowJson,
  onShowTemplates,
  scale
}) => {
  return (
    <div className="flex items-center gap-2 mb-2 p-2 bg-white border rounded shadow-sm">
      <div className="flex items-center mr-4">
        <button
          className="p-1 rounded hover:bg-gray-100"
          onClick={onZoomOut}
          title="Reducir zoom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
          </svg>
        </button>
        
        <span className="mx-2 text-xs font-mono">
          {Math.round(scale * 100)}%
        </span>
        
        <button
          className="p-1 rounded hover:bg-gray-100"
          onClick={onZoomIn}
          title="Aumentar zoom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
          </svg>
        </button>
        
        <button
          className="p-1 ml-2 rounded hover:bg-gray-100"
          onClick={onResetView}
          title="Restablecer vista"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
          </svg>
        </button>
      </div>
      
      <div className="flex items-center gap-1 border-l pl-4">
        <button
          className="px-2 py-1 text-xs rounded hover:bg-gray-100"
          onClick={onImport}
          title="Importar diagrama"
        >
          Importar
        </button>
        
        <button
          className="px-2 py-1 text-xs rounded hover:bg-gray-100"
          onClick={onExport}
          title="Exportar diagrama como JSON"
        >
          Exportar JSON
        </button>
        
        <button
          className="px-2 py-1 text-xs rounded hover:bg-gray-100 text-primary"
          onClick={onExportGif}
          title="Exportar diagrama animado como GIF (5 segundos / 30 FPS)"
        >
          Exportar GIF (Animado)
        </button>
        
        <button
          className="px-2 py-1 text-xs rounded hover:bg-gray-100"
          onClick={onShowJson}
          title="Ver JSON"
        >
          Ver JSON
        </button>
        
        <button
          className="px-2 py-1 text-xs rounded hover:bg-gray-100"
          onClick={onShowTemplates}
          title="Plantillas"
        >
          Plantillas
        </button>
      </div>
    </div>
  );
}; 