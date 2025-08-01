import { AppError, ErrorCode, ErrorType } from '../types';

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  VALIDATION: {
    QUANTITY_MIN_ONE: '수량은 1개 이상이어야 합니다.',
    QUANTITY_MIN_ZERO: '수량은 0개 이상이어야 합니다.',
    ADD_QUANTITY_MIN_ONE: '추가할 수량은 1개 이상이어야 합니다.',
  },
  CART: {
    ITEM_NOT_FOUND: '장바구니에 해당 상품이 없습니다.',
  },
  STOCK: {
    INSUFFICIENT: '재고가 부족합니다.',
    INSUFFICIENT_WITH_NAME: (name: string) => `${name}의 재고가 부족합니다.`,
  },
} as const;

// 에러 타입 가드 함수
export const isAppError = (error: unknown): error is AppError => {
  return Boolean(error && typeof error === 'object' && 'code' in error);
};

// AppError를 Error로 변환하는 함수
export const createErrorFromAppError = (appError: AppError): Error => {
  const error = new Error(appError.message);
  (error as any).code = appError.code;
  (error as any).type = appError.type;
  (error as any).details = appError.details;
  (error as any).timestamp = appError.timestamp;
  return error;
};

// 에러 처리 래퍼 함수
export const handleOperationWithError = (
  operation: () => void,
  errorMessage: string,
  handleError: (error: AppError) => void
): void => {
  try {
    operation();
  } catch (error) {
    if (isAppError(error)) {
      handleError(error);
    } else if (error instanceof Error) {
      // 일반 Error 객체의 메시지를 분석해서 적절한 AppError 생성
      const { message } = error;

      if (message.includes('재고가 부족합니다')) {
        handleError(createStockError());
      } else if (message.includes('수량은')) {
        handleError(createValidationError(message));
      } else if (message.includes('장바구니에')) {
        handleError(createCartError(message));
      } else {
        // 기본적으로 cart error로 처리
        handleError(createCartError(errorMessage));
      }
    } else {
      handleError(createCartError(errorMessage));
    }
  }
};

// 상수 정의
export const OPERATION_MESSAGES = {
  CART: {
    ADD_FAILED: '장바구니에 상품을 추가하는 중',
    REMOVE_FAILED: '장바구니에서 상품을 제거하는 중',
    UPDATE_FAILED: '상품 수량을 변경하는 중',
  },
  QUANTITY: {
    DEFAULT: 1,
    MIN: 0,
  },
} as const;

export const createAppError = (
  code: ErrorCode,
  message: string,
  type: ErrorType = 'error',
  details?: unknown
): AppError => ({
  code,
  message,
  type,
  details,
  timestamp: Date.now(),
});

// Error 객체를 throw하는 함수들
export const throwStockError = (productName?: string): never => {
  const appError = createStockError(productName);
  throw createErrorFromAppError(appError);
};

export const throwValidationError = (message: string): never => {
  const appError = createValidationError(message);
  throw createErrorFromAppError(appError);
};

export const throwCartError = (message: string): never => {
  const appError = createCartError(message);
  throw createErrorFromAppError(appError);
};

export const createStockError = (productName?: string): AppError =>
  createAppError(
    'STOCK_INSUFFICIENT',
    productName
      ? ERROR_MESSAGES.STOCK.INSUFFICIENT_WITH_NAME(productName)
      : ERROR_MESSAGES.STOCK.INSUFFICIENT,
    'warning'
  );

export const createProductNotFoundError = (productId: string): AppError =>
  createAppError(
    'PRODUCT_NOT_FOUND',
    `상품을 찾을 수 없습니다: ${productId}`,
    'error'
  );

export const createNetworkError = (operation: string): AppError =>
  createAppError(
    'NETWORK_ERROR',
    `${operation} 중 네트워크 오류가 발생했습니다.`,
    'error'
  );

export const createValidationError = (message: string): AppError =>
  createAppError('VALIDATION_ERROR', message, 'warning');

export const createTimerError = (message: string): AppError =>
  createAppError('TIMER_ERROR', message, 'error');

export const createCartError = (message: string): AppError =>
  createAppError('CART_ERROR', message, 'error');

export const createDiscountError = (message: string): AppError =>
  createAppError('DISCOUNT_ERROR', message, 'warning');

export const createLoyaltyError = (message: string): AppError =>
  createAppError('LOYALTY_ERROR', message, 'warning');
