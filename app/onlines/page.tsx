"use client";

import React, { useEffect, useState } from "react";

interface ConnectedUser {
  id: string;
  ip: string;
  userAgent: string;
  location?: string;
  connectedAt: string;
  lastActivity: number;
  isActive: boolean;
}

export default function OnlinesPage() {
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [totalConnections, setTotalConnections] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Conectar a Server-Sent Events
    const eventSource = new EventSource("/api/analytics/sse?admin=true");

    eventSource.onopen = () => {
      console.log("🔗 SSE connection opened");
      setIsConnected(true);
      setLastUpdate(new Date().toLocaleTimeString());
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📨 Recibido mensaje SSE:", data);

        if (data.type === "initial_data") {
          console.log("📊 Datos iniciales recibidos:", data.data);
          setConnectedUsers(data.data.activeUsers);
          setTotalConnections(data.data.totalConnections);
        }

        if (data.type === "user_connected") {
          console.log("👤 Usuario conectado:", data.data);
          setConnectedUsers((prev) => [...prev, data.data]);
          setTotalConnections((prev) => prev + 1);
        }

        if (data.type === "user_disconnected") {
          console.log("👤 Usuario desconectado:", data.data);
          setConnectedUsers((prev) => prev.filter((user) => user.id !== data.data.userId));
          setTotalConnections((prev) => Math.max(0, prev - 1));

          // Log del motivo de desconexión
          const reason = data.data.reason;
          console.log(`Usuario desconectado: ${data.data.userId} - Motivo: ${reason}`);
        }

        setLastUpdate(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("❌ Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      setIsConnected(false);
    };

    // Cleanup al desmontar
    return () => {
      eventSource.close();
    };
  }, []);

  const getDeviceType = (userAgent: string) => {
    if (userAgent.includes("Mobile")) return "📱 Móvil";
    if (userAgent.includes("Tablet")) return "💻 Tablet";
    return "🖥️ Desktop";
  };

  const getBrowserName = (userAgent: string) => {
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Desconocido";
  };

  const getTimeConnected = (connectedAt: string) => {
    const now = new Date();
    const connected = new Date(connectedAt);
    const diff = now.getTime() - connected.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            📊 Panel de Monitoreo - Usuarios Conectados
          </h1>
          <p className="mt-2 text-gray-600">
            Monitoreo en tiempo real de usuarios activos en tu web
          </p>
          <p className="mt-2">
            <span className="inline-flex items-center gap-1">
              <span
                className={`inline-block h-2 w-2 rounded-full ${isConnected ? "animate-pulse bg-green-500" : "bg-red-500"}`}
              ></span>
              {isConnected ? "Conectado en tiempo real" : "Desconectado"}
            </span>
          </p>
        </div>

        {/* Estadísticas */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white">
                  👥
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Usuarios Activos</div>
                <div className="text-2xl font-bold text-gray-900">{connectedUsers.length}</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
                  📈
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Conexiones</div>
                <div className="text-2xl font-bold text-gray-900">{totalConnections}</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500 text-white">
                  🔄
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Última Actualización</div>
                <div className="text-lg font-semibold text-gray-900">
                  {lastUpdate || "Iniciando..."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de usuarios conectados */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              Usuarios Conectados ({connectedUsers.length})
            </h2>
          </div>

          {connectedUsers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <div className="mb-2 text-4xl">🔍</div>
              <p>No hay usuarios conectados actualmente</p>

              {/* Botón de testing */}
              <div className="mt-4">
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch("/api/test-analytics");
                      const result = await response.json();
                      console.log("Test result:", result);
                      alert("Usuario de prueba conectado! Revisa la consola para más detalles.");
                    } catch (error) {
                      console.error("Error:", error);
                      alert("Error al conectar usuario de prueba");
                    }
                  }}
                  className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                >
                  🧪 Conectar Usuario de Prueba
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      IP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Dispositivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Navegador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Tiempo Conectado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {connectedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.id.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-mono text-sm text-gray-900">{user.ip}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.location || "Desconocida"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">{getDeviceType(user.userAgent)}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {getBrowserName(user.userAgent)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {getTimeConnected(user.connectedAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h3 className="mb-4 text-lg font-medium text-blue-900">ℹ️ Información del Sistema</h3>
          <div className="grid grid-cols-1 gap-4 text-sm text-blue-800 md:grid-cols-2">
            <div>
              <strong>Modo:</strong> Tiempo real con Server-Sent Events
            </div>
            <div>
              <strong>Actualización:</strong> Instantánea
            </div>
            <div>
              <strong>Detección de inactividad:</strong> 60 segundos
            </div>
            <div>
              <strong>Heartbeat:</strong> Cada 30 segundos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
