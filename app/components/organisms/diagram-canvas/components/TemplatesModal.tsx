import React from "react";

import { Modal } from "@/app/components/atoms/modal";

import { TemplateType } from "../types";

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
  className = "",
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
      <div className="flex h-full flex-col">
        <div className="grid max-h-[60vh] grid-cols-1 gap-4 overflow-auto md:grid-cols-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className="cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md"
              onClick={() => handleSelect && handleSelect(template)}
            >
              <div className="mb-2 flex items-center">
                <h4 className="font-medium">{template.name}</h4>
                <span className="ml-2 rounded bg-gray-100 px-2 py-1 text-xs">
                  v{template.version}
                </span>
              </div>

              <p className="mb-3 text-sm text-gray-600">{template.description}</p>

              <div className="flex h-32 items-center justify-center overflow-hidden rounded border bg-gray-50">
                {template.image ? (
                  <img
                    src={template.image}
                    alt={template.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-xs text-gray-400">Vista previa no disponible</div>
                )}
              </div>

              <div className="mt-3 flex justify-between text-xs text-gray-500">
                <span>{template.nodes.length} nodos</span>
                <span>{template.connections.length} conexiones</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
};
