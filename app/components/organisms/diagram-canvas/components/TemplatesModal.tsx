import React, { useMemo, useState } from "react";

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

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "c4" | "cloud" | "data" | "platform">(
    "all",
  );

  const getTemplateCategory = (template: TemplateType): "c4" | "cloud" | "data" | "platform" => {
    const haystack = `${template.id} ${template.name} ${template.description}`.toLowerCase();

    if (haystack.includes("c4") || haystack.includes("component") || haystack.includes("container")) {
      return "c4";
    }

    if (haystack.includes("ml") || haystack.includes("iot") || haystack.includes("analytics")) {
      return "data";
    }

    if (haystack.includes("kubernetes") || haystack.includes("microservices") || haystack.includes("cqrs")) {
      return "platform";
    }

    return "cloud";
  };

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return templates.filter((template) => {
      const category = getTemplateCategory(template);
      const matchesCategory = activeCategory === "all" || category === activeCategory;

      if (!normalizedQuery) return matchesCategory;

      const matchesQuery = [template.name, template.description, template.id]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [templates, query, activeCategory]);

  const categoryPillClass = (category: typeof activeCategory) =>
    `rounded-full px-3 py-1 text-xs font-medium transition-all ${
      activeCategory === category
        ? "bg-blue-600 text-white shadow-sm"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Plantillas de Diagrama"
      size="large"
      className={className}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-3">
          <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, patrón o tecnología..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 lg:max-w-sm"
            />

            <div className="flex flex-wrap gap-2">
              <button type="button" className={categoryPillClass("all")} onClick={() => setActiveCategory("all")}>
                Todas
              </button>
              <button type="button" className={categoryPillClass("c4")} onClick={() => setActiveCategory("c4")}>
                C4
              </button>
              <button
                type="button"
                className={categoryPillClass("platform")}
                onClick={() => setActiveCategory("platform")}
              >
                Plataformas
              </button>
              <button type="button" className={categoryPillClass("cloud")} onClick={() => setActiveCategory("cloud")}>
                Cloud
              </button>
              <button type="button" className={categoryPillClass("data")} onClick={() => setActiveCategory("data")}>
                Data/AI/IoT
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600">
            Mostrando <span className="font-semibold text-slate-800">{filteredTemplates.length}</span> de{" "}
            <span className="font-semibold text-slate-800">{templates.length}</span> plantillas disponibles.
          </p>
        </div>

        <div className="grid max-h-[60vh] grid-cols-1 gap-4 overflow-auto md:grid-cols-2">
          {filteredTemplates.map((template) => {
            const category = getTemplateCategory(template);

            return (
            <div
              key={template.id}
              className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              onClick={() => handleSelect && handleSelect(template)}
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium">{template.name}</h4>
                <span className="ml-2 rounded bg-gray-100 px-2 py-1 text-xs">
                  v{template.version}
                </span>
              </div>

              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                  {category}
                </span>
                <span className="text-xs text-slate-500">{template.id}</span>
              </div>

              <p className="mb-3 text-sm text-gray-600">{template.description}</p>

              <div className="flex h-32 items-center justify-center overflow-hidden rounded border border-slate-200 bg-gray-50">
                {template.image ? (
                  <img
                    src={template.image}
                    alt={template.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
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
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            No hay plantillas para esa búsqueda/filtro. Prueba con otra categoría o términos más generales.
          </div>
        )}

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
