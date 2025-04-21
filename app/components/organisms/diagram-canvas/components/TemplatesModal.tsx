import React from 'react';
import { TemplateType } from '../types';

export type TemplatesModalProps = {
  isOpen?: boolean;
  onClose: () => void;
  templates: TemplateType[];
  onSelectTemplate?: (template: TemplateType) => void;
  onSelect?: (template: TemplateType) => void;
  className?: string;
};

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen = true,
  onClose,
  templates,
  onSelectTemplate,
  onSelect,
  className = ''
}) => {
  if (!isOpen) return null;

  // Usamos onSelect si está disponible, de lo contrario onSelectTemplate
  const handleSelect = onSelect || onSelectTemplate;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Plantillas de Diagrama</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
        
        <div className="p-4 overflow-auto grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh]">
          {templates.map(template => (
            <div 
              key={template.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleSelect && handleSelect(template)}
            >
              <div className="flex items-center mb-2">
                <h4 className="font-medium">{template.name}</h4>
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">v{template.version}</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              
              <div className="border rounded overflow-hidden bg-gray-50 h-32 flex items-center justify-center">
                {template.image ? (
                  <img 
                    src={template.image} 
                    alt={template.name} 
                    className="max-h-full max-w-full object-contain" 
                  />
                ) : (
                  <div className="text-gray-400 text-xs">Vista previa no disponible</div>
                )}
              </div>
              
              <div className="mt-3 text-xs text-gray-500 flex justify-between">
                <span>{template.nodes.length} nodos</span>
                <span>{template.connections.length} conexiones</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm mr-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}; 