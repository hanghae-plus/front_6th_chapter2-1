import { ProductOption } from "../../components/ProductOption.js";
import {
  calculateCartData,
  generateSelectOptionsData,
  generateStockStatusMessage,
  calculateBonusPoints,
} from "../../domains/index.js";

// 상품 선택 옵션 업데이트
export function updateSelectOptions(selectElement, products) {
  const { options, totalStock } = generateSelectOptionsData(products);

  selectElement.innerHTML = "";

  options.forEach((optionData) => {
    const opt = ProductOption(optionData);
    selectElement.appendChild(opt);
  });

  if (totalStock < 50) {
    selectElement.style.borderColor = "orange";
  } else {
    selectElement.style.borderColor = "";
  }
}

// 재고 정보 표시 업데이트
export function updateStockInfo(stockElement, products) {
  const message = generateStockStatusMessage(products);
  stockElement.textContent = message;
}

// 장바구니 아이템 가격 업데이트
export function updateCartPrices(cartElement, products) {
  const cartItems = cartElement.children;

  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    const product = products.find((p) => p.id === itemId);
    if (!product) continue;

    const priceDiv = cartItems[i].querySelector(".text-lg");
    const nameDiv = cartItems[i].querySelector("h3");

    if (product.onSale && product.suggestSale) {
      priceDiv.innerHTML =
        '<span class="line-through text-gray-400">₩' +
        product.originalVal.toLocaleString() +
        '</span> <span class="text-purple-600">₩' +
        product.val.toLocaleString() +
        "</span>";
      nameDiv.textContent = "⚡💝" + product.name;
    } else if (product.onSale) {
      priceDiv.innerHTML =
        '<span class="line-through text-gray-400">₩' +
        product.originalVal.toLocaleString() +
        '</span> <span class="text-red-500">₩' +
        product.val.toLocaleString() +
        "</span>";
      nameDiv.textContent = "⚡" + product.name;
    } else if (product.suggestSale) {
      priceDiv.innerHTML =
        '<span class="line-through text-gray-400">₩' +
        product.originalVal.toLocaleString() +
        '</span> <span class="text-blue-500">₩' +
        product.val.toLocaleString() +
        "</span>";
      nameDiv.textContent = "💝" + product.name;
    } else {
      priceDiv.textContent = "₩" + product.val.toLocaleString();
      nameDiv.textContent = product.name;
    }
  }
}

// 적립 포인트 정보 렌더링
export function renderBonusPoints(
  loyaltyElement,
  cartElement,
  totalAmount,
  itemCount,
  products
) {
  if (cartElement.children.length === 0) {
    loyaltyElement.style.display = "none";
    return;
  }

  const cartItems = Array.from(cartElement.children);
  const { points, details } = calculateBonusPoints(
    totalAmount,
    itemCount,
    cartItems,
    products
  );

  if (points > 0) {
    loyaltyElement.innerHTML =
      '<div>적립 포인트: <span class="font-bold">' +
      points +
      "p</span></div>" +
      '<div class="text-2xs opacity-70 mt-1">' +
      details.join(", ") +
      "</div>";
    loyaltyElement.style.display = "block";
  } else {
    loyaltyElement.textContent = "적립 포인트: 0p";
    loyaltyElement.style.display = "block";
  }

  return points;
}

// 장바구니 전체 계산 및 화면 렌더링
export function calculateAndRenderCart(state, elements) {
  const cartData = calculateCartData(
    state.prodList,
    Array.from(elements.cartDisp.children)
  );

  // 상태 업데이트
  state.totalAmt = cartData.totalAmount;
  state.itemCnt = cartData.itemCount;

  // 아이템 카운트 업데이트
  document.getElementById(
    "item-count"
  ).textContent = `🛍️ ${state.itemCnt} items in cart`;

  // 요약 정보 렌더링
  const summaryDetails = document.getElementById("summary-details");
  summaryDetails.innerHTML = "";

  if (cartData.subTotal > 0) {
    // 각 아이템 표시
    for (let i = 0; i < elements.cartDisp.children.length; i++) {
      const cartItem = elements.cartDisp.children[i];
      const product = state.prodList.find((p) => p.id === cartItem.id);
      if (!product) continue;

      const qtyElem = cartItem.querySelector(".quantity-number");
      const quantity = parseInt(qtyElem.textContent);
      const itemTotal = product.val * quantity;

      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${product.name} x ${quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${cartData.subTotal.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 표시
    if (state.itemCnt >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (cartData.itemDiscounts.length > 0) {
      cartData.itemDiscounts.forEach((item) => {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    if (cartData.isTuesday && state.totalAmt > 0) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  // 총액 업데이트
  const totalDiv = elements.sum.querySelector(".text-2xl");
  if (totalDiv) {
    totalDiv.textContent = "₩" + Math.round(state.totalAmt).toLocaleString();
  }

  // 할인 정보 업데이트
  const discountInfoDiv = document.getElementById("discount-info");
  discountInfoDiv.innerHTML = "";
  if (cartData.discountRate > 0 && state.totalAmt > 0) {
    const savedAmount = cartData.subTotal - state.totalAmt;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(
            cartData.discountRate * 100
          ).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(
          savedAmount
        ).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  // 화요일 특별 할인 배너
  const tuesdaySpecial = document.getElementById("tuesday-special");
  if (cartData.isTuesday && state.totalAmt > 0) {
    tuesdaySpecial.classList.remove("hidden");
  } else {
    tuesdaySpecial.classList.add("hidden");
  }

  // 재고 정보 업데이트
  updateStockInfo(elements.stockInfo, state.prodList);

  // 포인트 정보 렌더링
  const loyaltyElement = document.getElementById("loyalty-points");
  state.bonusPts = renderBonusPoints(
    loyaltyElement,
    elements.cartDisp,
    state.totalAmt,
    state.itemCnt,
    state.prodList
  );
}
