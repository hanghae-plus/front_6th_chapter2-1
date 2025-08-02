import { calculateBasePoint, getBulkBonusPoint, getSetBonusPoint } from './features/point/service';
import { PRODUCT_ID, productList } from './features/product/constants';
import { renderCartProduct, renderProductSelectOptions, renderStockInfo } from './features/product/render';
import { applyLightningSale, applySuggestSale, getProductDiscountRate } from './features/product/service';
import {
  addButton,
  cartContainerEl,
  DiscountInfo,
  LoyaltyPoints,
  NewCartProduct,
  selector,
  setupDom,
  stockInfo,
} from './templates';
import { isTuesday } from './utils/date';

let itemCount;
let lastSelector;
let sum;
let totalAmount = 0;

function main() {
  setupDom();

  totalAmount = 0;
  itemCount = 0;
  lastSelector = null;
  sum = document.querySelector('#cart-total');

  renderProductSelectOptions(selector, productList);
  handleCalculateCartStuff();

  setTimeout(() => {
    setInterval(function () {
      const lightningSale = applyLightningSale(productList);

      if (lightningSale) {
        alert(lightningSale.message);
        renderProductSelectOptions(selector, productList);
        renderPricesInCart();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelector) {
        const suggestSale = applySuggestSale(productList, lastSelector);

        if (suggestSale) {
          alert(suggestSale.message);
          renderProductSelectOptions(selector, productList);
          renderPricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function handleCalculateCartStuff() {
  const cartProductsEl = Array.from(cartContainerEl.children);
  const itemDiscounts = [];

  let subTotal = 0;
  let originalTotal;
  let savedAmount;

  const summaryDetails = document.getElementById('summary-details');
  const discountInfoDiv = document.getElementById('discount-info');
  const itemCountEl = document.getElementById('item-count');
  const tuesdaySpecial = document.getElementById('tuesday-special');
  const totalDiv = sum.querySelector('.text-2xl');
  const previousCount = parseInt(itemCountEl.textContent.match(/\d+/) || 0);

  totalAmount = 0;
  itemCount = 0;
  originalTotal = totalAmount;

  cartProductsEl.forEach((cartProductEl) => {
    const cartProduct = productList.find((product) => product.id === cartProductEl.id);

    const quantityEl = cartProductEl.querySelector('.quantity-number');
    const priceEl = cartProductEl.querySelectorAll('.text-lg');
    const quantity = parseInt(quantityEl.textContent);
    const cartProductTotalAmount = cartProduct.value * quantity;

    let discount = 0;

    itemCount += quantity;
    subTotal += cartProductTotalAmount;

    priceEl.forEach((el) => {
      el.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
    });

    if (quantity >= 10) {
      discount = getProductDiscountRate(cartProduct);
    }

    if (discount > 0) {
      itemDiscounts.push({ name: cartProduct.name, discount: discount * 100 });
    }

    totalAmount += cartProductTotalAmount * (1 - discount);
  });

  let discountRate = 0;
  originalTotal = subTotal;

  if (itemCount >= 30) {
    totalAmount = (subTotal * 75) / 100;
    discountRate = 25 / 100;
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  if (isTuesday() && totalAmount > 0) {
    totalAmount = (totalAmount * 90) / 100;
    discountRate = 1 - totalAmount / originalTotal;

    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  itemCountEl.textContent = `🛍️ ${itemCount} items in cart`;
  summaryDetails.innerHTML = '';

  if (subTotal > 0) {
    cartProductsEl.forEach((cartItemEl) => {
      const product = productList.find((_product) => _product.id === cartItemEl.id);

      const quantityEl = cartItemEl.querySelector('.quantity-number');
      const quantity = parseInt(quantityEl.textContent);
      const itemTotal = product.value * quantity;

      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${product.name} x ${quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    });

    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTotal.toLocaleString()}</span>
      </div>
    `;

    if (itemCount >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach((itemDiscount) => {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${itemDiscount.name} (10개↑)</span>
            <span class="text-xs">-${itemDiscount.discount}%</span>
          </div>
        `;
      });
    }

    if (isTuesday() && totalAmount) {
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

  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmount).toLocaleString();
  }

  discountInfoDiv.innerHTML = '';

  if (discountRate > 0 && totalAmount > 0) {
    savedAmount = originalTotal - totalAmount;

    discountInfoDiv.innerHTML = DiscountInfo({
      discountRate: (discountRate * 100).toFixed(1),
      savedAmount: Math.round(savedAmount).toLocaleString(),
    });
  }

  if (itemCountEl) {
    itemCountEl.textContent = `🛍️ ${itemCount} items in cart`;

    if (previousCount !== itemCount) {
      itemCountEl.setAttribute('data-changed', 'true');
    }
  }

  renderStockInfo(stockInfo, productList);
  renderBonusPoints();
}

const renderBonusPoints = () => {
  const loyaltyPointsEl = document.getElementById('loyalty-points');
  const cartProductEls = Array.from(cartContainerEl.children);
  const hasKeyboard = cartProductEls.some((el) => el.id === PRODUCT_ID.KEYBOARD);
  const hasMouse = cartProductEls.some((el) => el.id === PRODUCT_ID.MOUSE);
  const hasMonitorArm = cartProductEls.some((el) => el.id === PRODUCT_ID.MONITOR_ARM);

  const basePoints = calculateBasePoint(totalAmount);
  const pointsDetailText = [];
  let finalPoints = 0;

  // 장바구니에 상품이 없으면 loyalty-points 요소 숨김
  if (cartProductEls.length === 0) {
    loyaltyPointsEl.style.display = 'none';

    return;
  }

  // 기본 포인트가 0보다 크면 기본 포인트 문구 추가, 최종 포인트 업데이트
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetailText.push('기본: ' + basePoints + 'p');
  }

  // 기본 포인트가 0보다 크고 화요일인 경우 문구 추가, 최종 포인트 2배로 업데이트
  if (isTuesday() && basePoints > 0) {
    finalPoints = basePoints * 2;
    pointsDetailText.push('화요일 2배');
  }

  const setBonusPoint = getSetBonusPoint({
    hasKeyboard,
    hasMouse,
    hasMonitorArm,
  });

  setBonusPoint.forEach(({ label, point }) => {
    finalPoints += point;
    pointsDetailText.push(label);
  });

  const bulkBonusPoint = getBulkBonusPoint(itemCount);

  if (bulkBonusPoint) {
    finalPoints += bulkBonusPoint.point;
    pointsDetailText.push(bulkBonusPoint.label);
  }

  if (loyaltyPointsEl && finalPoints > 0) {
    loyaltyPointsEl.innerHTML = LoyaltyPoints({ finalPoints, pointsDetail: pointsDetailText.join(', ') });
    loyaltyPointsEl.style.display = 'block';
  }
};

const renderPricesInCart = () => {
  const cartProductsEl = Array.from(cartContainerEl.children);

  cartProductsEl.forEach((cartProductEl) => {
    const cartProduct = productList.find((product) => product.id === cartProductEl.id);

    if (cartProduct) {
      renderCartProduct(cartProductEl, cartProduct);
    }
  });

  handleCalculateCartStuff();
};

main();

addButton.addEventListener('click', function () {
  const selectedProductId = selector.value;
  const selectedProduct = productList.find((product) => product.id === selectedProductId);

  if (!selectedProductId || !selectedProduct) {
    return;
  }

  if (selectedProduct && selectedProduct.quantity > 0) {
    const selectedProductEl = document.getElementById(selectedProduct.id);

    if (selectedProductEl) {
      const quantityEl = selectedProductEl.querySelector('.quantity-number');
      const quantity = parseInt(quantityEl.textContent);
      const newQuantity = quantity + 1;

      if (newQuantity <= selectedProduct.quantity + quantity) {
        quantityEl.textContent = newQuantity;
        selectedProduct['quantity']--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = selectedProduct.id;
      newItem.className = `grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0`;
      newItem.innerHTML = NewCartProduct(selectedProduct);

      cartContainerEl.appendChild(newItem);
      selectedProduct.quantity--;
    }

    handleCalculateCartStuff();
    lastSelector = selectedProductId;
  }
});

cartContainerEl.addEventListener('click', function (event) {
  const target = event.target;

  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    const productId = target.dataset.productId;
    const productEl = document.getElementById(productId);
    const product = productList.find((el) => el.id === productId);
    const quantityEl = productEl.querySelector('.quantity-number');

    if (target.classList.contains('quantity-change')) {
      const quantityChange = parseInt(target.dataset.change);
      const currentQuantity = parseInt(quantityEl.textContent);
      const newQuantity = currentQuantity + quantityChange;

      if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
        quantityEl.textContent = newQuantity;
        product.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        product.quantity += currentQuantity;
        productEl.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    }

    if (target.classList.contains('remove-item')) {
      const remQuantity = parseInt(quantityEl.textContent);
      product.quantity += remQuantity;
      productEl.remove();
    }

    handleCalculateCartStuff();
    renderProductSelectOptions(selector, productList);
  }
});
