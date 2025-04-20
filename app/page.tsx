"use client";
import { SidePanel } from "@/app/components/organisms/side-panel/side-panel";
import { DiagramCanvas } from "@/app/components/organisms/diagram-canvas/diagram-canvas";

export default function Home() {

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
      <DiagramCanvas />
    </main>
  );
}
