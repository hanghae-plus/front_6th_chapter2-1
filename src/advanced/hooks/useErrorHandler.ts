import { useCallback } from 'react';
import { ErrorType, AppError } from '../types';
import { createErrorHandler } from '../utils/errorHandler';

interface UseErrorHandlerReturn {
  handleError: (error: AppError) => void;
  showError: (message: string, type?: ErrorType, title?: string) => void;
  showStockError: (productName?: string) => void;
  showProductNotFoundError: (productId: string) => void;
  showNetworkError: (operation: string) => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const errorHandler = createErrorHandler();

  const handleError = useCallback(
    (error: AppError) => {
      errorHandler.handleError(error);
    },
    [errorHandler]
  );

  const showError = useCallback(
    (message: string, type: ErrorType = 'error', title?: string) => {
      errorHandler.showError(message, type, title);
    },
    [errorHandler]
  );

  const showStockError = useCallback(
    (productName?: string) => {
      errorHandler.showStockError(productName);
    },
    [errorHandler]
  );

  const showProductNotFoundError = useCallback(
    (productId: string) => {
      errorHandler.showProductNotFoundError(productId);
    },
    [errorHandler]
  );

  const showNetworkError = useCallback(
    (operation: string) => {
      errorHandler.showNetworkError(operation);
    },
    [errorHandler]
  );

  return {
    handleError,
    showError,
    showStockError,
    showProductNotFoundError,
    showNetworkError,
  };
};
