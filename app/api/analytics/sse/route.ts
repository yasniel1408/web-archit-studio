import { NextRequest } from "next/server";

// Mapa para almacenar usuarios conectados
const connectedUsers = new Map();
const adminConnections = new Set<ReadableStreamDefaultController>();

// Configuración de timeouts
const INACTIVE_TIMEOUT = 15000; // 15 segundos para detectar inactividad
const CLEANUP_INTERVAL = 5000; // Limpiar cada 5 segundos

// Función para limpiar usuarios inactivos
function cleanupInactiveUsers() {
  const now = Date.now();
  const usersToRemove = [];

  for (const [id, user] of connectedUsers.entries()) {
    if (user.lastActivity && now - user.lastActivity > INACTIVE_TIMEOUT) {
      usersToRemove.push(id);
    }
  }

  // Remover usuarios inactivos y notificar
  usersToRemove.forEach((userId) => {
    connectedUsers.delete(userId);

    // Notificar a todos los admins sobre la desconexión por timeout
    broadcastToAdmins({
      type: "user_disconnected",
      data: { userId, reason: "timeout" },
    });
  });

  if (usersToRemove.length > 0) {
    console.log(`Limpiados ${usersToRemove.length} usuarios inactivos`);
  }
}

// Iniciar limpieza automática
void setInterval(cleanupInactiveUsers, CLEANUP_INTERVAL);

// Funciones auxiliares
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "127.0.0.1";
  }

  if (realIP) {
    return realIP;
  }

  return "127.0.0.1";
}

function getLocationFromIP(_ip: string): string {
  // Simulación de geolocalización
  const locations = [
    "Madrid, España",
    "Barcelona, España",
    "Valencia, España",
    "Sevilla, España",
    "Ciudad de México, México",
    "Buenos Aires, Argentina",
    "Lima, Perú",
    "Bogotá, Colombia",
  ];

  return locations[Math.floor(Math.random() * locations.length)] || "Madrid, España";
}

function broadcastToAdmins(data: any) {
  adminConnections.forEach((controller) => {
    try {
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
    } catch (error) {
      console.error("Error broadcasting to admin:", error);
    }
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";

  if (isAdmin) {
    // Conexión SSE para admins
    const stream = new ReadableStream({
      start(controller) {
        adminConnections.add(controller);

        // Enviar datos iniciales
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({
              type: "initial_data",
              data: {
                activeUsers: Array.from(connectedUsers.values()),
                totalConnections: connectedUsers.size,
              },
            })}\n\n`
          )
        );

        // Cleanup al cerrar la conexión
        request.signal.addEventListener("abort", () => {
          adminConnections.delete(controller);
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // Respuesta normal para usuarios (no admin)
  return new Response(JSON.stringify({ status: "ok" }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, userAgent } = body;

    if (action === "connect") {
      console.log("🔄 API: Registrando conexión para usuario:", userId);

      const userInfo = {
        id: userId,
        ip: getClientIP(request),
        userAgent: userAgent || "Unknown",
        location: getLocationFromIP(getClientIP(request)),
        connectedAt: new Date().toISOString(),
        lastActivity: Date.now(),
        isActive: true,
      };

      connectedUsers.set(userId, userInfo);
      console.log("✅ API: Usuario conectado:", userInfo);
      console.log("📊 API: Total usuarios conectados:", connectedUsers.size);

      // Notificar a todos los admins
      broadcastToAdmins({
        type: "user_connected",
        data: userInfo,
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (action === "disconnect") {
      if (connectedUsers.has(userId)) {
        connectedUsers.delete(userId);

        // Notificar a todos los admins sobre la desconexión inmediata
        broadcastToAdmins({
          type: "user_disconnected",
          data: { userId, reason: "page_closed" },
        });

        console.log(`Usuario ${userId} desconectado inmediatamente`);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (action === "heartbeat") {
      if (connectedUsers.has(userId)) {
        const user = connectedUsers.get(userId);
        if (user) {
          user.lastActivity = Date.now();
          connectedUsers.set(userId, user);
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing analytics request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
