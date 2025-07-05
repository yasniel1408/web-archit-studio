import { DiagramCanvas } from "@/app/components/organisms/diagram-canvas/diagram-canvas";
import { SidePanel } from "@/app/components/organisms/side-panel/side-panel";

export default function Home() {
  return (
    <main className="flex h-screen w-full">
      <div className="flex w-64 flex-col border-r border-border/30">
        {/* Nombre de la aplicación en la parte superior izquierda */}
        <div className="border-b border-border/30 bg-gradient-to-r from-primary/5 to-white px-5 py-5">
          <h1 className="flex items-center text-xl font-bold text-gray-800">
            <span className="text-primary">Archit</span>Studio
            <span className="ml-2 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              v1.2
            </span>
          </h1>
        </div>

        {/* Panel lateral */}
        <div className="flex-1 overflow-auto">
          <SidePanel />
        </div>
      </div>

      {/* Canvas de diagrama */}
      <DiagramCanvas />
    </main>
  );
}
