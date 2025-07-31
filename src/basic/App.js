import { ProductService } from "./services/ProductService.js";
import { CartService } from "./services/CartService.js";
import { UIService } from "./services/UIService.js";
import { EventService } from "./services/EventService.js";

export class ShoppingCartApp {
  constructor() {
    this.productService = new ProductService();
    this.cartService = new CartService();
    this.uiService = new UIService();
    this.eventService = new EventService(
      this.productService,
      this.cartService,
      this.uiService
    );
  }

  // 애플리케이션 초기화
  init() {
    this.render();
    this.setupEventListeners();
    this.startEvents();
    this.updateUI();
  }

  // UI 렌더링
  render() {
    const app = this.uiService.getElement("app");
    if (!app) return;

    // 기존 내용 제거
    app.innerHTML = "";

    // 헤더 렌더링
    const header = this.uiService.renderHeader();
    app.appendChild(header);

    // 메인 컨테이너 생성
    const gridContainer = document.createElement("div");
    gridContainer.className =
      "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";

    // 왼쪽 컬럼 (상품 선택 + 장바구니)
    const leftColumn = this.uiService.renderProductSelector();
    gridContainer.appendChild(leftColumn);

    // 오른쪽 컬럼 (주문 요약)
    const rightColumn = this.uiService.renderOrderSummary();
    gridContainer.appendChild(rightColumn);

    app.appendChild(gridContainer);

    // 이용 안내 패널 렌더링
    const { manualToggle, manualOverlay } = this.uiService.renderManualPanel();
    app.appendChild(manualToggle);
    app.appendChild(manualOverlay);
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    this.eventService.attachEventListeners();
  }

  // 이벤트 시작
  startEvents() {
    this.eventService.startAllEvents();
  }

  // UI 업데이트
  updateUI() {
    this.eventService.updateUI();
  }

  // 애플리케이션 정리
  destroy() {
    this.eventService.detachEventListeners();
  }

  // 상품 서비스 가져오기
  getProductService() {
    return this.productService;
  }

  // 장바구니 서비스 가져오기
  getCartService() {
    return this.cartService;
  }

  // UI 서비스 가져오기
  getUIService() {
    return this.uiService;
  }

  // 이벤트 서비스 가져오기
  getEventService() {
    return this.eventService;
  }
}
