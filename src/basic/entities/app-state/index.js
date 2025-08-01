/**
 * AppState 엔티티 - 애플리케이션 전체 상태 관리
 */

import { INITIAL_PRODUCTS } from '../../shared/constants/index.js';

// AppState 클래스
export class AppState {
  constructor() {
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

export const appState = new AppState();
