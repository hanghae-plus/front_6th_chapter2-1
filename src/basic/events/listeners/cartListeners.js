import { updateCartItemQuantity, updateCartItemPriceStyle } from "../../components/CartItem.js";
import { updateHeaderItemCount } from "../../components/Header.js";
import { createCartItem } from "../../components/CartItem.js";
import { PRODUCT_LIST } from "../../data/product.js";
import { getSelectedProduct } from "../../components/ProductSelector.js";
import { extractNumberFromText, getCartItemQuantity } from "../../utils/domUtils.js";
import { QUANTITY_THRESHOLDS } from "../../constants/index.js";

/**
 * Cart 관련 이벤트 리스너
 * 장바구니 관련 이벤트만 처리하는 전용 클래스
 */
export class CartEventListeners {
  constructor(uiEventBus, cartService, discountService) {
    this.uiEventBus = uiEventBus;
    this.cartService = cartService;
    this.discountService = discountService;
    this.initCartEventListeners();
  }

  initCartEventListeners() {
    // 장바구니 추가 요청 이벤트 처리
    this.uiEventBus.on("cart:add:requested", () => {
      this.handleAddToCart();
    });

    // 장바구니 아이템 추가 이벤트 - DOM 생성 처리
    this.uiEventBus.on("cart:item:added", data => {
      console.log("Cart item added:", data);

      if (data.success) {
        // 기존 아이템 확인
        const existingCartItem = document.getElementById(data.product.id);

        if (existingCartItem) {
          // 기존 아이템이 있으면 수량 증가
          const currentQuantity = getCartItemQuantity(existingCartItem);
          const newQuantity = currentQuantity + 1;

          // 수량 업데이트
          updateCartItemQuantity(existingCartItem, newQuantity);
          updateCartItemPriceStyle(existingCartItem, newQuantity);
        } else {
          // 새 아이템 생성
          const discountInfo = this.discountService.calculateProductDiscountRate(data.product);
          const newCartItem = this.createCartItemElement({
            product: data.product,
            discountInfo: {
              rate: discountInfo,
              status: this.discountService.getProductDiscountStatus(data.product),
            },
            onQuantityChange: (productId, change) => {
              // Event Bus를 통해 이벤트 발생
              this.uiEventBus.emit("cart:quantity:change:requested", {
                productId,
                quantityChange: change,
              });
            },
            onRemove: productId => {
              // Event Bus를 통해 이벤트 발생
              this.uiEventBus.emit("cart:item:remove:requested", {
                productId,
              });
            },
          });
          document.querySelector("#cart-items").appendChild(newCartItem);
        }
      }
    });

    // 수량 변경 요청 이벤트 처리
    this.uiEventBus.on("cart:quantity:change:requested", data => {
      // 현재 수량 확인
      const cartItemElement = document.getElementById(data.productId);
      const currentQuantity = cartItemElement ? getCartItemQuantity(cartItemElement) : 0;
      const newQuantity = currentQuantity + data.quantityChange;

      // cartService의 수량 변경 로직 사용
      const success = this.cartService.updateCartItemQuantity(data.productId, data.quantityChange, PRODUCT_LIST);

      if (!success) {
        alert("재고가 부족합니다.");
        return;
      }

      // 이벤트 버스를 통해 UI 업데이트
      this.uiEventBus.emit("cart:quantity:changed", {
        productId: data.productId,
        quantityChange: data.quantityChange,
        newQuantity,
        success,
      });

      // UI 업데이트도 Event Bus를 통해 처리
      this.uiEventBus.emit("cart:summary:updated");
      this.uiEventBus.emit("product:options:updated", {
        products: PRODUCT_LIST,
        discountInfos: this.calculateProductDiscountInfos(PRODUCT_LIST),
        success: true,
      });
    });

    // 아이템 제거 요청 이벤트 처리
    this.uiEventBus.on("cart:item:remove:requested", data => {
      // cartService의 아이템 제거 로직 사용
      const success = this.cartService.removeProductFromCart(data.productId, PRODUCT_LIST);

      this.uiEventBus.emit("cart:item:removed", {
        productId: data.productId,
        success,
      });

      // UI 업데이트도 Event Bus를 통해 처리
      this.uiEventBus.emit("cart:summary:updated");
      this.uiEventBus.emit("product:options:updated", {
        products: PRODUCT_LIST,
        discountInfos: this.calculateProductDiscountInfos(PRODUCT_LIST),
        success: true,
      });
    });

    // 장바구니 수량 변경 이벤트 - UI 업데이트 처리
    this.uiEventBus.on("cart:quantity:changed", data => {
      const cartItemElement = document.getElementById(data.productId);
      if (!cartItemElement) return;

      if (data.newQuantity <= 0) {
        cartItemElement.remove();
      } else {
        // CartItem 컴포넌트의 함수들 사용
        updateCartItemQuantity(cartItemElement, data.newQuantity);
        updateCartItemPriceStyle(cartItemElement, data.newQuantity);
      }
    });

    // 장바구니 아이템 제거 이벤트 - UI 업데이트 처리
    this.uiEventBus.on("cart:item:removed", data => {
      if (data.success) {
        const cartItemElement = document.getElementById(data.productId);
        if (cartItemElement) {
          cartItemElement.remove();
        }
      }
    });

    // 장바구니 요약 업데이트 이벤트
    this.uiEventBus.on("cart:summary:updated", () => {
      // DOM에서 장바구니 아이템을 가져와서 이벤트로 전달
      const cartDisplay = document.querySelector("#cart-items");
      const cartItems = Array.from(cartDisplay.children);

      // 장바구니 요약 계산 요청 이벤트 발송
      this.uiEventBus.emit("cart:summary:calculation:requested", {
        cartItems,
        success: true,
      });
    });

    // 장바구니 요약 계산 요청 이벤트 처리
    this.uiEventBus.on("cart:summary:calculation:requested", data => {
      if (data.success) {
        this.handleCartSummaryUpdate(data.cartItems);
      }
    });

    // 장바구니 요약 계산 완료 이벤트 처리
    this.uiEventBus.on("cart:summary:calculated", data => {
      if (data.success) {
        this.updateCartUI(data.cartItems, data.discountResult, data.itemCount);
      }
    });

    // 장바구니 아이템 스타일 업데이트 이벤트
    this.uiEventBus.on("cart:item:styles:updated", data => {
      if (data.success) {
        this.updateCartItemStyles(data.cartItems);
      }
    });

    // 헤더 아이템 카운트 업데이트 이벤트
    this.uiEventBus.on("header:item:count:updated", data => {
      if (data.success) {
        this.updateHeaderItemCount(data.itemCount);
      }
    });

    // 아이템 카운트 디스플레이 업데이트 이벤트
    this.uiEventBus.on("item:count:display:updated", data => {
      if (data.success) {
        this.updateItemCountDisplay(data.itemCount);
      }
    });
  }

  updateCartUI(cartItems, discountResult, itemCount) {
    // 장바구니 아이템 스타일 업데이트
    this.uiEventBus.emit("cart:item:styles:updated", {
      cartItems,
      success: true,
    });

    // 헤더 아이템 카운트 업데이트
    this.uiEventBus.emit("header:item:count:updated", {
      itemCount,
      success: true,
    });

    // 주문 요약 업데이트
    this.uiEventBus.emit("order:summary:updated", {
      cartItems,
      totalAmount: discountResult.finalAmount,
      isTuesday: discountResult.tuesdayDiscount.applied,
      itemCount,
      success: true,
    });

    // 아이템 카운트 디스플레이 업데이트
    this.uiEventBus.emit("item:count:display:updated", {
      itemCount,
      success: true,
    });
  }

  updateCartItemStyles(cartItems) {
    for (let i = 0; i < cartItems.length; i++) {
      const quantity = getCartItemQuantity(cartItems[i]);
      const itemDiv = cartItems[i];

      const priceElems = itemDiv.querySelectorAll(".text-lg, .text-xs");
      priceElems.forEach(elem => {
        if (elem.classList.contains("text-lg")) {
          elem.style.fontWeight = quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT ? "bold" : "normal";
        }
      });

      // CartItem 컴포넌트의 updateCartItemPriceStyle 사용
      updateCartItemPriceStyle(itemDiv, quantity);
    }
  }

  // 헬퍼 메서드들 추가
  // getCartItemQuantity는 domUtils에서 import하여 사용

  calculateProductDiscountInfos(products) {
    return products.map(product => ({
      productId: product.id,
      rate: this.discountService.calculateProductDiscountRate(product),
      status: this.discountService.getProductDiscountStatus(product),
    }));
  }

  createCartItemElement({ product, discountInfo, onQuantityChange, onRemove }) {
    return createCartItem({ product, discountInfo, onQuantityChange, onRemove });
  }

  updateHeaderItemCount(itemCount) {
    updateHeaderItemCount(itemCount);
  }

  updateItemCountDisplay(itemCount) {
    const itemCountElement = document.getElementById("item-count");
    if (itemCountElement) {
      const previousCount = extractNumberFromText(itemCountElement.textContent);
      itemCountElement.textContent = "🛍️ " + itemCount + " items in cart";
      if (previousCount !== itemCount) {
        itemCountElement.setAttribute("data-changed", "true");
      }
    }
  }

  // 장바구니 요약 업데이트 핸들러 (Event Bus 기반)
  handleCartSummaryUpdate(cartItems = []) {
    // 순수 비즈니스 로직: 할인 계산
    const discountResult = this.discountService.applyAllDiscounts(cartItems, PRODUCT_LIST);

    // 이벤트 발송 (DOM 조작 없음)
    this.uiEventBus.emit("cart:summary:calculated", {
      cartItems,
      discountResult,
      itemCount: this.cartService.getItemCount(),
      success: true,
    });

    // 재고 정보 업데이트 요청 (이벤트 기반 통신)
    this.uiEventBus.emit("stock:update:requested");
  }

  // 장바구니 추가 처리
  handleAddToCart() {
    const selectedProductId = getSelectedProduct();

    // 1단계: 검증 로직
    const targetProduct = this.cartService.validateSelectedProduct(selectedProductId, PRODUCT_LIST);
    if (!targetProduct) return;

    // 2단계: 상태 변경 (DOM 조작 없음)
    const success = this.cartService.addProductToCart(targetProduct, 1);

    if (!success) {
      alert("재고가 부족합니다.");
      return;
    }

    // 3단계: 단일 이벤트로 모든 UI 업데이트 트리거
    this.uiEventBus.emit("cart:item:added", {
      product: targetProduct,
      success: true,
    });

    // 4단계: 요약 업데이트
    this.uiEventBus.emit("cart:summary:updated");
  }
}
