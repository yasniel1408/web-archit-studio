import { useEffect, useRef, useState } from "react";

interface SimpleMessage {
  id: string;
  position: number; // 0 a 100
  color: string;
  size: "small" | "medium" | "large";
  speed: number;
}

interface UseQueueAnimationProps {
  isActive?: boolean;
  speed?: "slow" | "medium" | "fast";
  maxMessages?: number;
}

export function useQueueAnimation({
  isActive = true,
  speed = "medium",
  maxMessages = 5,
}: UseQueueAnimationProps) {
  const [messages, setMessages] = useState<SimpleMessage[]>([]);
  const messageCounterRef = useRef(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Configuración estática para evitar recreación
  const speedSettings = {
    slow: { interval: 100, moveStep: 0.8, addEvery: 120 }, // Más lento
    medium: { interval: 80, moveStep: 1.2, addEvery: 100 }, // Normal
    fast: { interval: 60, moveStep: 1.8, addEvery: 80 }, // Más rápido
  };

  const settings = speedSettings[speed];

  // Colores estáticos para evitar recreación
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57"];

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setMessages([]);
      return;
    }

    // Agregar mensajes iniciales INMEDIATAMENTE
    if (messages.length === 0) {
      const initialMessages: SimpleMessage[] = [];
      for (let i = 0; i < Math.min(3, maxMessages); i++) {
        initialMessages.push({
          id: `msg-${messageCounterRef.current}`,
          position: i * 30, // Espaciados
          color: colors[i % colors.length] || "#3B82F6",
          size: "medium",
          speed: settings.moveStep,
        });
        messageCounterRef.current++;
      }
      setMessages(initialMessages);
      console.log("🚀 Mensajes iniciales creados:", initialMessages);
    }

    // Limpiar intervalo anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let frameCount = 0;

    // Crear animación súper simple
    intervalRef.current = setInterval(() => {
      frameCount++;

      setMessages((currentMessages) => {
        let newMessages = [...currentMessages];

        // Mover todas las bolitas
        newMessages = newMessages
          .map((msg) => ({
            ...msg,
            position: msg.position + settings.moveStep,
          }))
          .filter((msg) => msg.position <= 110); // Dar más margen antes de eliminar

        // Agregar nueva bolita más frecuentemente
        if (newMessages.length < maxMessages && frameCount % settings.addEvery === 0) {
          const newMessage: SimpleMessage = {
            id: `msg-${messageCounterRef.current}`,
            position: -10, // Empezar más afuera
            color: colors[messageCounterRef.current % colors.length] || "#3B82F6",
            size: "medium",
            speed: settings.moveStep,
          };
          newMessages.push(newMessage);
          messageCounterRef.current++;
          console.log("🔵 Nueva bolita creada:", newMessage);
        }

        // SIEMPRE mantener al menos una bolita visible
        if (newMessages.length === 0) {
          const rescueMessage: SimpleMessage = {
            id: `rescue-${Date.now()}`,
            position: 0,
            color: colors[0] || "#3B82F6",
            size: "medium",
            speed: settings.moveStep,
          };
          newMessages.push(rescueMessage);
          console.log("🆘 Bolita de rescate creada:", rescueMessage);
        }

        console.log("📊 Estado actual:", {
          totalMessages: newMessages.length,
          positions: newMessages.map((m) => Math.round(m.position)),
          frameCount,
          maxMessages,
          speed,
        });

        return newMessages;
      });
    }, settings.interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isActive,
    maxMessages,
    speed,
    settings.addEvery,
    settings.interval,
    settings.moveStep,
    colors,
  ]); // Dependencias correctas

  return {
    messages: messages.map((msg) => ({
      id: msg.id,
      position: Math.max(0, Math.min(100, msg.position)), // Clamp entre 0-100
      size: msg.size,
      color: msg.color,
      speed: msg.speed,
      state: "queued" as const,
      opacity: 1,
      scale: 1,
      rotation: 0,
    })),
    queueLength: messages.length,
    isProcessing: messages.some((m) => m.position > 50),
    isAnimating: isActive,
  };
}
