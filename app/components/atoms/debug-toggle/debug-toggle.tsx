"use client";

import { BugAntIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import React from "react";

import { useDebug } from "@/app/contexts/debug-context";
import { config } from "@/lib/config";

interface DebugToggleProps {
  className?: string;
  showText?: boolean;
  compact?: boolean;
}

export const DebugToggle: React.FC<DebugToggleProps> = ({
  className,
  showText = true,
  compact = false,
}) => {
  const { showLogs, toggleLogs, logs } = useDebug();

  // Solo mostrar en desarrollo o si debug está habilitado
  if (!config.environment.isDevelopment && !config.features.debugPanel) {
    return null;
  }

  // Contar logs por nivel
  const errorCount = logs.filter((log) => log.level === "error").length;
  const hasNewErrors = errorCount > 0;

  return (
    <div className={clsx("flex items-center", className)}>
      <motion.button
        onClick={toggleLogs}
        className={clsx(
          "relative flex items-center gap-2 transition-all duration-200",
          "rounded-md border text-sm font-medium",
          compact ? "p-1.5" : "px-3 py-1.5",
          showLogs
            ? "border-blue-200 bg-blue-100 text-blue-700 hover:bg-blue-200"
            : hasNewErrors
              ? "border-red-200 bg-red-100 text-red-700 hover:bg-red-200"
              : "border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        title={showLogs ? "Ocultar debug console" : "Mostrar debug console"}
      >
        {/* Icono */}
        <div className="relative">
          <BugAntIcon className={clsx("transition-all", compact ? "h-4 w-4" : "h-4 w-4")} />

          {/* Indicador de errores */}
          {hasNewErrors && !showLogs && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"
            />
          )}

          {/* Badge con contador de logs */}
          {logs.length > 0 && showLogs && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-xs text-white"
            >
              {logs.length > 99 ? "99+" : logs.length}
            </motion.div>
          )}
        </div>

        {/* Texto */}
        {showText && !compact && <span className="text-xs">{showLogs ? "Debug ON" : "Debug"}</span>}

        {/* Indicador de estado */}
        <motion.div
          className={clsx(
            "h-2 w-2 rounded-full transition-colors",
            showLogs ? "bg-green-400" : "bg-gray-300"
          )}
          animate={{
            scale: showLogs ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.6,
            repeat: showLogs ? Infinity : 0,
            repeatType: "reverse",
          }}
        />

        {/* Efecto de pulsación para errores */}
        {hasNewErrors && !showLogs && (
          <motion.div
            className="absolute inset-0 rounded-md bg-red-200"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
      </motion.button>

      {/* Información adicional en desarrollo */}
      {config.environment.isDevelopment && showText && !compact && (
        <div className="ml-2 text-xs text-gray-500">
          {errorCount > 0 && (
            <span className="font-medium text-red-600">
              {errorCount} error{errorCount !== 1 ? "es" : ""}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Versión compacta para usar en espacios reducidos
export const DebugToggleCompact: React.FC<Omit<DebugToggleProps, "compact">> = (props) => (
  <DebugToggle {...props} compact={true} showText={false} />
);
