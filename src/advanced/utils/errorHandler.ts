import { AppError, ErrorHandler, ErrorType } from '../types';
import {
  createStockError,
  createProductNotFoundError,
  createNetworkError,
  createValidationError,
} from './errorFactory';

export const createErrorHandler = (): ErrorHandler => {
  const logError = (error: AppError): void => {
    if (
      typeof window !== 'undefined' &&
      window.location.hostname === 'localhost'
    ) {
      console.log(
        `[${error.type.toUpperCase()}] ${error.code}: ${error.message}`,
        error.details ? error.details : ''
      );
    }
  };

  const showAlert = (error: AppError): void => {
    const icon = {
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    }[error.type];

    const title =
      {
        STOCK_INSUFFICIENT: '재고 부족',
        PRODUCT_NOT_FOUND: '상품 오류',
        NETWORK_ERROR: '네트워크 오류',
        VALIDATION_ERROR: '입력 오류',
        TIMER_ERROR: '타이머 오류',
        CART_ERROR: '장바구니 오류',
        DISCOUNT_ERROR: '할인 오류',
        LOYALTY_ERROR: '포인트 오류',
      }[error.code] || '오류';

    alert(`${icon} ${title}\n${error.message}`);
  };

  const handleError = (error: AppError): void => {
    logError(error);
    showAlert(error);
  };

  const showError = (
    message: string,
    type: ErrorType = 'error',
    title?: string
  ): void => {
    const error = createValidationError(message);

    if (title) {
      let icon = 'ℹ️';
      if (type === 'error') {
        icon = '❌';
      } else if (type === 'warning') {
        icon = '⚠️';
      }
      alert(`${icon} ${title}\n${message}`);
    } else {
      handleError(error);
    }
  };

  const showStockError = (productName?: string): void => {
    const error = createStockError(productName);
    handleError(error);
  };

  const showProductNotFoundError = (productId: string): void => {
    const error = createProductNotFoundError(productId);
    handleError(error);
  };

  const showNetworkError = (operation: string): void => {
    const error = createNetworkError(operation);
    handleError(error);
  };

  return {
    handleError,
    showError,
    showStockError,
    showProductNotFoundError,
    showNetworkError,
  };
};
