/**
 * @fileoverview StockInfo 컴포넌트
 * 재고 정보를 일관되게 표시하는 컴포넌트
 *
 * 기존 main.basic.js의 분산된 재고 정보 표시 로직을 분리하여
 * 재사용 가능하고 일관된 재고 정보 표시 시스템으로 구현
 */

import { StockCalculator } from '@helpers/StockCalculator';

/**
 * @typedef {Object} StockInfoOptions
 * @property {boolean} [showStockLevels=true] - 재고 레벨 표시 여부
 * @property {boolean} [showWarningsOnly=false] - 경고만 표시 여부
 * @property {boolean} [showSummary=true] - 요약 정보 표시 여부
 * @property {boolean} [highlightCritical=true] - 위험 수준 강조 여부
 * @property {string} [emptyMessage='재고 정보 없음'] - 빈 상태 메시지
 * @property {string} [containerClass] - 추가 컨테이너 CSS 클래스
 */

/**
 * @typedef {Object} StockData
 * @property {Array<Product>} products - 상품 목록
 * @property {Object} summary - 재고 요약 정보
 * @property {number} summary.totalProducts - 총 상품 수
 * @property {number} summary.lowStockCount - 재고 부족 상품 수
 * @property {number} summary.outOfStockCount - 품절 상품 수
 * @property {number} summary.warningLevel - 경고 레벨 (0-4)
 */

/**
 * @typedef {Object} StockItem
 * @property {string} productName - 상품명
 * @property {number} quantity - 재고 수량
 * @property {string} status - 재고 상태 (in_stock, low_stock, out_of_stock)
 * @property {string} message - 표시 메시지
 * @property {string} urgencyLevel - 긴급도 (normal, warning, critical)
 */

/**
 * @typedef {Object} StockSummary
 * @property {number} totalItems - 총 재고 수량
 * @property {number} totalProducts - 총 상품 수
 * @property {number} warningCount - 경고 상품 수
 * @property {number} criticalCount - 위험 상품 수
 * @property {number} healthScore - 재고 건강도 (0-100)
 * @property {string} overallStatus - 전체 상태 (healthy, warning, critical)
 */

/**
 * 재고 정보 컴포넌트
 * StockCalculator 결과를 활용하여 일관된 재고 정보를 표시하는 순수 함수 기반 클래스
 *
 * 기존 main.basic.js의 분산된 재고 표시 로직을 컴포넌트로 분리하여
 * 재사용성과 일관성을 향상
 */
export class StockInfo {
  /**
   * 재고 정보 전체를 렌더링
   * @param {Array<Product>} products - 상품 목록
   * @param {StockInfoOptions} [options={}] - 표시 옵션
   * @returns {string} 재고 정보 HTML
   */
  static render(products, options = {}) {
    // 기본 옵션 설정
    const {
      showStockLevels = true,
      showWarningsOnly = false,
      showSummary = true,
      highlightCritical = true,
      emptyMessage = '재고 정보 없음',
      containerClass = ''
    } = options;

    // 데이터 유효성 검사
    if (!products || !Array.isArray(products) || products.length === 0) {
      return StockInfo.generateEmptyState(emptyMessage, containerClass);
    }

    // StockCalculator를 사용하여 재고 분석
    const stockAnalysis = StockInfo.analyzeStock(products);

    let html = '';

    // 요약 정보 표시
    if (showSummary) {
      html += StockInfo.generateStockSummary(stockAnalysis.summary);
    }

    // 재고 목록 표시
    if (showStockLevels) {
      if (showWarningsOnly) {
        // 경고만 표시
        const warningItems = stockAnalysis.items.filter(
          item =>
            item.urgencyLevel === 'warning' || item.urgencyLevel === 'critical'
        );
        html += StockInfo.generateStockList(warningItems, {
          highlightCritical
        });
      } else {
        // 전체 재고 표시
        html += StockInfo.generateStockList(stockAnalysis.items, {
          highlightCritical
        });
      }
    }

    // 컨테이너로 감싸기
    const containerClasses = ['stock-info-container', containerClass]
      .filter(Boolean)
      .join(' ');

    return `<div class="${containerClasses}">${html}</div>`;
  }

  /**
   * 재고 데이터 분석
   * @param {Array<Product>} products - 상품 목록
   * @returns {StockData} 분석된 재고 데이터
   */
  static analyzeStock(products) {
    // StockCalculator 사용
    const stockWarnings = StockCalculator.generateStockWarnings(products);

    // 재고 아이템 정보 생성
    const items = products.map(product => {
      const stockStatus = StockCalculator.getStockStatus(product);

      let urgencyLevel = 'normal';
      if (stockStatus.status === 'OUT_OF_STOCK') {
        urgencyLevel = 'critical';
      } else if (stockStatus.status === 'LOW_STOCK') {
        urgencyLevel = 'warning';
      }

      return {
        productName: product.name,
        quantity: product.q,
        status: stockStatus.status,
        message: stockStatus.message,
        urgencyLevel
      };
    });

    // 요약 정보 계산
    const summary = StockInfo.calculateSummary(products, items);

    return {
      products,
      items,
      summary
    };
  }

  /**
   * 재고 요약 정보 계산
   * @param {Array<Product>} products - 상품 목록
   * @param {Array<StockItem>} items - 재고 아이템 목록
   * @returns {StockSummary} 요약 정보
   */
  static calculateSummary(products, items) {
    const totalProducts = products.length;
    const totalItems = products.reduce((sum, product) => sum + product.q, 0);

    const warningCount = items.filter(
      item => item.urgencyLevel === 'warning'
    ).length;
    const criticalCount = items.filter(
      item => item.urgencyLevel === 'critical'
    ).length;

    // 재고 건강도 계산 (0-100)
    const healthyCount = totalProducts - warningCount - criticalCount;
    const healthScore = Math.round((healthyCount / totalProducts) * 100);

    // 전체 상태 결정
    let overallStatus = 'healthy';
    if (criticalCount > 0 || healthScore < 70) {
      overallStatus = 'critical';
    } else if (warningCount > 0 || healthScore < 85) {
      overallStatus = 'warning';
    }

    return {
      totalItems,
      totalProducts,
      warningCount,
      criticalCount,
      healthScore,
      overallStatus
    };
  }

  /**
   * 재고 목록을 생성
   * @param {Array<StockItem>} items - 재고 아이템 목록
   * @param {Object} [options={}] - 렌더링 옵션
   * @returns {string} 재고 목록 HTML
   */
  static generateStockList(items, options = {}) {
    const { highlightCritical = true } = options;

    if (!items || items.length === 0) {
      return '<div class="stock-list-empty text-xs text-gray-500">표시할 재고 정보가 없습니다.</div>';
    }

    const itemsHTML = items
      .map(item => StockInfo.generateStockItem(item, { highlightCritical }))
      .join('');

    return `
      <div class="stock-list space-y-1">
        ${itemsHTML}
      </div>
    `;
  }

  /**
   * 개별 재고 아이템 생성
   * @param {StockItem} item - 재고 아이템
   * @param {Object} [options={}] - 렌더링 옵션
   * @returns {string} 재고 아이템 HTML
   */
  static generateStockItem(item, options = {}) {
    const { highlightCritical = true } = options;

    // 긴급도에 따른 스타일 클래스
    const urgencyClasses = {
      normal: 'text-gray-600',
      warning: 'text-orange-600',
      critical: 'text-red-600 font-medium'
    };

    // 상태 아이콘
    const statusIcons = {
      normal: '✅',
      warning: '⚠️',
      critical: '🚨'
    };

    const urgencyClass =
      urgencyClasses[item.urgencyLevel] || urgencyClasses.normal;
    const statusIcon = statusIcons[item.urgencyLevel] || statusIcons.normal;

    // 중요한 항목 강조
    const highlightClass =
      highlightCritical && item.urgencyLevel === 'critical'
        ? 'bg-red-50 border-l-2 border-red-400 pl-2'
        : '';

    return `
      <div class="stock-item flex items-center justify-between text-xs py-1 ${highlightClass}">
        <span class="flex items-center gap-1">
          <span class="stock-icon">${statusIcon}</span>
          <span class="stock-name ${urgencyClass}">${item.productName}</span>
        </span>
        <span class="stock-quantity ${urgencyClass}">
          ${item.quantity > 0 ? `${item.quantity}개` : '품절'}
        </span>
      </div>
    `;
  }

  /**
   * 재고 요약 정보 생성
   * @param {StockSummary} summary - 요약 정보
   * @returns {string} 요약 HTML
   */
  static generateStockSummary(summary) {
    // 상태에 따른 색상 및 아이콘
    const statusConfig = {
      healthy: {
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: '✅',
        message: '재고 상태 양호'
      },
      warning: {
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        icon: '⚠️',
        message: '재고 관리 필요'
      },
      critical: {
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: '🚨',
        message: '긴급 재고 보충 필요'
      }
    };

    const config = statusConfig[summary.overallStatus] || statusConfig.healthy;

    // 건강도 게이지 바
    const healthBarWidth = Math.max(summary.healthScore, 5); // 최소 5% 표시
    const healthBarColor =
      summary.healthScore >= 85
        ? 'bg-green-500'
        : summary.healthScore >= 70
          ? 'bg-orange-500'
          : 'bg-red-500';

    return `
      <div class="stock-summary ${config.bgColor} rounded-lg p-3 mb-3 text-xs">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-sm">${config.icon}</span>
            <span class="font-medium ${config.color}">${config.message}</span>
          </div>
          <span class="text-gray-600">${summary.healthScore}%</span>
        </div>
        
        <div class="health-bar bg-gray-200 rounded-full h-2 mb-2">
          <div class="health-progress ${healthBarColor} h-2 rounded-full transition-all duration-300" 
               style="width: ${healthBarWidth}%"></div>
        </div>
        
        <div class="flex justify-between text-2xs text-gray-600">
          <span>총 ${summary.totalProducts}개 상품</span>
          <span>
            ${summary.criticalCount > 0 ? `🚨 ${summary.criticalCount}개 ` : ''}
            ${summary.warningCount > 0 ? `⚠️ ${summary.warningCount}개` : ''}
            ${summary.criticalCount === 0 && summary.warningCount === 0 ? '문제없음' : ''}
          </span>
        </div>
      </div>
    `;
  }

  /**
   * 빈 상태 메시지 생성
   * @param {string} message - 표시할 메시지
   * @param {string} [containerClass=''] - 추가 CSS 클래스
   * @returns {string} 빈 상태 HTML
   */
  static generateEmptyState(message, containerClass = '') {
    const containerClasses = [
      'stock-info-empty',
      'text-center',
      'py-4',
      containerClass
    ]
      .filter(Boolean)
      .join(' ');

    return `
      <div class="${containerClasses}">
        <div class="text-gray-400 text-2xl mb-2">📦</div>
        <p class="text-xs text-gray-500">${message}</p>
      </div>
    `;
  }

  /**
   * 간단한 재고 상태 문자열 생성 (기존 main.basic.js 호환)
   * @param {Array<Product>} products - 상품 목록
   * @returns {string} 재고 상태 텍스트
   */
  static generateSimpleStockText(products) {
    if (!products || !Array.isArray(products)) {
      return '';
    }

    // 기존 StockCalculator 결과 활용
    const stockWarnings = StockCalculator.generateStockWarnings(products);
    return stockWarnings.summary;
  }

  /**
   * main.basic.js 호환 헬퍼 함수
   * 기존 stockInfo DOM 요소 업데이트와 호환
   * @param {Array<Product>} products - 상품 목록
   * @param {HTMLElement} stockInfoElement - stockInfo DOM 요소
   */
  static updateStockInfoElement(products, stockInfoElement) {
    if (!stockInfoElement) return;

    // 기존 방식과 동일하게 텍스트만 업데이트
    const stockText = StockInfo.generateSimpleStockText(products);
    stockInfoElement.textContent = stockText;
  }
}
