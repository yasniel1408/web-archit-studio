import * as Mp4Muxer from "mp4-muxer";
import { useCallback } from "react";

interface ExportOptions {
  fps?: number;
  duration?: number;
  quality?: "low" | "medium" | "high";
}

export function useModernGifExport() {
  const exportToModernGif = useCallback(
    async (
      diagramRef: React.RefObject<HTMLDivElement>,
      _viewportData?: { scale: number; position: { x: number; y: number } },
      options: ExportOptions = {}
    ) => {
      try {
        const { fps = 30, duration = 4, quality = "medium" } = options;

        if (!diagramRef.current) {
          throw new Error("No se pudo encontrar el elemento del diagrama para exportar");
        }

        // Verificar soporte de WebCodecs
        if (!("VideoEncoder" in window)) {
          throw new Error(
            "WebCodecs API no está soportada en este navegador. Usa Chrome 94+ o Edge 94+"
          );
        }

        const diagramContainer = diagramRef.current;
        const qualitySettings = {
          low: { scale: 0.5, bitrate: 500_000 },
          medium: { scale: 0.75, bitrate: 1_000_000 },
          high: { scale: 1, bitrate: 2_000_000 },
        };

        const settings = qualitySettings[quality];
        const containerWidth = diagramContainer.clientWidth;
        const containerHeight = diagramContainer.clientHeight;

        // H.264 requiere dimensiones pares (divisibles por 2)
        const ensureEven = (num: number): number => Math.floor(num / 2) * 2;

        // Función para ajustar resolución según límites AVC
        const getOptimalResolution = (width: number, height: number) => {
          // Límites máximos para diferentes niveles AVC
          const avcLimits = {
            level3_0: 414720, // 720x576 aproximadamente
            level3_1: 921600, // 1280x720
            level4_0: 2073600, // 1920x1080
          };

          let targetWidth = ensureEven(width * settings.scale);
          let targetHeight = ensureEven(height * settings.scale);
          const currentArea = targetWidth * targetHeight;

          // Si excede nivel 3.1, usar nivel 4.0 (más común)
          if (currentArea > avcLimits.level3_1) {
            if (currentArea > avcLimits.level4_0) {
              // Reducir a 1920x1080 máximo
              const maxArea = avcLimits.level4_0;
              const scaleFactor = Math.sqrt(maxArea / currentArea);
              const originalWidth = targetWidth;
              const originalHeight = targetHeight;
              targetWidth = ensureEven(targetWidth * scaleFactor);
              targetHeight = ensureEven(targetHeight * scaleFactor);
              console.log(
                `⚠️  Resolución reducida: ${originalWidth}x${originalHeight} → ${targetWidth}x${targetHeight} (excedía límites AVC 4.0)`
              );
            }
            return {
              width: targetWidth,
              height: targetHeight,
              level: "4.0",
              codec: "avc1.640028", // Level 4.0
            };
          }

          // Si excede nivel 3.0, usar nivel 3.1
          if (currentArea > avcLimits.level3_0) {
            return {
              width: targetWidth,
              height: targetHeight,
              level: "3.1",
              codec: "avc1.4D401F", // Level 3.1
            };
          }

          // Usar nivel 3.0 por defecto
          return {
            width: targetWidth,
            height: targetHeight,
            level: "3.0",
            codec: "avc1.4D401E", // Level 3.0
          };
        };

        const resolution = getOptimalResolution(containerWidth, containerHeight);
        const scaledWidth = resolution.width;
        const scaledHeight = resolution.height;

        // Crear progress indicator moderno
        const progressContainer = document.createElement("div");
        progressContainer.className =
          "fixed inset-0 bg-black/50 flex items-center justify-center z-50";
        progressContainer.innerHTML = `
          <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Generando MP4 Profesional</h3>
                <p class="text-sm text-gray-500">Calidad: ${quality.toUpperCase()} | ${fps} FPS | ${duration}s</p>
              </div>
            </div>
            
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Progreso</span>
                <span class="font-semibold text-blue-600" id="progress-text">0%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div id="progress-bar" class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500">
                <span>Resolución: ${scaledWidth}x${scaledHeight}</span>
                <span>Bitrate: ${settings.bitrate / 1000}kbps</span>
              </div>
            </div>
          </div>
        `;

        document.body.appendChild(progressContainer);

        const updateProgress = (percentage: number, status: string) => {
          const progressBar = document.getElementById("progress-bar");
          const progressText = document.getElementById("progress-text");
          if (progressBar && progressText) {
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${percentage}% - ${status}`;
          }
        };

        updateProgress(10, "Inicializando...");

        // Configurar muxer MP4
        const muxer = new Mp4Muxer.Muxer({
          target: new Mp4Muxer.ArrayBufferTarget(),
          video: {
            codec: "avc",
            width: scaledWidth,
            height: scaledHeight,
          },
          firstTimestampBehavior: "offset",
          fastStart: "in-memory",
        });

        updateProgress(20, "Configurando encoder...");

        // Configurar encoder de video
        const videoEncoder = new VideoEncoder({
          output: (chunk: EncodedVideoChunk, meta?: EncodedVideoChunkMetadata) => {
            muxer.addVideoChunk(chunk, meta);
          },
          error: (error: Error) => {
            throw error;
          },
        });

        console.log(
          `📹 Configurando encoder: ${scaledWidth}x${scaledHeight} (${scaledWidth * scaledHeight} pixels) - Nivel AVC ${resolution.level}`
        );

        videoEncoder.configure({
          codec: resolution.codec, // Nivel AVC dinámico
          width: scaledWidth,
          height: scaledHeight,
          bitrate: settings.bitrate,
          framerate: fps,
        });

        updateProgress(30, "Capturando frames...");

        // Generar frames
        const totalFrames = fps * duration;
        const canvas = document.createElement("canvas");
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
        const ctx = canvas.getContext("2d")!;

        // Crear canvas temporal para captura
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = scaledWidth;
        tempCanvas.height = scaledHeight;
        const tempCtx = tempCanvas.getContext("2d")!;

        // Importar html2canvas dinámicamente
        const html2canvas = await import("html2canvas");

        for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
          const progress = frameIndex / totalFrames;
          const captureProgress = 30 + progress * 50;
          updateProgress(Math.round(captureProgress), `Frame ${frameIndex + 1}/${totalFrames}`);

          // Capturar el diagrama actual
          const captureCanvas = await html2canvas.default(diagramContainer, {
            width: scaledWidth,
            height: scaledHeight,
            scale: settings.scale,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
          });

          // Dibujar en canvas temporal con efectos
          tempCtx.clearRect(0, 0, scaledWidth, scaledHeight);
          tempCtx.fillStyle = "#ffffff";
          tempCtx.fillRect(0, 0, scaledWidth, scaledHeight);

          // Aplicar efectos de animación basados en el frame
          const animationProgress = frameIndex / totalFrames;

          // Efecto de entrada suave
          if (animationProgress < 0.1) {
            const fadeIn = animationProgress / 0.1;
            tempCtx.globalAlpha = fadeIn;
          } else if (animationProgress > 0.9) {
            const fadeOut = 1 - (animationProgress - 0.9) / 0.1;
            tempCtx.globalAlpha = fadeOut;
          } else {
            tempCtx.globalAlpha = 1;
          }

          // Efecto de zoom sutil
          const zoomFactor = 1 + Math.sin(animationProgress * Math.PI * 2) * 0.02;
          const offsetX = (scaledWidth * (1 - zoomFactor)) / 2;
          const offsetY = (scaledHeight * (1 - zoomFactor)) / 2;

          tempCtx.save();
          tempCtx.translate(offsetX, offsetY);
          tempCtx.scale(zoomFactor, zoomFactor);
          tempCtx.drawImage(captureCanvas, 0, 0);
          tempCtx.restore();

          // Copiar al canvas principal
          ctx.clearRect(0, 0, scaledWidth, scaledHeight);
          ctx.drawImage(tempCanvas, 0, 0);

          // Crear VideoFrame
          const videoFrame = new VideoFrame(canvas, {
            timestamp: (frameIndex * 1_000_000) / fps,
            duration: 1_000_000 / fps,
          });

          // Encode frame
          videoEncoder.encode(videoFrame, {
            keyFrame: frameIndex % 30 === 0,
          });
          videoFrame.close();

          // Pequeña pausa para no bloquear el UI
          await new Promise((resolve) => setTimeout(resolve, 10));
        }

        updateProgress(80, "Finalizando encoding...");

        // Finalizar encoding
        await videoEncoder.flush();
        videoEncoder.close();

        updateProgress(90, "Generando archivo...");

        // Finalizar muxing
        muxer.finalize();
        const buffer = (muxer.target as Mp4Muxer.ArrayBufferTarget).buffer;

        updateProgress(100, "¡Completado!");

        // Crear y descargar archivo
        const blob = new Blob([buffer], { type: "video/mp4" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `diagrama-${Date.now()}.mp4`;
        link.click();
        URL.revokeObjectURL(url);

        // Limpiar
        document.body.removeChild(progressContainer);

        return { success: true, message: "MP4 generado exitosamente" };
      } catch (error) {
        // Limpiar progress si existe
        const progressContainer = document.querySelector(".fixed.inset-0");
        if (progressContainer) {
          document.body.removeChild(progressContainer);
        }

        console.error("Error al generar MP4:", error);
        return {
          success: false,
          message: error instanceof Error ? error.message : "Error desconocido al generar MP4",
        };
      }
    },
    []
  );

  return { exportToModernGif };
}
