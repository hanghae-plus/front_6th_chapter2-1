/**
 * AppState 엔티티 - 애플리케이션 전체 상태 관리
 */

// 상품 ID 상수
export const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_POUCH: 'p4',
  SPEAKER: 'p5',
};

// 비즈니스 로직 상수
export const CONSTANTS = {
  // 할인 관련
  BULK_DISCOUNT_THRESHOLD: 10,
  BULK_QUANTITY_THRESHOLD: 30,
  BULK_QUANTITY_DISCOUNT_RATE: 0.25,
  TUESDAY_DISCOUNT_RATE: 0.1,

  // 개별 상품 할인율
  KEYBOARD_DISCOUNT: 0.1,
  MOUSE_DISCOUNT: 0.15,
  MONITOR_ARM_DISCOUNT: 0.2,
  LAPTOP_POUCH_DISCOUNT: 0.05,
  SPEAKER_DISCOUNT: 0.25,

  // 재고 관련
  LOW_STOCK_THRESHOLD: 5,
  STOCK_WARNING_THRESHOLD: 50,

  // 포인트 관련
  POINTS_RATE: 0.001, // 0.1%
  TUESDAY_POINTS_MULTIPLIER: 2,

  // UI 관련
  TUESDAY_DAY_OF_WEEK: 2,
};

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
    this.products = [
      {
        id: PRODUCT_IDS.KEYBOARD,
        name: '버그 없애는 키보드',
        val: 10000,
        originalVal: 10000,
        q: 50,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.MOUSE,
        name: '생산성 폭발 마우스',
        val: 20000,
        originalVal: 20000,
        q: 30,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.MONITOR_ARM,
        name: '거북목 탈출 모니터암',
        val: 30000,
        originalVal: 30000,
        q: 20,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.LAPTOP_POUCH,
        name: '에러 방지 노트북 파우치',
        val: 15000,
        originalVal: 15000,
        q: 0,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.SPEAKER,
        name: `코딩할 때 듣는 Lo-Fi 스피커`,
        val: 25000,
        originalVal: 25000,
        q: 10,
        onSale: false,
        suggestSale: false,
      },
    ];
    this.prodList = this.products;
  }
}

// 전역 AppState 인스턴스
export const appState = new AppState();

// AppState에 상수 추가
appState.PRODUCT_IDS = PRODUCT_IDS;
appState.CONSTANTS = CONSTANTS;
