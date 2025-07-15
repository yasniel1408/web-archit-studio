import { NextResponse } from "next/server";

export async function GET() {
  // Simular un usuario conectándose
  try {
    const testUser = {
      id: `test-user-${Date.now()}`,
      userAgent: "Test Browser",
    };

    // Instrucciones para el usuario
    return NextResponse.json({
      message: "Endpoint de testing funcionando correctamente",
      testUser,
      instructions: [
        "1. Abre la página principal (/) en una nueva pestaña",
        "2. Abre la consola del navegador (F12)",
        "3. Verifica que aparezcan logs de analytics",
        "4. Vuelve a /onlines para ver si apareces conectado",
      ],
      debugInfo: {
        timestamp: new Date().toISOString(),
        status: "OK",
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: "Error in test endpoint",
      details: error,
    });
  }
}
