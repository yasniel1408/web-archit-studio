"use client";

import React, { useState } from "react";

import { Header } from "@/app/components/atoms/header/header";
import { MobileSidebar } from "@/app/components/molecules/mobile-sidebar/mobile-sidebar";
import { DiagramCanvas } from "@/app/components/organisms/diagram-canvas/diagram-canvas";
import { SidePanel } from "@/app/components/organisms/side-panel/side-panel";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useMobileMenu } from "@/hooks/useMobileMenu";

export default function Home() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu();
  const [canvasToolbarProps, setCanvasToolbarProps] = useState<any>(null);

  // Hook para trackear usuarios automáticamente
  useAnalytics();

  console.log("🏠 Página principal cargada - Analytics hook iniciado");

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Header responsive */}
      <Header
        onMenuToggle={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        canvasToolbarProps={canvasToolbarProps}
      />

      {/* Layout principal */}
      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar para desktop */}
        <div className="hidden w-64 flex-col border-r border-border/30 bg-white md:flex">
          <div className="flex-1 overflow-auto">
            <SidePanel />
          </div>
        </div>

        {/* Sidebar móvil (overlay) */}
        <MobileSidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

        {/* Canvas de diagrama - responsive */}
        <div className="flex-1 overflow-hidden">
          <DiagramCanvas onToolbarPropsChange={setCanvasToolbarProps} />
        </div>
      </main>
    </div>
  );
}
