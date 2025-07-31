// 이벤트 스토어 - DOM 요소들의 이벤트를 중앙에서 관리
export class EventStore {
  constructor() {
    this.events = new Map();
    this.elements = new Map();
    this.handlers = {
      addToCart: null,
      cartItemClick: null,
      manualToggle: null,
      manualOverlayClick: null,
    };
  }

  // DOM 요소 등록
  registerElement(elementId, element) {
    this.elements.set(elementId, element);
  }

  // 이벤트 핸들러 등록
  registerHandler(handlerName, handler) {
    this.handlers[handlerName] = handler;
  }

  // 이벤트 바인딩
  bindEvents() {
    this.bindAddToCartEvent();
    this.bindCartItemClickEvent();
    this.bindManualToggleEvent();
    this.bindManualOverlayClickEvent();
  }

  // 장바구니 추가 버튼 이벤트
  bindAddToCartEvent() {
    const addBtn = this.elements.get("add-to-cart");
    if (addBtn && this.handlers.addToCart) {
      addBtn.addEventListener("click", this.handlers.addToCart);
    }
  }

  // 장바구니 아이템 클릭 이벤트 (수량 변경, 삭제)
  bindCartItemClickEvent() {
    const cartDisplay = this.elements.get("cart-items");
    if (cartDisplay && this.handlers.cartItemClick) {
      cartDisplay.addEventListener("click", this.handlers.cartItemClick);
    }
  }

  // 매뉴얼 토글 버튼 이벤트
  bindManualToggleEvent() {
    const manualToggle = document.querySelector(".fixed.top-4.right-4");
    if (manualToggle && this.handlers.manualToggle) {
      manualToggle.addEventListener("click", this.handlers.manualToggle);
    }
  }

  // 매뉴얼 오버레이 클릭 이벤트
  bindManualOverlayClickEvent() {
    const manualOverlay = document.querySelector(
      ".fixed.inset-0.bg-black\\/50"
    );
    if (manualOverlay && this.handlers.manualOverlayClick) {
      manualOverlay.addEventListener("click", this.handlers.manualOverlayClick);
    }
  }

  // 이벤트 해제
  unbindEvents() {
    const addBtn = this.elements.get("add-to-cart");
    const cartDisplay = this.elements.get("cart-items");
    const manualToggle = document.querySelector(".fixed.top-4.right-4");
    const manualOverlay = document.querySelector(
      ".fixed.inset-0.bg-black\\/50"
    );

    if (addBtn && this.handlers.addToCart) {
      addBtn.removeEventListener("click", this.handlers.addToCart);
    }
    if (cartDisplay && this.handlers.cartItemClick) {
      cartDisplay.removeEventListener("click", this.handlers.cartItemClick);
    }
    if (manualToggle && this.handlers.manualToggle) {
      manualToggle.removeEventListener("click", this.handlers.manualToggle);
    }
    if (manualOverlay && this.handlers.manualOverlayClick) {
      manualOverlay.removeEventListener(
        "click",
        this.handlers.manualOverlayClick
      );
    }
  }

  // 특정 이벤트 핸들러 업데이트
  updateHandler(handlerName, newHandler) {
    this.handlers[handlerName] = newHandler;
    this.rebindEvent(handlerName);
  }

  // 특정 이벤트 재바인딩
  rebindEvent(handlerName) {
    switch (handlerName) {
      case "addToCart":
        this.bindAddToCartEvent();
        break;
      case "cartItemClick":
        this.bindCartItemClickEvent();
        break;
      case "manualToggle":
        this.bindManualToggleEvent();
        break;
      case "manualOverlayClick":
        this.bindManualOverlayClickEvent();
        break;
    }
  }

  // 모든 요소 등록 및 이벤트 바인딩
  initialize(components) {
    // DOM 요소들 등록
    this.registerElement("add-to-cart", components.addBtn);
    this.registerElement("cart-items", components.cartDisplay);
    this.registerElement("product-select", components.sel);

    // 이벤트 핸들러들 등록
    this.registerHandler("addToCart", components.handleAddToCart);
    this.registerHandler("cartItemClick", components.handleCartDispClick);
    this.registerHandler("manualToggle", components.handleManualToggle);
    this.registerHandler(
      "manualOverlayClick",
      components.handleManualOverlayClick
    );

    // 이벤트 바인딩
    this.bindEvents();
  }

  // 스토어 정리
  cleanup() {
    this.unbindEvents();
    this.events.clear();
    this.elements.clear();
  }
}

// 전역 이벤트 스토어 인스턴스 생성
export const eventStore = new EventStore();
