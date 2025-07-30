/**
 * AppState 엔티티 - 애플리케이션 전체 상태 관리
 */

import { PRODUCT_IDS, BUSINESS_CONSTANTS, INITIAL_PRODUCTS } from '../../shared/constants/index.js';

// AppState 클래스
export class AppState {
  constructor() {
    // 애플리케이션 상태
    this.products = [];
    this.bonusPoints = 0;
    this.itemCount = 0;
    this.lastSelection = null;
    this.totalAmount = 0;

    // DOM 요소 참조
    this.elements = {
      stockInfo: null,
      productSelect: null,
      addButton: null,
      cartDisplay: null,
      sum: null,
    };

    // 레거시 호환성을 위한 변수들
    this.totalAmt = 0;
    this.itemCnt = 0;
    this.lastSel = null;
    this.bonusPts = 0;
    this.prodList = [];
  }

  // 상태 초기화
  initialize() {
    this.totalAmount = 0;
    this.itemCount = 0;
    this.lastSelection = null;
    this.totalAmt = 0;
    this.itemCnt = 0;
    this.lastSel = null;
    this.bonusPts = 0;
  }

  // 상품 데이터 초기화
  initializeProductData() {
    this.products = [...INITIAL_PRODUCTS];
    this.prodList = this.products;
  }
}

// 전역 AppState 인스턴스
export const appState = new AppState();

// AppState에 상수 추가 (호환성을 위해)
appState.PRODUCT_IDS = PRODUCT_IDS;
appState.CONSTANTS = BUSINESS_CONSTANTS;
