"use client";

import React, { useEffect } from 'react';
import { ErrorBoundary } from '@/app/components/atoms/error-boundary/error-boundary';
import { NotificationContainer, useNotifications } from '@/app/components/atoms/notification/notification';
import { DebugProvider } from '@/app/contexts/debug-context';
import { DebugPanel } from '@/app/components/atoms/debug-panel/debug-panel';
import { ErrorHandler } from '@/lib/error-handler';

interface AppProviderProps {
  children: React.ReactNode;
}

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    notifications,
    removeNotification,
    notifyAppError,
  } = useNotifications();

  useEffect(() => {
    // Suscribirse a los errores globales
    const unsubscribe = ErrorHandler.addErrorListener((error) => {
      notifyAppError(error);
    });

    // Manejar errores no capturados
    const handleUnhandledError = (event: ErrorEvent) => {
      ErrorHandler.logError(
        new Error(event.message),
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
        'critical'
      );
    };

    // Manejar promesas rechazadas no capturadas
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      ErrorHandler.logError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        { type: 'unhandled-promise-rejection' },
        'high'
      );
    };

    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      unsubscribe();
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [notifyAppError]);

  return (
    <>
      {children}
      <NotificationContainer
        notifications={notifications}
        onDismiss={removeNotification}
        position="top-right"
      />
      <DebugPanel />
    </>
  );
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <DebugProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </DebugProvider>
    </ErrorBoundary>
  );
}; 