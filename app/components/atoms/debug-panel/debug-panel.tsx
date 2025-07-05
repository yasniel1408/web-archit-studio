"use client";

import {
  ArrowDownIcon,
  ClipboardDocumentIcon,
  FunnelIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { useDebug } from "@/app/contexts/debug-context";

interface DebugPanelProps {
  className?: string;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ className }) => {
  const { showLogs, logs, logLevel, setLogLevel, clearLogs, maxLogs, setMaxLogs, toggleLogs } =
    useDebug();

  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const logsContainerRef = useRef<HTMLDivElement>(null);
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  // Filtrar logs según nivel y búsqueda
  const filteredLogs = useMemo(() => {
    let filtered = logs;

    // Filtrar por nivel
    if (logLevel !== "all") {
      filtered = filtered.filter((log) => log.level === logLevel);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(term) ||
          log.source?.toLowerCase().includes(term) ||
          JSON.stringify(log.context || {})
            .toLowerCase()
            .includes(term)
      );
    }

    return filtered;
  }, [logs, logLevel, searchTerm]);

  // Auto scroll cuando hay nuevos logs
  useEffect(() => {
    if (autoScroll && endOfLogsRef.current) {
      endOfLogsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredLogs, autoScroll]);

  // Detectar scroll manual para desactivar auto-scroll
  const handleScroll = () => {
    if (logsContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
      setAutoScroll(isAtBottom);
    }
  };

  // Copiar logs al clipboard
  const copyLogsToClipboard = async () => {
    const logsText = filteredLogs
      .map((log) => {
        const timestamp = log.timestamp.toLocaleString();
        const context = log.context ? ` | ${JSON.stringify(log.context)}` : "";
        const source = log.source ? ` [${log.source}]` : "";
        return `[${log.level.toUpperCase()}] ${timestamp}${source} - ${log.message}${context}`;
      })
      .join("\n");

    try {
      await navigator.clipboard.writeText(logsText);
      // Aquí podrías mostrar una notificación de éxito
    } catch (err) {
      console.error("Error al copiar logs:", err);
    }
  };

  // Colores por nivel
  const getLevelStyles = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warn":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "debug":
        return "bg-gray-50 border-gray-200 text-gray-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return "🔴";
      case "warn":
        return "🟡";
      case "info":
        return "🔵";
      case "debug":
        return "⚪";
      default:
        return "⚪";
    }
  };

  if (!showLogs) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={clsx(
        "fixed bottom-4 right-4 z-50 rounded-lg border border-gray-200 bg-white shadow-2xl",
        "max-w-2xl transition-all duration-200",
        isExpanded ? "h-96 w-full max-w-4xl" : "h-48 w-80",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-gray-50 p-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Debug Console</h3>
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
            {filteredLogs.length} logs
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Botón de filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx(
              "rounded p-1.5 text-xs transition-colors",
              showFilters ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
            )}
            title="Filtros"
          >
            <FunnelIcon className="h-4 w-4" />
          </button>

          {/* Botón de copiar */}
          <button
            onClick={copyLogsToClipboard}
            className="rounded p-1.5 transition-colors hover:bg-gray-200"
            title="Copiar logs"
          >
            <ClipboardDocumentIcon className="h-4 w-4" />
          </button>

          {/* Botón de limpiar */}
          <button
            onClick={clearLogs}
            className="rounded p-1.5 text-red-600 transition-colors hover:bg-red-100"
            title="Limpiar logs"
          >
            <TrashIcon className="h-4 w-4" />
          </button>

          {/* Botón de expandir */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded p-1.5 transition-colors hover:bg-gray-200"
            title={isExpanded ? "Contraer" : "Expandir"}
          >
            <ArrowDownIcon
              className={clsx("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
            />
          </button>

          {/* Botón de cerrar */}
          <button
            onClick={toggleLogs}
            className="rounded p-1.5 transition-colors hover:bg-gray-200"
            title="Cerrar"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-200 bg-gray-50 px-3 py-2"
          >
            <div className="flex items-center gap-3 text-sm">
              {/* Filtro de nivel */}
              <div className="flex items-center gap-2">
                <label className="text-gray-600">Nivel:</label>
                <select
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value as any)}
                  className="rounded border border-gray-300 px-2 py-1 text-xs"
                >
                  <option value="all">Todos</option>
                  <option value="error">Error</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </select>
              </div>

              {/* Búsqueda */}
              <div className="flex items-center gap-2">
                <label className="text-gray-600">Buscar:</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar en logs..."
                  className="w-32 rounded border border-gray-300 px-2 py-1 text-xs"
                />
              </div>

              {/* Max logs */}
              <div className="flex items-center gap-2">
                <label className="text-gray-600">Max:</label>
                <input
                  type="number"
                  value={maxLogs}
                  onChange={(e) => setMaxLogs(parseInt(e.target.value) || 100)}
                  min="10"
                  max="1000"
                  className="w-16 rounded border border-gray-300 px-2 py-1 text-xs"
                />
              </div>

              {/* Auto scroll */}
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="h-3 w-3"
                />
                Auto scroll
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logs container */}
      <div
        ref={logsContainerRef}
        onScroll={handleScroll}
        className="flex-1 space-y-1 overflow-y-auto p-3 font-mono text-xs"
        style={{ height: isExpanded ? "300px" : "120px" }}
      >
        {filteredLogs.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            {searchTerm || logLevel !== "all"
              ? "No hay logs que coincidan con los filtros"
              : "No hay logs aún"}
          </div>
        ) : (
          filteredLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={clsx("rounded border p-2 text-xs", getLevelStyles(log.level))}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm">{getLevelIcon(log.level)}</span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold">{log.timestamp.toLocaleTimeString()}</span>
                    {log.source && (
                      <span className="rounded bg-black/10 px-1 text-xs">{log.source}</span>
                    )}
                  </div>
                  <div className="break-words">{log.message}</div>
                  {log.context && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs opacity-70 hover:opacity-100">
                        Ver contexto
                      </summary>
                      <pre className="mt-1 overflow-x-auto rounded bg-black/5 p-1 text-xs">
                        {JSON.stringify(log.context, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
        <div ref={endOfLogsRef} />
      </div>
    </motion.div>
  );
};
