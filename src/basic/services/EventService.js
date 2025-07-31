import { EVENT_INTERVALS } from "../constants.js";

export class EventService {
  constructor(productService, cartService, uiService) {
    this.productService = productService;
    this.cartService = cartService;
    this.uiService = uiService;
    this.eventHandlers = new Map();
    this.setupEventHandlers();
  }

  // 이벤트 핸들러 설정
  setupEventHandlers() {
    // 장바구니 추가 버튼 이벤트
    this.eventHandlers.set("addToCart", this.handleAddToCart.bind(this));

    // 장바구니 아이템 이벤트 (수량 변경, 제거)
    this.eventHandlers.set(
      "cartItemAction",
      this.handleCartItemAction.bind(this)
    );

    // 이용 안내 패널 이벤트
    this.eventHandlers.set("manualPanel", this.handleManualPanel.bind(this));
  }

  // 이벤트 리스너 등록
  attachEventListeners() {
    // 장바구니 추가 버튼
    const addToCartBtn = this.uiService.getElement("addToCartBtn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener(
        "click",
        this.eventHandlers.get("addToCart")
      );
    }

    // 장바구니 아이템 액션
    const cartItems = this.uiService.getElement("cartItems");
    if (cartItems) {
      cartItems.addEventListener(
        "click",
        this.eventHandlers.get("cartItemAction")
      );
    }

    // 이용 안내 패널
    this.setupManualPanelEvents();
  }

  // 장바구니 추가 이벤트 핸들러
  handleAddToCart() {
    const productSelect = this.uiService.getElement("productSelect");
    if (!productSelect) return;

    const selectedProductId = productSelect.value;
    if (!selectedProductId) return;

    const product = this.productService.getProductById(selectedProductId);
    if (!product) return;

    try {
      this.cartService.addItem(product, 1);
      this.productService.setLastSelectedProduct(selectedProductId);
      this.updateUI();
    } catch (error) {
      alert(error.message);
    }
  }

  // 장바구니 아이템 액션 이벤트 핸들러
  handleCartItemAction(event) {
    const target = event.target;

    if (
      !target.classList.contains("quantity-change") &&
      !target.classList.contains("remove-item")
    ) {
      return;
    }

    const productId = target.dataset.productId;
    const product = this.productService.getProductById(productId);

    if (!product) return;

    try {
      if (target.classList.contains("quantity-change")) {
        const change = parseInt(target.dataset.change);
        const currentQuantity = this.cartService.getItemQuantity(productId);
        const newQuantity = currentQuantity + change;

        if (newQuantity > 0) {
          this.cartService.updateItemQuantity(productId, newQuantity, product);
        } else {
          this.cartService.removeItem(productId, product);
        }
      } else if (target.classList.contains("remove-item")) {
        this.cartService.removeItem(productId, product);
      }

      this.updateUI();
    } catch (error) {
      alert(error.message);
    }
  }

  // 이용 안내 패널 이벤트 설정
  setupManualPanelEvents() {
    const manualToggle = document.querySelector(".fixed.top-4.right-4");
    const manualOverlay = document.querySelector(".fixed.inset-0");
    const manualColumn = document.querySelector(".fixed.right-0.top-0");

    if (manualToggle && manualOverlay && manualColumn) {
      manualToggle.addEventListener("click", () => {
        manualOverlay.classList.toggle("hidden");
        manualColumn.classList.toggle("translate-x-full");
      });

      manualOverlay.addEventListener("click", (e) => {
        if (e.target === manualOverlay) {
          manualOverlay.classList.add("hidden");
          manualColumn.classList.add("translate-x-full");
        }
      });
    }
  }

  // 이용 안내 패널 이벤트 핸들러
  handleManualPanel(event) {
    // 이미 setupManualPanelEvents에서 처리됨
  }

  // UI 업데이트
  updateUI() {
    const products = this.productService.getProducts();
    const cartItems = this.cartService.getItems();
    const discountInfo = this.cartService.calculateDiscountInfo();
    const pointInfo = this.cartService.calculatePointInfo();
    const stockMessage = this.productService.getStockInfoMessage();

    // 상품 옵션 업데이트
    this.uiService.updateProductOptions(products);

    // 장바구니 업데이트
    this.uiService.updateCart(cartItems);

    // 주문 요약 업데이트
    this.uiService.updateOrderSummary(discountInfo, pointInfo);

    // 아이템 수 업데이트
    this.uiService.updateItemCount(discountInfo.totalQuantity);

    // 재고 정보 업데이트
    this.uiService.updateStockInfo(stockMessage);
  }

  // 번개세일 이벤트 시작
  startLightningSaleEvents() {
    const lightningDelay = Math.random() * 10000;

    setTimeout(() => {
      setInterval(() => {
        const luckyProduct = this.productService.applyLightningSale();
        if (luckyProduct) {
          alert(`⚡번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
          this.updateUI();
        }
      }, EVENT_INTERVALS.LIGHTNING_SALE);
    }, lightningDelay);
  }

  // 추천 할인 이벤트 시작
  startSuggestedSaleEvents() {
    const suggestedDelay = Math.random() * 20000;

    setTimeout(() => {
      setInterval(() => {
        if (this.cartService.isEmpty()) return;

        const suggestProduct = this.productService.applySuggestedSale();
        if (suggestProduct) {
          alert(
            `💝 ${suggestProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
          );
          this.updateUI();
        }
      }, EVENT_INTERVALS.SUGGESTED_SALE);
    }, suggestedDelay);
  }

  // 모든 이벤트 시작
  startAllEvents() {
    this.startLightningSaleEvents();
    this.startSuggestedSaleEvents();
  }

  // 이벤트 리스너 제거
  detachEventListeners() {
    const addToCartBtn = this.uiService.getElement("addToCartBtn");
    if (addToCartBtn) {
      addToCartBtn.removeEventListener(
        "click",
        this.eventHandlers.get("addToCart")
      );
    }

    const cartItems = this.uiService.getElement("cartItems");
    if (cartItems) {
      cartItems.removeEventListener(
        "click",
        this.eventHandlers.get("cartItemAction")
      );
    }
  }
}
