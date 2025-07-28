/**
 * @fileoverview 재고 관리 및 상태 계산 시스템
 * 모든 재고 관련 로직을 담당하는 순수 함수 모듈
 *
 * 기존 onGetStockTotal, handleStockInfoUpdate 등의 로직을 분리하여
 * 테스트 가능하고 재사용 가능한 순수 함수로 구현
 */

/**
 * @typedef {Object} Product
 * @property {string} id - 상품 ID
 * @property {string} name - 상품명
 * @property {number} q - 재고 수량
 * @property {number} val - 가격
 */

/**
 * @typedef {Object} StockAvailabilityResult
 * @property {boolean} available - 구매 가능 여부
 * @property {number} maxQuantity - 최대 구매 가능 수량
 * @property {string} status - 재고 상태
 * @property {string} message - 상태 메시지
 */

/**
 * @typedef {Object} StockStatusResult
 * @property {'IN_STOCK'|'LOW_STOCK'|'OUT_OF_STOCK'} status - 재고 상태
 * @property {number} quantity - 재고 수량
 * @property {string} message - 상태 메시지
 */

/**
 * @typedef {Object} LowStockResult
 * @property {boolean} isLow - 재고 부족 여부
 * @property {number} remaining - 남은 재고
 * @property {string} level - 부족 수준
 */

/**
 * @typedef {Object} StockSummary
 * @property {number} totalStock - 전체 재고 수량
 * @property {number} inStock - 정상 재고 상품 수
 * @property {number} lowStock - 재고 부족 상품 수
 * @property {number} outOfStock - 품절 상품 수
 * @property {number} totalProducts - 총 상품 수
 * @property {boolean} criticalLevel - 전체 재고 부족 여부 (30개 미만)
 */

/**
 * @typedef {Object} StockWarning
 * @property {string} productName - 상품명
 * @property {'IN_STOCK'|'LOW_STOCK'|'OUT_OF_STOCK'} status - 재고 상태
 * @property {number} quantity - 재고 수량
 * @property {string} message - 경고 메시지
 */

/**
 * @typedef {Object} StockWarningsResult
 * @property {Array<StockWarning>} warnings - 경고 목록
 * @property {string} summary - 요약 메시지
 * @property {number} warningCount - 경고 상품 수
 */

/**
 * @typedef {Object} StockUpdateResult
 * @property {boolean} success - 업데이트 성공 여부
 * @property {number} newStock - 업데이트 후 재고
 * @property {string} [error] - 오류 메시지 (실패 시)
 */

// 재고 상태 상수
export const STOCK_STATUS = {
  IN_STOCK: 'IN_STOCK', // 5개 이상
  LOW_STOCK: 'LOW_STOCK', // 1-4개
  OUT_OF_STOCK: 'OUT_OF_STOCK', // 0개
};

// 재고 임계값 상수
export const STOCK_THRESHOLDS = {
  LOW_STOCK: 5, // 5개 미만 시 재고 부족
  CRITICAL: 30, // 전체 재고 30개 미만 시 긴급
  WARNING: 1, // 1개 이하 시 경고
};

/**
 * 재고 관리 및 상태 계산 클래스
 * 모든 재고 관련 계산 로직을 순수 함수로 제공합니다.
 */
export class StockCalculator {
  /**
   * 재고 가용성 확인
   * @param {string} productId - 상품 ID
   * @param {number} quantity - 요청 수량
   * @param {Array<Product>} products - 상품 목록
   * @returns {StockAvailabilityResult} 재고 가용성 결과
   */
  static checkStockAvailability(productId, quantity, products) {
    if (!productId || !quantity || !products || products.length === 0) {
      return {
        available: false,
        maxQuantity: 0,
        status: STOCK_STATUS.OUT_OF_STOCK,
        message: '유효하지 않은 요청입니다',
      };
    }

    // 해당 상품 찾기
    const product = products.find(p => p.id === productId);
    if (!product) {
      return {
        available: false,
        maxQuantity: 0,
        status: STOCK_STATUS.OUT_OF_STOCK,
        message: '상품을 찾을 수 없습니다',
      };
    }

    const currentStock = product.q;
    const stockStatus = this.getStockStatus(product);

    // 요청 수량이 재고보다 많은 경우
    if (quantity > currentStock) {
      return {
        available: false,
        maxQuantity: currentStock,
        status: stockStatus.status,
        message:
          currentStock > 0
            ? `재고 부족: 최대 ${currentStock}개까지 구매 가능`
            : '품절된 상품입니다',
      };
    }

    // 구매 가능한 경우
    return {
      available: true,
      maxQuantity: currentStock,
      status: stockStatus.status,
      message: `구매 가능: ${currentStock}개 재고`,
    };
  }

  /**
   * 재고 상태 판단
   * @param {Product} product - 상품 정보
   * @returns {StockStatusResult} 재고 상태 결과
   */
  static getStockStatus(product) {
    if (!product || typeof product.q !== 'number') {
      return {
        status: STOCK_STATUS.OUT_OF_STOCK,
        quantity: 0,
        message: '유효하지 않은 상품 정보입니다',
      };
    }

    const quantity = product.q;
    let status, message;

    if (quantity === 0) {
      status = STOCK_STATUS.OUT_OF_STOCK;
      message = '품절';
    } else if (quantity < STOCK_THRESHOLDS.LOW_STOCK) {
      status = STOCK_STATUS.LOW_STOCK;
      message = `재고 부족 (${quantity}개 남음)`;
    } else {
      status = STOCK_STATUS.IN_STOCK;
      message = `정상 재고 (${quantity}개)`;
    }

    return {
      status,
      quantity,
      message,
    };
  }

  /**
   * 재고 부족 판단
   * @param {number} quantity - 재고 수량
   * @param {number} [threshold=5] - 부족 기준 임계값
   * @returns {LowStockResult} 재고 부족 판단 결과
   */
  static isLowStock(quantity, threshold = STOCK_THRESHOLDS.LOW_STOCK) {
    if (typeof quantity !== 'number' || quantity < 0) {
      return {
        isLow: true,
        remaining: 0,
        level: 'invalid',
      };
    }

    const isLow = quantity < threshold;
    let level;

    if (quantity === 0) {
      level = 'out_of_stock';
    } else if (quantity <= STOCK_THRESHOLDS.WARNING) {
      level = 'critical';
    } else if (quantity < threshold) {
      level = 'low';
    } else {
      level = 'normal';
    }

    return {
      isLow,
      remaining: quantity,
      level,
    };
  }

  /**
   * 전체 재고 통계
   * @param {Array<Product>} products - 상품 목록
   * @returns {StockSummary} 재고 요약 정보
   */
  static getStockSummary(products) {
    if (!products || !Array.isArray(products) || products.length === 0) {
      return {
        totalStock: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
        totalProducts: 0,
        criticalLevel: true,
      };
    }

    let totalStock = 0;
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    // 각 상품의 재고 상태를 분석
    products.forEach(product => {
      const quantity = product.q || 0;
      totalStock += quantity;

      const status = this.getStockStatus(product);

      switch (status.status) {
        case STOCK_STATUS.IN_STOCK:
          inStock++;
          break;
        case STOCK_STATUS.LOW_STOCK:
          lowStock++;
          break;
        case STOCK_STATUS.OUT_OF_STOCK:
          outOfStock++;
          break;
      }
    });

    // 전체 재고가 임계값 미만인지 확인
    const criticalLevel = totalStock < STOCK_THRESHOLDS.CRITICAL;

    return {
      totalStock,
      inStock,
      lowStock,
      outOfStock,
      totalProducts: products.length,
      criticalLevel,
    };
  }

  /**
   * 재고 경고 메시지 생성
   * @param {Array<Product>} products - 상품 목록
   * @returns {StockWarningsResult} 재고 경고 결과
   */
  static generateStockWarnings(products) {
    if (!products || !Array.isArray(products) || products.length === 0) {
      return {
        warnings: [],
        summary: '',
        warningCount: 0,
      };
    }

    const warnings = [];

    // 재고 부족 또는 품절 상품만 필터링
    products.forEach(product => {
      if (!product) return;

      const status = this.getStockStatus(product);

      // 정상 재고가 아닌 경우만 경고에 포함
      if (status.status !== STOCK_STATUS.IN_STOCK) {
        let message;

        if (status.status === STOCK_STATUS.OUT_OF_STOCK) {
          message = `${product.name}: 품절`;
        } else if (status.status === STOCK_STATUS.LOW_STOCK) {
          message = `${product.name}: 재고 부족 (${product.q}개 남음)`;
        }

        warnings.push({
          productName: product.name,
          status: status.status,
          quantity: product.q,
          message,
        });
      }
    });

    // 요약 메시지 생성
    let summary = '';
    if (warnings.length > 0) {
      const warningMessages = warnings.map(w => w.message);
      summary = warningMessages.join('\n');
    }

    return {
      warnings,
      summary,
      warningCount: warnings.length,
    };
  }

  /**
   * 재고 업데이트 계산
   * @param {string} productId - 상품 ID
   * @param {number} quantity - 감소할 수량
   * @param {Array<Product>} products - 상품 목록
   * @returns {StockUpdateResult} 재고 업데이트 결과
   */
  static updateStock(productId, quantity, products) {
    if (!productId || !quantity || quantity <= 0 || !products || products.length === 0) {
      return {
        success: false,
        newStock: 0,
        error: '유효하지 않은 업데이트 요청입니다',
      };
    }

    // 해당 상품 찾기
    const product = products.find(p => p.id === productId);
    if (!product) {
      return {
        success: false,
        newStock: 0,
        error: '상품을 찾을 수 없습니다',
      };
    }

    const currentStock = product.q;

    // 재고 부족 확인
    if (quantity > currentStock) {
      return {
        success: false,
        newStock: currentStock,
        error: `재고 부족: 현재 재고 ${currentStock}개, 요청 수량 ${quantity}개`,
      };
    }

    // 업데이트 후 재고 계산
    const newStock = currentStock - quantity;

    return {
      success: true,
      newStock,
      error: undefined,
    };
  }
}
