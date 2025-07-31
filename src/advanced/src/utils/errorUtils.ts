/**
 * 에러 타입 정의
 */
export type ErrorType =
  | "CartError"
  | "StockError"
  | "ProductError"
  | "ValidationError";

export interface BaseError {
  type: ErrorType;
  message: string;
}

export interface CartError extends BaseError {
  type: "CartError";
  code: string;
  recoverable: boolean;
}

export interface StockError extends BaseError {
  type: "StockError";
  productId: string;
  requestedQuantity: number;
  availableQuantity: number;
}

export interface ProductError extends BaseError {
  type: "ProductError";
  productId: string;
}

export interface ValidationError extends BaseError {
  type: "ValidationError";
  field: string;
  value: any;
}

export type AppError = CartError | StockError | ProductError | ValidationError;

/**
 * 에러 처리 결과
 */
export interface ErrorResult {
  success: false;
  error: AppError;
}

export interface SuccessResult<T> {
  success: true;
  data: T;
}

export type Result<T> = SuccessResult<T> | ErrorResult;

/**
 * 에러 생성 유틸리티
 */
export const createError = {
  cart: (message: string, code: string, recoverable = true): CartError => ({
    type: "CartError",
    message,
    code,
    recoverable,
  }),

  stock: (
    message: string,
    productId: string,
    requestedQuantity: number,
    availableQuantity: number
  ): StockError => ({
    type: "StockError",
    message,
    productId,
    requestedQuantity,
    availableQuantity,
  }),

  product: (message: string, productId: string): ProductError => ({
    type: "ProductError",
    message,
    productId,
  }),

  validation: (
    message: string,
    field: string,
    value: any
  ): ValidationError => ({
    type: "ValidationError",
    message,
    field,
    value,
  }),
};

/**
 * 에러 처리 함수
 */
export const handleError = (error: AppError): void => {
  console.error(`[${error.type}] ${error.message}`, error);

  // 에러 타입별 처리
  switch (error.type) {
    case "CartError":
      if (error.recoverable) {
        // 복구 가능한 에러 - 사용자에게 알림
        alert(error.message);
      } else {
        // 치명적 에러 - 로그만 남기고 조용히 처리
        console.error("Critical cart error:", error);
      }
      break;

    case "StockError":
      // 재고 에러는 항상 사용자에게 알림
      alert(error.message);
      break;

    case "ProductError":
      // 상품 에러는 사용자에게 알림
      alert(error.message);
      break;

    case "ValidationError":
      // 검증 에러는 개발자에게만 로그
      console.warn("Validation error:", error);
      break;
  }
};

/**
 * Result 패턴을 사용한 안전한 함수 실행
 */
export const safeExecute = <T>(
  fn: () => T,
  errorHandler?: (error: AppError) => void
): Result<T> => {
  try {
    const result = fn();
    return { success: true, data: result };
  } catch (error) {
    const appError = createError.validation(
      error instanceof Error ? error.message : String(error),
      "unknown",
      error
    );

    if (errorHandler) {
      errorHandler(appError);
    } else {
      handleError(appError);
    }

    return { success: false, error: appError };
  }
};

/**
 * 비동기 함수를 위한 안전한 실행
 */
export const safeExecuteAsync = async <T>(
  fn: () => Promise<T>,
  errorHandler?: (error: AppError) => void
): Promise<Result<T>> => {
  try {
    const result = await fn();
    return { success: true, data: result };
  } catch (error) {
    const appError = createError.validation(
      error instanceof Error ? error.message : String(error),
      "unknown",
      error
    );

    if (errorHandler) {
      errorHandler(appError);
    } else {
      handleError(appError);
    }

    return { success: false, error: appError };
  }
};
