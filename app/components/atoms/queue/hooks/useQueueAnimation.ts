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
      // Crear mensajes iniciales basados en maxMessages (mostrar hasta 80% del máximo)
      const initialCount = Math.min(Math.ceil(maxMessages * 0.8), maxMessages);
      for (let i = 0; i < initialCount; i++) {
        initialMessages.push({
          id: `msg-${messageCounterRef.current}`,
          position: i * (80 / initialCount), // Distribuir en el 80% del track
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

        // Agregar nueva bolita si hay espacio (respetando maxMessages)
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

        // Mantener al menos 1 mensaje si maxMessages > 0
        if (newMessages.length === 0 && maxMessages > 0) {
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

        return newMessages;
      });
    }, settings.interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, maxMessages, speed, settings.addEvery, settings.interval, settings.moveStep, colors]);

  // Efecto para ajustar mensajes cuando cambia maxMessages
  useEffect(() => {
    if (!isActive) return;

    setMessages((currentMessages) => {
      // Si hay más mensajes de los permitidos, remover los extras
      if (currentMessages.length > maxMessages) {
        return currentMessages.slice(0, maxMessages);
      }
      // Si hay menos mensajes, agregar más hasta llegar al 80% del máximo
      else if (currentMessages.length < Math.ceil(maxMessages * 0.6)) {
        const newMessages = [...currentMessages];
        const targetCount = Math.ceil(maxMessages * 0.8);
        
        while (newMessages.length < targetCount && newMessages.length < maxMessages) {
          newMessages.push({
            id: `msg-${messageCounterRef.current}`,
            position: Math.random() * 80, // Posición aleatoria en el track
            color: colors[messageCounterRef.current % colors.length] || "#3B82F6",
            size: "medium",
            speed: settings.moveStep,
          });
          messageCounterRef.current++;
        }
        
        return newMessages;
      }
      
      return currentMessages;
    });
  }, [maxMessages, isActive, colors, settings.moveStep]);

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
