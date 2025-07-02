"use client";

import React, { useEffect, useRef } from 'react';
import { config } from '@/lib/config';

interface GoogleAdsProps {
  /** ID del slot del anuncio de AdSense */
  adSlot: string;
  /** Formato del anuncio (auto, rectangle, banner, etc.) */
  adFormat?: 'auto' | 'rectangle' | 'banner' | 'fluid';
  /** Layout del anuncio para responsive */
  adLayout?: string;
  /** Configuración de layout key para responsive */
  adLayoutKey?: string;
  /** Estilo personalizado para el contenedor */
  style?: React.CSSProperties;
  /** Clase CSS personalizada */
  className?: string;
  /** Texto a mostrar cuando los anuncios están deshabilitados */
  fallbackText?: string;
}

/**
 * Componente para mostrar anuncios de Google AdSense
 * Solo se muestran en producción cuando están configurados correctamente
 */
export function GoogleAds({
  adSlot,
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  style = {},
  className = '',
  fallbackText = '¡Apoya este proyecto deshabilitando tu bloqueador de anuncios!',
}: GoogleAdsProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isProduction = config.environment.isProduction;
  const adSenseId = config.ads?.adsenseId;

  useEffect(() => {
    // Solo cargar anuncios en producción y si AdSense está configurado
    if (!isProduction || !adSenseId) {
      return;
    }

    // Cargar el script de AdSense si no está cargado
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${adSenseId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Inicializar el anuncio después de un pequeño delay
    const timer = setTimeout(() => {
      try {
        if (window.adsbygoogle && adRef.current) {
          (window.adsbygoogle as any[]).push({});
        }
      } catch (error) {
        console.warn('Error loading AdSense ad:', error);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isProduction, adSenseId]);

  // No mostrar nada en desarrollo o si no está configurado AdSense
  if (!isProduction || !adSenseId) {
    return (
      <div 
        className={`bg-gray-50 border border-gray-200 rounded-lg p-4 text-center ${className}`}
        style={style}
      >
        <p className="text-xs text-gray-500 italic">
          {config.environment.isDevelopment 
            ? '🚀 Anuncio (solo visible en producción)' 
            : fallbackText
          }
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={adRef}
      className={`google-ads-container ${className}`}
      style={style}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={`ca-pub-${adSenseId}`}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        {...(adLayout && { 'data-ad-layout': adLayout })}
        {...(adLayoutKey && { 'data-ad-layout-key': adLayoutKey })}
      />
    </div>
  );
}

// Declaración de tipos para window.adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
} 