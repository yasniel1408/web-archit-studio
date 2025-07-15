import { NextRequest, NextResponse } from "next/server";

// Simulación de base de datos en memoria (en producción usarías una DB real)
const connectedUsers = new Map();
const connectionHistory = [];

export async function GET() {
  const now = Date.now();
  const activeThreshold = 60000; // 1 minuto

  // Limpiar usuarios inactivos
  for (const [id, user] of connectedUsers.entries()) {
    if (user.lastActivity && now - user.lastActivity > activeThreshold) {
      connectedUsers.delete(id);
    }
  }

  const activeUsers = Array.from(connectedUsers.values());

  return NextResponse.json({
    activeUsers,
    totalConnections: connectionHistory.length,
    currentTime: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, userAgent, ip } = body;

    if (action === "connect") {
      const userInfo = {
        id: userId,
        ip: ip || getClientIP(request),
        userAgent: userAgent || request.headers.get("user-agent"),
        connectedAt: new Date().toISOString(),
        lastActivity: Date.now(),
        isActive: true,
      };

      connectedUsers.set(userId, userInfo);
      connectionHistory.push(userInfo);

      return NextResponse.json({ success: true, user: userInfo });
    }

    if (action === "heartbeat") {
      if (connectedUsers.has(userId)) {
        const user = connectedUsers.get(userId);
        if (user) {
          user.lastActivity = Date.now();
          connectedUsers.set(userId, user);
        }
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

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
