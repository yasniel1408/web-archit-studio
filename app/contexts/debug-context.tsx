"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { ErrorHandler, AppError } from '@/lib/error-handler';
import { config } from '@/lib/config';

interface DebugLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, any>;
  source?: string;
}

interface DebugContextType {
  // Estado de visibilidad
  showLogs: boolean;
  toggleLogs: () => void;
  
  // Logs
  logs: DebugLog[];
  addLog: (level: DebugLog['level'], message: string, context?: Record<string, any>, source?: string) => void;
  clearLogs: () => void;
  
  // Configuración
  maxLogs: number;
  setMaxLogs: (max: number) => void;
  
  // Filtros
  logLevel: DebugLog['level'] | 'all';
  setLogLevel: (level: DebugLog['level'] | 'all') => void;
  
  // Métodos de conveniencia
  logInfo: (message: string, context?: Record<string, any>, source?: string) => void;
  logWarn: (message: string, context?: Record<string, any>, source?: string) => void;
  logError: (message: string, context?: Record<string, any>, source?: string) => void;
  logDebug: (message: string, context?: Record<string, any>, source?: string) => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

interface DebugProviderProps {
  children: React.ReactNode;
  initialVisible?: boolean;
}

export const DebugProvider: React.FC<DebugProviderProps> = ({ 
  children, 
  initialVisible = false 
}) => {
  const [showLogs, setShowLogs] = useState(initialVisible);
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [maxLogs, setMaxLogs] = useState(100);
  const [logLevel, setLogLevel] = useState<DebugLog['level'] | 'all'>('all');
  
  const logIdCounter = useRef(0);
  const maxLogsRef = useRef(maxLogs);
  
  // Mantener la referencia actualizada
  useEffect(() => {
    maxLogsRef.current = maxLogs;
  }, [maxLogs]);

  // Agregar log
  const addLog = useCallback((
    level: DebugLog['level'], 
    message: string, 
    context?: Record<string, any>, 
    source?: string
  ) => {
    const newLog: DebugLog = {
      id: `log-${++logIdCounter.current}`,
      timestamp: new Date(),
      level,
      message,
      ...(context && { context }),
      ...(source && { source }),
    };

    setLogs(prevLogs => {
      const updatedLogs = [...prevLogs, newLog];
      // Mantener solo los últimos maxLogs usando el valor actual
      return updatedLogs.slice(-maxLogsRef.current);
    });

    // También logear en consola si está en desarrollo
    if (config.environment.isDevelopment) {
      const consoleMethod = level === 'debug' ? 'log' : level;
      const prefix = `[${level.toUpperCase()}]`;
      const timestamp = newLog.timestamp.toLocaleTimeString();
      
      if (context || source) {
        console[consoleMethod](
          `${prefix} ${timestamp} ${source ? `[${source}]` : ''} ${message}`,
          context || ''
        );
      } else {
        console[consoleMethod](`${prefix} ${timestamp} ${message}`);
      }
    }
  }, []); // Remover maxLogs de las dependencias

  // Crear referencias estables para los métodos
  const logInfoRef = useRef((message: string, context?: Record<string, any>, source?: string) => {
    addLog('info', message, context, source);
  });

  const logWarnRef = useRef((message: string, context?: Record<string, any>, source?: string) => {
    addLog('warn', message, context, source);
  });

  const logErrorRef = useRef((message: string, context?: Record<string, any>, source?: string) => {
    addLog('error', message, context, source);
  });

  const logDebugRef = useRef((message: string, context?: Record<string, any>, source?: string) => {
    addLog('debug', message, context, source);
  });

  // Actualizar las referencias cuando addLog cambie
  useEffect(() => {
    logInfoRef.current = (message: string, context?: Record<string, any>, source?: string) => {
      addLog('info', message, context, source);
    };
    logWarnRef.current = (message: string, context?: Record<string, any>, source?: string) => {
      addLog('warn', message, context, source);
    };
    logErrorRef.current = (message: string, context?: Record<string, any>, source?: string) => {
      addLog('error', message, context, source);
    };
    logDebugRef.current = (message: string, context?: Record<string, any>, source?: string) => {
      addLog('debug', message, context, source);
    };
  }, [addLog]);

  // Métodos de conveniencia estables
  const logInfo = useCallback((message: string, context?: Record<string, any>, source?: string) => {
    logInfoRef.current(message, context, source);
  }, []);

  const logWarn = useCallback((message: string, context?: Record<string, any>, source?: string) => {
    logWarnRef.current(message, context, source);
  }, []);

  const logError = useCallback((message: string, context?: Record<string, any>, source?: string) => {
    logErrorRef.current(message, context, source);
  }, []);

  const logDebug = useCallback((message: string, context?: Record<string, any>, source?: string) => {
    logDebugRef.current(message, context, source);
  }, []);

  // Toggle de visibilidad
  const toggleLogs = useCallback(() => {
    setShowLogs(prev => {
      const newState = !prev;
      logInfoRef.current(`Panel de logs ${newState ? 'mostrado' : 'ocultado'}`, undefined, 'DebugContext');
      return newState;
    });
  }, []);

  // Limpiar logs
  const clearLogs = useCallback(() => {
    setLogs([]);
    logInfoRef.current('Logs limpiados', undefined, 'DebugContext');
  }, []);

  // Escuchar errores del sistema
  useEffect(() => {
    const unsubscribe = ErrorHandler.addErrorListener((error: AppError) => {
      addLog('error', `[Sistema] ${error.message}`, {
        errorId: error.id,
        code: error.code,
        severity: error.severity,
        ...error.context,
      }, 'ErrorHandler');
    });

    return unsubscribe;
  }, [addLog]);

  // Log inicial - solo una vez al montar
  useEffect(() => {
    logInfoRef.current('Sistema de debug inicializado', {
      maxLogs: maxLogsRef.current,
      isDevelopment: config.environment.isDevelopment,
    }, 'DebugProvider');
  }, []); // Sin dependencias para evitar bucles

  const value: DebugContextType = {
    showLogs,
    toggleLogs,
    logs,
    addLog,
    clearLogs,
    maxLogs,
    setMaxLogs,
    logLevel,
    setLogLevel,
    logInfo,
    logWarn,
    logError,
    logDebug,
  };

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug debe usarse dentro de un DebugProvider');
  }
  return context;
};

// Hook para logging rápido
export const useLogger = (source?: string) => {
  const { logInfo, logWarn, logError, logDebug } = useDebug();
  
  // Crear métodos estables que no cambien en cada render
  const logger = useMemo(() => ({
    info: (message: string, context?: Record<string, any>) => logInfo(message, context, source),
    warn: (message: string, context?: Record<string, any>) => logWarn(message, context, source),
    error: (message: string, context?: Record<string, any>) => logError(message, context, source),
    debug: (message: string, context?: Record<string, any>) => logDebug(message, context, source),
  }), [logInfo, logWarn, logError, logDebug, source]);
  
  return logger;
}; 