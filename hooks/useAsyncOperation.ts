import { useState, useCallback } from 'react';
import { ErrorHandler, AppError, handleAsync } from '@/lib/error-handler';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
  success: boolean;
}

interface UseAsyncOperationReturn<T> {
  state: AsyncState<T>;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  setData: (data: T) => void;
}

export function useAsyncOperation<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: AppError) => void;
    initialData?: T | null;
  } = {}
): UseAsyncOperationReturn<T> {
  const { onSuccess, onError, initialData = null } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        success: false,
      }));

      try {
        const [result, error] = await handleAsync(asyncFunction(...args));

        if (error) {
          setState(prev => ({
            ...prev,
            loading: false,
            error,
            success: false,
          }));
          onError?.(error);
          return null;
        }

        setState(prev => ({
          ...prev,
          data: result,
          loading: false,
          error: null,
          success: true,
        }));

        if (result !== null) {
          onSuccess?.(result);
        }

        return result;
      } catch (catchError) {
        const error = ErrorHandler.logError(
          catchError instanceof Error ? catchError : new Error(String(catchError)),
          { function: asyncFunction.name, args },
          'high'
        );

        setState(prev => ({
          ...prev,
          loading: false,
          error,
          success: false,
        }));

        onError?.(error);
        return null;
      }
    },
    [asyncFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
      success: false,
    });
  }, [initialData]);

  const setData = useCallback((data: T) => {
    setState(prev => ({
      ...prev,
      data,
      success: true,
      error: null,
    }));
  }, []);

  return {
    state,
    execute,
    reset,
    setData,
  };
} 