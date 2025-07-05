/**
 * Configuración centralizada de la aplicación
 * Todas las variables de entorno y configuraciones deben definirse aquí
 */

export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "ArchitStudio",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.1.0",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    debug: process.env.NEXT_PUBLIC_DEBUG === "true",
  },

  environment: {
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
    isTest: process.env.NODE_ENV === "test",
  },

  features: {
    analytics: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
    errorReporting: process.env.NEXT_PUBLIC_ERROR_REPORTING === "true",
    debugPanel: process.env.NEXT_PUBLIC_DEBUG_PANEL === "true",
  },

  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
  },

  monitoring: {
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },

  ads: {
    adsenseId: process.env.NEXT_PUBLIC_ADSENSE_ID || "",
    enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
  },

  storage: {
    localStorage: {
      prefix: "architstudio_",
      version: "v1",
    },
  },

  ui: {
    toast: {
      position: "top-right" as const,
      duration: 5000,
      maxToasts: 5,
    },
    animation: {
      duration: 300,
      ease: "easeInOut" as const,
    },
  },

  canvas: {
    defaultZoom: 1,
    minZoom: 0.1,
    maxZoom: 3,
    gridSize: 20,
    autosaveInterval: 30000, // 30 segundos
  },

  performance: {
    debounceDelay: 300,
    throttleDelay: 100,
    maxUndoHistory: 50,
  },
} as const;

// Helper para obtener configuración tipada
export const getConfig = () => config;

// Validar configuración crítica
export const validateConfig = () => {
  const errors: string[] = [];

  if (!config.app.name) {
    errors.push("APP_NAME is required");
  }

  if (!config.app.version) {
    errors.push("APP_VERSION is required");
  }

  if (config.environment.isProduction) {
    if (!config.monitoring.sentryDsn) {
      console.warn("SENTRY_DSN not configured for production");
    }

    if (!config.analytics.googleAnalyticsId) {
      console.warn("Google Analytics not configured for production");
    }
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed: ${errors.join(", ")}`);
  }

  return true;
};

// Inicializar validación en desarrollo
if (config.environment.isDevelopment) {
  try {
    validateConfig();
    console.log("✅ Configuración validada correctamente");
  } catch (error) {
    console.error("❌ Error en la configuración:", error);
  }
}
