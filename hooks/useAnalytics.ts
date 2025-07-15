import { useEffect, useRef } from "react";

export const useAnalytics = () => {
  const userIdRef = useRef<string | null>(null);
  const connectionEstablishedRef = useRef<boolean>(false);
  const disconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Generar ID único para el usuario si no existe
    if (!userIdRef.current) {
      userIdRef.current = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    console.log("🚀 useAnalytics iniciado con ID:", userIdRef.current);

    // Registrar conexión inicial
    const registerConnection = async () => {
      try {
        console.log("🔄 Registrando conexión para usuario:", userIdRef.current);
        const response = await fetch("/api/analytics/sse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "connect",
            userId: userIdRef.current,
            userAgent: navigator.userAgent,
          }),
        });

        const result = await response.json();
        console.log("✅ Conexión registrada:", result);
        connectionEstablishedRef.current = true;
      } catch (error) {
        console.error("❌ Error registering connection:", error);
      }
    };

    // Desconectar al usuario (versión síncrona para beforeunload)
    const unregisterConnection = async () => {
      if (connectionEstablishedRef.current) {
        try {
          await fetch("/api/analytics/sse", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "disconnect",
              userId: userIdRef.current,
            }),
          });
        } catch (error) {
          console.error("Error unregistering connection:", error);
        }
      }
    };

    // Desconectar inmediatamente (para eventos de cierre de pestaña)
    const unregisterConnectionSync = () => {
      if (connectionEstablishedRef.current) {
        try {
          // Usar sendBeacon para envíos síncronos durante el cierre
          const success = navigator.sendBeacon(
            "/api/analytics/sse",
            JSON.stringify({
              action: "disconnect",
              userId: userIdRef.current,
            })
          );

          if (!success) {
            // Fallback a fetch síncrono si sendBeacon falla
            fetch("/api/analytics/sse", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                action: "disconnect",
                userId: userIdRef.current,
              }),
              keepalive: true, // Mantener la conexión aunque se cierre la pestaña
            });
          }
        } catch (error) {
          console.error("Error unregistering connection (sync):", error);
        }
      }
    };

    // Enviar heartbeat cada 30 segundos
    const sendHeartbeat = async () => {
      if (connectionEstablishedRef.current) {
        try {
          await fetch("/api/analytics/sse", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "heartbeat",
              userId: userIdRef.current,
            }),
          });
        } catch (error) {
          console.error("Error sending heartbeat:", error);
        }
      }
    };

    // Manejar cierre de pestaña/ventana
    const handleBeforeUnload = () => {
      unregisterConnectionSync();
    };

    // Manejar cambio de visibilidad de la pestaña
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Solo desconectar si realmente se va a cerrar la pestaña
        // No desconectar por navegación interna
        disconnectTimeoutRef.current = setTimeout(() => {
          if (document.visibilityState === "hidden") {
            unregisterConnectionSync();
          }
        }, 2000); // Dar tiempo para navegación interna
      } else if (document.visibilityState === "visible") {
        // Cancelar desconexión si la pestaña se vuelve visible rápidamente
        if (disconnectTimeoutRef.current) {
          clearTimeout(disconnectTimeoutRef.current);
          disconnectTimeoutRef.current = null;
        }

        // La pestaña se volvió visible, reconectar solo si no hay conexión
        if (!connectionEstablishedRef.current) {
          registerConnection();
        }
      }
    };

    // Registrar conexión inmediatamente
    registerConnection();

    // Configurar heartbeat cada 10 segundos para mantener la conexión activa
    const heartbeatInterval = setInterval(sendHeartbeat, 10000);

    // Agregar listeners para detectar cierre de pestaña
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup al desmontar el componente
    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Limpiar timeout si existe
      if (disconnectTimeoutRef.current) {
        clearTimeout(disconnectTimeoutRef.current);
      }

      unregisterConnection();
    };
  }, []);

  return userIdRef.current;
};
