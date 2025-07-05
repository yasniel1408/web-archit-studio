"use client";

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

import { AppError } from "@/lib/error-handler";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!notification.persistent && notification.duration !== 0) {
      timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss(notification.id), 300);
      }, notification.duration || 5000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [notification, onDismiss]);

  const icons = {
    success: CheckCircleIcon,
    error: ExclamationTriangleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconColors = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };

  const Icon = icons[notification.type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.3 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
          className={`pointer-events-auto w-full max-w-sm rounded-lg border shadow-lg ${colors[notification.type]}`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Icon className={`h-6 w-6 ${iconColors[notification.type]}`} />
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium">{notification.title}</p>
                {notification.message && (
                  <p className="mt-1 text-sm opacity-90">{notification.message}</p>
                )}
                {notification.action && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={notification.action.onClick}
                      className="text-sm font-medium underline hover:no-underline focus:underline focus:outline-none"
                    >
                      {notification.action.label}
                    </button>
                  </div>
                )}
              </div>
              <div className="ml-4 flex flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onDismiss(notification.id), 300);
                  }}
                  className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Cerrar</span>
                  <XMarkIcon className="h-5 w-5 opacity-60 hover:opacity-100" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onDismiss,
  position = "top-right",
}) => {
  const positionClasses = {
    "top-right": "top-0 right-0 mt-4 mr-4",
    "top-left": "top-0 left-0 mt-4 ml-4",
    "bottom-right": "bottom-0 right-0 mb-4 mr-4",
    "bottom-left": "bottom-0 left-0 mb-4 ml-4",
    "top-center": "top-0 left-1/2 transform -translate-x-1/2 mt-4",
    "bottom-center": "bottom-0 left-1/2 transform -translate-x-1/2 mb-4",
  };

  return (
    <div
      aria-live="assertive"
      className={`pointer-events-none fixed z-50 sm:p-6 ${positionClasses[position]}`}
    >
      <div className="flex flex-col space-y-4">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  );
};

// Hook para manejar notificaciones
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { ...notification, id }]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Helpers para diferentes tipos de notificaciones
  const notifySuccess = (title: string, message?: string) =>
    addNotification({ type: "success", title, ...(message && { message }) });

  const notifyError = (title: string, message?: string) =>
    addNotification({ type: "error", title, duration: 8000, ...(message && { message }) });

  const notifyWarning = (title: string, message?: string) =>
    addNotification({ type: "warning", title, ...(message && { message }) });

  const notifyInfo = (title: string, message?: string) =>
    addNotification({ type: "info", title, ...(message && { message }) });

  // Helper específico para errores de la aplicación
  const notifyAppError = (error: AppError) => {
    const severity =
      error.severity === "critical"
        ? "error"
        : error.severity === "high"
          ? "error"
          : error.severity === "medium"
            ? "warning"
            : "info";

    const action =
      process.env.NODE_ENV === "development"
        ? {
            label: "Ver detalles",
            onClick: () => console.log("Error details:", error),
          }
        : null;

    return addNotification({
      type: severity,
      title: "Error en la aplicación",
      message: error.message,
      duration: severity === "error" ? 10000 : 6000,
      ...(action && { action }),
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyAppError,
  };
};
