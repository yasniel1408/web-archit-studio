export interface AppError {
  id: string;
  message: string;
  code: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  context?: Record<string, any>;
  stack?: string;
}

export class ErrorHandler {
  private static errors: AppError[] = [];
  private static listeners: ((error: AppError) => void)[] = [];

  static logError(
    error: Error,
    context?: Record<string, any>,
    severity: AppError["severity"] = "medium"
  ): AppError {
    const appError: AppError = {
      id: crypto.randomUUID(),
      message: error.message,
      code: error.name,
      severity,
      timestamp: new Date(),
      ...(context && { context }),
      ...(error.stack && { stack: error.stack }),
    };

    this.errors.push(appError);

    // Notificar a los listeners
    this.listeners.forEach((listener) => listener(appError));

    // Log en consola en development
    if (process.env.NODE_ENV === "development") {
      console.error("🚨 Error capturado:", appError);
    }

    // En producción, aquí enviarías a un servicio como Sentry
    if (process.env.NODE_ENV === "production") {
      // TODO: Integrar con Sentry o similar
      this.sendToMonitoringService(appError);
    }

    return appError;
  }

  static addErrorListener(listener: (error: AppError) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  static getErrors(): AppError[] {
    return [...this.errors];
  }

  static clearErrors(): void {
    this.errors = [];
  }

  private static sendToMonitoringService(error: AppError): void {
    // Placeholder para integración con servicios de monitoreo
    console.info("Enviando error a servicio de monitoreo:", error.id);
  }
}

// Helper para crear errores tipados
export const createError = (message: string, code: string, _context?: Record<string, any>) => {
  const error = new Error(message);
  error.name = code;
  return error;
};

// Helper para manejo de errores async
export const handleAsync = <T>(promise: Promise<T>): Promise<[T | null, AppError | null]> => {
  return promise
    .then<[T, null]>((data: T) => [data, null])
    .catch<[null, AppError]>((error: Error) => [null, ErrorHandler.logError(error)]);
};
