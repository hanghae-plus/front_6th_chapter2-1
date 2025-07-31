import { CSS_CLASSES, STOCK_THRESHOLDS } from "../constants.js";

export class UIService {
  constructor() {
    this.elements = {};
    this.initializeElements();
  }

  // DOM 요소 초기화
  initializeElements() {
    this.elements = {
      app: document.getElementById("app"),
      productSelect: null,
      addToCartBtn: null,
      stockInfo: null,
      cartItems: null,
      itemCount: null,
      summaryDetails: null,
      cartTotal: null,
      loyaltyPoints: null,
      discountInfo: null,
      tuesdaySpecial: null,
    };
  }

  // 헤더 렌더링
  renderHeader() {
    const header = document.createElement("div");
    header.className = "mb-8";
    header.innerHTML = `
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
    `;
    this.elements.itemCount = header.querySelector("#item-count");
    return header;
  }

  // 상품 선택 영역 렌더링
  renderProductSelector() {
    const leftColumn = document.createElement("div");
    leftColumn.className =
      "bg-white border border-gray-200 p-8 overflow-y-auto";

    const selectorContainer = document.createElement("div");
    selectorContainer.className = "mb-6 pb-6 border-b border-gray-200";

    // 상품 선택 드롭다운
    const productSelect = document.createElement("select");
    productSelect.id = "product-select";
    productSelect.className =
      "w-full p-3 border border-gray-300 rounded-lg text-base mb-3";
    this.elements.productSelect = productSelect;

    // 장바구니 추가 버튼
    const addToCartBtn = document.createElement("button");
    addToCartBtn.id = "add-to-cart";
    addToCartBtn.innerHTML = "Add to Cart";
    addToCartBtn.className =
      "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";
    this.elements.addToCartBtn = addToCartBtn;

    // 재고 정보
    const stockInfo = document.createElement("div");
    stockInfo.id = "stock-status";
    stockInfo.className = "text-xs text-red-500 mt-3 whitespace-pre-line";
    this.elements.stockInfo = stockInfo;

    // 장바구니 아이템 컨테이너
    const cartItems = document.createElement("div");
    cartItems.id = "cart-items";
    this.elements.cartItems = cartItems;

    selectorContainer.appendChild(productSelect);
    selectorContainer.appendChild(addToCartBtn);
    selectorContainer.appendChild(stockInfo);
    leftColumn.appendChild(selectorContainer);
    leftColumn.appendChild(cartItems);

    return leftColumn;
  }

  // 주문 요약 영역 렌더링
  renderOrderSummary() {
    const rightColumn = document.createElement("div");
    rightColumn.className = "bg-black text-white p-8 flex flex-col";
    rightColumn.innerHTML = `
      <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div class="flex-1 flex flex-col">
        <div id="summary-details" class="space-y-3"></div>
        <div class="mt-auto">
          <div id="discount-info" class="mb-4"></div>
          <div id="cart-total" class="pt-5 border-t border-white/10">
            <div class="flex justify-between items-baseline">
              <span class="text-sm uppercase tracking-wider">Total</span>
              <div class="text-2xl tracking-tight">₩0</div>
            </div>
            <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
          </div>
          <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
            <div class="flex items-center gap-2">
              <span class="text-2xs">🎉</span>
              <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
            </div>
          </div>
        </div>
      </div>
      <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
        Proceed to Checkout
      </button>
      <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.<br>
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    `;

    this.elements.summaryDetails =
      rightColumn.querySelector("#summary-details");
    this.elements.cartTotal = rightColumn.querySelector("#cart-total");
    this.elements.loyaltyPoints = rightColumn.querySelector("#loyalty-points");
    this.elements.discountInfo = rightColumn.querySelector("#discount-info");
    this.elements.tuesdaySpecial =
      rightColumn.querySelector("#tuesday-special");

    return rightColumn;
  }

  // 이용 안내 패널 렌더링
  renderManualPanel() {
    const manualToggle = document.createElement("button");
    manualToggle.className =
      "fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50";
    manualToggle.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    `;

    const manualOverlay = document.createElement("div");
    manualOverlay.className =
      "fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300";

    const manualColumn = document.createElement("div");
    manualColumn.className =
      "fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300";
    manualColumn.innerHTML = `
      <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
      <div class="mb-6">
        <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
        <div class="space-y-3">
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">개별 상품</p>
            <p class="text-gray-700 text-xs pl-2">
              • 키보드 10개↑: 10%<br>
              • 마우스 10개↑: 15%<br>
              • 모니터암 10개↑: 20%<br>
              • 스피커 10개↑: 25%
            </p>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">전체 수량</p>
            <p class="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">특별 할인</p>
            <p class="text-gray-700 text-xs pl-2">
              • 화요일: +10%<br>
              • ⚡번개세일: 20%<br>
              • 💝추천할인: 5%
            </p>
          </div>
        </div>
      </div>
      <div class="mb-6">
        <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
        <div class="space-y-3">
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">기본</p>
            <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">추가</p>
            <p class="text-gray-700 text-xs pl-2">
              • 화요일: 2배<br>
              • 키보드+마우스: +50p<br>
              • 풀세트: +100p<br>
              • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
            </p>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-200 pt-4 mt-4">
        <p class="text-xs font-bold mb-1">💡 TIP</p>
        <p class="text-2xs text-gray-600 leading-relaxed">
          • 화요일 대량구매 = MAX 혜택<br>
          • ⚡+💝 중복 가능<br>
          • 상품4 = 품절
        </p>
      </div>
    `;

    manualOverlay.appendChild(manualColumn);
    return { manualToggle, manualOverlay };
  }

  // 상품 옵션 업데이트
  updateProductOptions(products) {
    if (!this.elements.productSelect) return;

    this.elements.productSelect.innerHTML = "";

    const totalStock = products.reduce(
      (sum, product) => sum + product.stock,
      0
    );

    products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.id;

      const { text, className } = this.getProductOptionText(product);
      option.textContent = text;

      if (product.isOutOfStock()) {
        option.disabled = true;
        option.className = className;
      } else if (className) {
        option.className = className;
      }

      this.elements.productSelect.appendChild(option);
    });

    // 재고 부족 시 경고 표시
    if (totalStock < STOCK_THRESHOLDS.WARNING_TOTAL) {
      this.elements.productSelect.style.borderColor = "orange";
    } else {
      this.elements.productSelect.style.borderColor = "";
    }
  }

  // 상품 옵션 텍스트 생성
  getProductOptionText(product) {
    let text = product.name;
    let className = "";

    if (product.isOutOfStock()) {
      text += ` - ${product.price}원 (품절)`;
      if (product.onSale) text += " ⚡SALE";
      if (product.suggestSale) text += " 💝추천";
      className = CSS_CLASSES.SALE_INDICATORS.DISABLED;
    } else {
      if (product.onSale && product.suggestSale) {
        text = `⚡💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (25% SUPER SALE!)`;
        className = CSS_CLASSES.SALE_INDICATORS.COMBINED;
      } else if (product.onSale) {
        text = `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원 (20% SALE!)`;
        className = CSS_CLASSES.SALE_INDICATORS.LIGHTNING;
      } else if (product.suggestSale) {
        text = `💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (5% 추천할인!)`;
        className = CSS_CLASSES.SALE_INDICATORS.SUGGESTED;
      } else {
        text += ` - ${product.price}원`;
        if (product.onSale) text += " ⚡SALE";
        if (product.suggestSale) text += " 💝추천";
      }
    }

    return { text, className };
  }

  // 장바구니 아이템 렌더링
  renderCartItem(cartItem) {
    const itemElement = document.createElement("div");
    itemElement.id = cartItem.productId;
    itemElement.className =
      "grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0";

    const salePrefix = this.getSalePrefix(cartItem.saleStatus);
    const priceDisplay = this.getPriceDisplay(cartItem);

    itemElement.innerHTML = `
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${salePrefix}${cartItem.name}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${priceDisplay}</p>
        <div class="flex items-center gap-4">
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${cartItem.productId}" data-change="-1">−</button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${cartItem.quantity}</span>
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${cartItem.productId}" data-change="1">+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${cartItem.productId}">Remove</a>
      </div>
    `;

    return itemElement;
  }

  // 할인 접두사 가져오기
  getSalePrefix(saleStatus) {
    switch (saleStatus) {
      case "COMBINED":
        return "⚡💝";
      case "LIGHTNING":
        return "⚡";
      case "SUGGESTED":
        return "💝";
      default:
        return "";
    }
  }

  // 가격 표시 생성
  getPriceDisplay(cartItem) {
    if (cartItem.saleStatus !== "NONE") {
      const colorClass = this.getPriceColorClass(cartItem.saleStatus);
      return `<span class="line-through text-gray-400">₩${cartItem.originalPrice.toLocaleString()}</span> <span class="${colorClass}">₩${cartItem.price.toLocaleString()}</span>`;
    }
    return `₩${cartItem.price.toLocaleString()}`;
  }

  // 가격 색상 클래스 가져오기
  getPriceColorClass(saleStatus) {
    switch (saleStatus) {
      case "COMBINED":
        return "text-purple-600";
      case "LIGHTNING":
        return "text-red-500";
      case "SUGGESTED":
        return "text-blue-500";
      default:
        return "";
    }
  }

  // 장바구니 업데이트
  updateCart(cartItems) {
    if (!this.elements.cartItems) return;

    this.elements.cartItems.innerHTML = "";
    cartItems.forEach((cartItem) => {
      const itemElement = this.renderCartItem(cartItem);
      this.elements.cartItems.appendChild(itemElement);
    });
  }

  // 주문 요약 업데이트
  updateOrderSummary(discountInfo, pointInfo) {
    this.updateSummaryDetails(discountInfo);
    this.updateCartTotal(discountInfo);
    this.updateLoyaltyPoints(pointInfo);
    this.updateDiscountInfo(discountInfo);
    this.updateTuesdaySpecial(discountInfo);
  }

  // 요약 상세 정보 업데이트
  updateSummaryDetails(discountInfo) {
    if (!this.elements.summaryDetails) return;

    this.elements.summaryDetails.innerHTML = "";

    if (discountInfo.items.length === 0) return;

    // 상품별 요약
    discountInfo.items.forEach((item) => {
      const itemTotal = item.getTotalPrice();
      this.elements.summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${item.name} x ${item.quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    });

    // 소계
    this.elements.summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${discountInfo.originalTotal.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보
    if (discountInfo.discountRate > 0) {
      this.elements.summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 총 할인</span>
          <span class="text-xs">-${discountInfo.discountRate.toFixed(1)}%</span>
        </div>
      `;
    }

    // 배송 정보
    this.elements.summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  // 장바구니 총액 업데이트
  updateCartTotal(discountInfo) {
    if (!this.elements.cartTotal) return;

    const totalElement = this.elements.cartTotal.querySelector(".text-2xl");
    if (totalElement) {
      totalElement.textContent = `₩${Math.round(
        discountInfo.finalPrice
      ).toLocaleString()}`;
    }
  }

  // 포인트 정보 업데이트
  updateLoyaltyPoints(pointInfo) {
    if (!this.elements.loyaltyPoints) return;

    if (pointInfo.totalPoints > 0) {
      this.elements.loyaltyPoints.innerHTML = `
        <div>적립 포인트: <span class="font-bold">${
          pointInfo.totalPoints
        }p</span></div>
        <div class="text-2xs opacity-70 mt-1">${pointInfo.pointDetails.join(
          ", "
        )}</div>
      `;
    } else {
      this.elements.loyaltyPoints.textContent = "적립 포인트: 0p";
    }
  }

  // 할인 정보 업데이트
  updateDiscountInfo(discountInfo) {
    if (!this.elements.discountInfo) return;

    if (discountInfo.discountRate > 0 && discountInfo.finalPrice > 0) {
      this.elements.discountInfo.innerHTML = `
        <div class="bg-green-500/20 rounded-lg p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
            <span class="text-sm font-medium text-green-400">${discountInfo.discountRate.toFixed(
              1
            )}%</span>
          </div>
          <div class="text-2xs text-gray-300">₩${Math.round(
            discountInfo.discountAmount
          ).toLocaleString()} 할인되었습니다</div>
        </div>
      `;
    } else {
      this.elements.discountInfo.innerHTML = "";
    }
  }

  // 화요일 특별 할인 업데이트
  updateTuesdaySpecial(discountInfo) {
    if (!this.elements.tuesdaySpecial) return;

    const today = new Date();
    const isTuesday = today.getDay() === 2;

    if (isTuesday && discountInfo.finalPrice > 0) {
      this.elements.tuesdaySpecial.classList.remove("hidden");
    } else {
      this.elements.tuesdaySpecial.classList.add("hidden");
    }
  }

  // 아이템 수 업데이트
  updateItemCount(totalQuantity) {
    if (!this.elements.itemCount) return;
    this.elements.itemCount.textContent = `🛍️ ${totalQuantity} items in cart`;
  }

  // 재고 정보 업데이트
  updateStockInfo(stockMessage) {
    if (!this.elements.stockInfo) return;
    this.elements.stockInfo.textContent = stockMessage;
  }

  // DOM 요소 가져오기
  getElement(name) {
    return this.elements[name];
  }
}
