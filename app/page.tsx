"use client";

import { Header } from "@/app/components/organisms/header/header";
import { SidePanel } from "@/app/components/organisms/side-panel/side-panel";
import { DiagramCanvas } from "@/app/components/organisms/diagram-canvas/diagram-canvas";

export default function Home() {
  return (
    <main className="flex flex-col h-screen w-full">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <SidePanel />
        <DiagramCanvas />
      </div>
    </main>
  );
}
