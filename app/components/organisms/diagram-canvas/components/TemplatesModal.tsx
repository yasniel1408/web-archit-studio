import React from 'react';
import { Modal } from '@/app/components/atoms/modal';
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
  // Usamos onSelect si está disponible, de lo contrario onSelectTemplate
  const handleSelect = onSelect || onSelectTemplate;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Plantillas de Diagrama"
      size="large"
      className={className}
    >
      <div className="flex flex-col h-full">
        <div className="overflow-auto grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh]">
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
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
}; 