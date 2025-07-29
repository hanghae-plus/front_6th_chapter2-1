import { updateCartItemQuantity, updateCartItemPriceStyle } from "../../components/CartItem.js";
import { updateHeaderItemCount } from "../../components/Header.js";
import { createCartItem } from "../../components/CartItem.js";
import { discountService } from "../../services/discountService.js";
import { orderService } from "../../services/orderService.js";
import { generateStockWarningMessage } from "../../utils/stockUtils.js";
import { PRODUCT_LIST } from "../../data/product.js";

/**
 * Cart 관련 이벤트 리스너
 * 장바구니 관련 이벤트만 처리하는 전용 클래스
 */
export class CartEventListeners {
  constructor(uiEventBus, cartService) {
    this.uiEventBus = uiEventBus;
    this.cartService = cartService;
    this.initCartEventListeners();
  }

  initCartEventListeners() {
    // 장바구니 아이템 추가 이벤트 - DOM 생성 처리
    this.uiEventBus.on("cart:item:added", data => {
      console.log("Cart item added:", data);

      if (data.success) {
        // 기존 아이템 확인
        const existingCartItem = document.getElementById(data.product.id);

        if (existingCartItem) {
          // 기존 아이템이 있으면 수량 증가
          const currentQuantity = this.getCartItemQuantity(existingCartItem);
          const newQuantity = currentQuantity + 1;

          // 수량 업데이트
          updateCartItemQuantity(existingCartItem, newQuantity);
          updateCartItemPriceStyle(existingCartItem, newQuantity);
        } else {
          // 새 아이템 생성
          const discountInfo = this.calculateProductDiscountInfo(data.product);
          const newCartItem = this.createCartItemElement({
            product: data.product,
            discountInfo,
            onQuantityChange: (productId, change) => {
              // 전역 함수 호출
              if (window.handleQuantityChange) {
                window.handleQuantityChange(productId, change);
              }
            },
            onRemove: productId => {
              // 전역 함수 호출
              if (window.handleRemoveItem) {
                window.handleRemoveItem(productId);
              }
            },
          });
          document.querySelector("#cart-items").appendChild(newCartItem);
        }
      }
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
      // updateCartSummary 함수 호출
      this.updateCartSummary();
    });
  }

  updateCartSummary() {
    // 기존 updateCartSummary 로직을 여기로 이동하거나 호출
    // 현재는 main.basic.js의 updateCartSummary 함수를 호출
    const cartDisplay = document.querySelector("#cart-items");
    const cartItems = cartDisplay.children;

    // DiscountService를 사용하여 할인 계산
    const discountResult = discountService.applyAllDiscounts(Array.from(cartItems), PRODUCT_LIST);

    // UI 업데이트
    this.updateCartUI(cartItems, discountResult);
  }

  updateCartUI(cartItems, discountResult) {
    // 기존 updateCartUI 로직
    this.updateCartItemStyles(cartItems);
    this.updateHeaderItemCount();
    this.updateOrderSummaryUI(cartItems, discountResult.finalAmount, discountResult.tuesdayDiscount.applied);
    this.updateItemCountDisplay();
    this.updateStockDisplay();
  }

  updateCartItemStyles(cartItems) {
    // 기존 updateCartItemStyles 로직
    for (let i = 0; i < cartItems.length; i++) {
      const q = this.getCartItemQuantity(cartItems[i]);
      const itemDiv = cartItems[i];

      const priceElems = itemDiv.querySelectorAll(".text-lg, .text-xs");
      priceElems.forEach(elem => {
        if (elem.classList.contains("text-lg")) {
          elem.style.fontWeight = q >= 10 ? "bold" : "normal";
        }
      });
    }
  }

  getCartItemQuantity(cartItemElement) {
    const quantityElement = cartItemElement.querySelector(".quantity-number");
    return quantityElement ? parseInt(quantityElement.textContent) : 0;
  }

  updateHeaderItemCount() {
    // Header 컴포넌트의 updateHeaderItemCount 호출
    updateHeaderItemCount(this.cartService.getItemCount());
  }

  updateOrderSummaryUI(cartItems, totalAmount, isTuesday) {
    // OrderService 호출
    orderService.calculateOrderSummary(Array.from(cartItems), PRODUCT_LIST);

    // 실제 아이템 수량 계산
    const actualItemCount = Array.from(cartItems).reduce((sum, item) => {
      const quantityElement = item.querySelector(".quantity-number");
      const quantity = quantityElement ? parseInt(quantityElement.textContent) : 0;
      return sum + quantity;
    }, 0);

    orderService.calculatePoints(Array.from(cartItems), totalAmount, isTuesday, actualItemCount);
  }

  updateItemCountDisplay() {
    const itemCountElement = document.getElementById("item-count");
    if (itemCountElement) {
      const itemCnt = this.cartService.getItemCount();
      itemCountElement.textContent = "🛍️ " + itemCnt + " items in cart";
    }
  }

  updateStockDisplay() {
    const stockInfo = document.querySelector("#stock-status");
    const stockMsg = generateStockWarningMessage(PRODUCT_LIST);

    if (stockInfo) {
      stockInfo.textContent = stockMsg;
    }
  }

  // 🎯 개선: DOM 생성 관련 함수들
  calculateProductDiscountInfo(product) {
    return {
      rate: discountService.calculateProductDiscountRate(product),
      status: discountService.getProductDiscountStatus(product),
    };
  }

  createCartItemElement({ product, discountInfo, onQuantityChange, onRemove }) {
    // import된 createCartItem 함수 사용
    return createCartItem({ product, discountInfo, onQuantityChange, onRemove });
  }
}
