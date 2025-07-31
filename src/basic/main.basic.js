import AddButton from './components/AddButton';
import CartItems from './components/CartItems';
import GridContainer from './components/GridContainer';
import Header from './components/Header';
import LeftColumn from './components/LeftColumn';
import ManualColumn from './components/ManualColumn';
import ManualOverlay from './components/ManualOverlay';
import ManualToggle from './components/ManualToggle';
import RightColumn from './components/RightColumn';
import Selector from './components/Selector';
import SelectorContainer from './components/SelectorContainer';
import StockStatus from './components/StockStatus';
import {
  PRODUCT_ONE,
  PRODUCT_TWO,
  PRODUCT_THREE,
  PRODUCT_FOUR,
  PRODUCT_FIVE,
  TEN_PERCENT,
  FIFTEEN_PERCENT,
  TWENTY_PERCENT,
  FIVE_PERCENT,
  TWENTY_FIVE_PERCENT,
  DISCOUNT_STANDARD_COUNT,
  VOLUME_ORDER_COUNT,
} from './constants/enum';
import { renderBonusPoints, renderSelectorOption } from './render';
import store from './store';
import { getStockInfoMessage } from './utils';
import { getProductDiscount } from './utils/discount';

const { productStore } = store;

let latestSelectedProduct = null;

const $selector = Selector();
const $addButton = AddButton();
const $cartItems = CartItems();
const $stockStatus = StockStatus();

function calcCart() {
  let totalAmount = 0;
  let itemCount = 0;
  let subTotal = 0;

  const cartItemList = Array.from($cartItems.children);

  const itemDiscounts = [];

  const productList = productStore.getProductList();

  cartItemList.forEach((cartItem) => {
    const product = productStore.getProductById(cartItem.id);

    const $quantityNumber = cartItem.querySelector('.quantity-number');

    const quantity = parseInt($quantityNumber.textContent);
    const itemTotal = product.value * quantity;

    let discount = 0;

    itemCount += quantity;
    subTotal += itemTotal;

    const $price = cartItem.querySelectorAll('.text-lg, .text-xs');
    $price.forEach((element) => {
      if (element.classList.contains('text-lg')) {
        element.style.fontWeight = quantity >= DISCOUNT_STANDARD_COUNT ? 'bold' : 'normal';
      }
    });

    if (quantity >= DISCOUNT_STANDARD_COUNT) {
      if (product.id === PRODUCT_ONE) {
        discount = TEN_PERCENT;
      } else if (product.id === PRODUCT_TWO) {
        discount = FIFTEEN_PERCENT;
      } else if (product.id === PRODUCT_THREE) {
        discount = TWENTY_PERCENT;
      } else if (product.id === PRODUCT_FOUR) {
        discount = FIVE_PERCENT;
      } else if (product.id === PRODUCT_FIVE) {
        discount = TWENTY_FIVE_PERCENT;
      }

      if (discount > 0) {
        itemDiscounts.push({ name: product.name, discount: discount * 100 });
      }
    }

    totalAmount += itemTotal * (1 - discount);
  });

  let discountRate = 0;
  const originalTotal = subTotal;

  if (itemCount >= VOLUME_ORDER_COUNT) {
    totalAmount = (subTotal * 75) / 100;
    discountRate = TWENTY_FIVE_PERCENT;
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  const today = new Date();
  const isTuesday = today.getDay() === 2; // TODO 화요일
  const $tuesdaySpecial = document.getElementById('tuesday-special');

  if (isTuesday) {
    if (totalAmount > 0) {
      totalAmount = (totalAmount * 90) / 100;

      discountRate = 1 - totalAmount / originalTotal;
      $tuesdaySpecial.classList.remove('hidden');
    } else {
      $tuesdaySpecial.classList.add('hidden');
    }
  } else {
    $tuesdaySpecial.classList.add('hidden');
  }

  const $itemCount = document.getElementById('item-count');
  $itemCount.textContent = `🛍️ ${itemCount} items in cart`;

  const $summaryDetails = document.getElementById('summary-details');
  $summaryDetails.innerHTML = '';

  if (subTotal > 0) {
    cartItemList.forEach((cartItem) => {
      const product = productStore.getProductById(cartItem.id);

      const $quantityNumber = cartItem.querySelector('.quantity-number');
      const quantity = parseInt($quantityNumber.textContent);
      const itemTotal = product.value * quantity;

      $summaryDetails.innerHTML += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${product.name} x ${quantity}</span>
        <span>₩${itemTotal.toLocaleString()}</span>
      </div>
      `;
    });

    $summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTotal.toLocaleString()}</span>
      </div>
    `;

    if (itemCount >= VOLUME_ORDER_COUNT) {
      $summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        $summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    if (isTuesday) {
      if (totalAmount > 0) {
        $summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }

    $summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  const $cartTotal = document.querySelector('#cart-total .text-2xl');

  if ($cartTotal) {
    $cartTotal.textContent = `₩${Math.round(totalAmount).toLocaleString()}`;
  }

  const $loyaltyPoints = document.getElementById('loyalty-points');

  if ($loyaltyPoints) {
    const points = Math.floor(totalAmount / 1000);

    if (points > 0) {
      $loyaltyPoints.textContent = `적립 포인트: ${points}p`;
      $loyaltyPoints.style.display = 'block';
    } else {
      $loyaltyPoints.textContent = '적립 포인트: 0p';
      $loyaltyPoints.style.display = 'block';
    }
  }

  const $discountInfo = document.getElementById('discount-info');
  $discountInfo.innerHTML = '';

  if (discountRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
    $discountInfo.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  if ($itemCount) {
    const previousCount = parseInt($itemCount.textContent.match(/\d+/) || 0);
    $itemCount.textContent = `🛍️ ${itemCount} items in cart`;
    if (previousCount !== itemCount) {
      $itemCount.setAttribute('data-changed', 'true');
    }
  }

  $stockStatus.textContent = getStockInfoMessage(productList);

  renderBonusPoints(totalAmount, itemCount);
}

// 메인 엔트리 포인트
function calcCart() {
  const cartItemList = Array.from($cartItems.children);
  const productList = productStore.getProductList();

  // 상품 데이터, 총수량, 할인 추출
  const { items, itemCount, subTotal, itemDiscounts } = getCartItemsData(
    cartItemList,
    productStore,
  );

  // 대량주문 할인 우선 적용
  let totalAmount = subTotal;
  let discountRate = 0;
  let volumeDiscountApplied = false;
  const originalTotal = subTotal;

  if (itemCount >= VOLUME_ORDER_COUNT) {
    totalAmount = (subTotal * 75) / 100;
    discountRate = 0.25;
    volumeDiscountApplied = true;
  } else {
    // 상품별 할인 적용
    totalAmount = items.reduce((acc, curr) => acc + curr.discountedTotal, 0);
    discountRate = subTotal > 0 ? (subTotal - totalAmount) / subTotal : 0;
  }

  // 화요일 추가 할인
  const isTuesday = new Date().getDay() === 2;
  if (isTuesday && totalAmount > 0) {
    totalAmount = (totalAmount * 90) / 100;
    discountRate = 1 - totalAmount / originalTotal;
    showTuesdaySpecial(true);
  } else {
    showTuesdaySpecial(false);
  }

  // UI들을 조합/출력
  updateItemCountDisplay(itemCount);
  renderSummaryDetails({
    items,
    subTotal,
    itemCount,
    itemDiscounts,
    totalAmount,
    volumeDiscountApplied,
    isTuesday,
  });
  showDiscountInfo(discountRate, originalTotal, totalAmount);
  updateStockStatus(productList);
  updateLoyaltyPointsDisplay(totalAmount, itemCount);
  renderBonusPoints(totalAmount, itemCount);
}

// 개별 상품별 정보+할인 계산
function getCartItemsData(cartItemList, productStore) {
  let subTotal = 0;
  let itemCount = 0;
  const items = [];
  const itemDiscounts = [];

  cartItemList.forEach((cartItem) => {
    const product = productStore.getProductById(cartItem.id);
    const quantity = parseInt(cartItem.querySelector('.quantity-number').textContent);

    let discount = getProductDiscount(product, quantity);
    const itemTotal = product.value * quantity;
    const discountedTotal = itemTotal * (1 - discount);

    subTotal += itemTotal;
    itemCount += quantity;

    // 가격 글꼴 강조 표기
    cartItem.querySelectorAll('.text-lg, .text-xs').forEach((element) => {
      if (element.classList.contains('text-lg')) {
        element.style.fontWeight = quantity >= DISCOUNT_STANDARD_COUNT ? 'bold' : 'normal';
      }
    });

    // 할인 내역 저장
    if (discount > 0)
      itemDiscounts.push({ name: product.name, discount: Math.round(discount * 100) });

    items.push({
      id: product.id,
      name: product.name,
      quantity,
      itemTotal,
      discount,
      discountedTotal,
    });
  });

  return { items, itemCount, subTotal, itemDiscounts };
}

// 화요일 스페셜 배너 노출
function showTuesdaySpecial(visible) {
  const $tuesdaySpecial = document.getElementById('tuesday-special');
  if ($tuesdaySpecial) $tuesdaySpecial.classList.toggle('hidden', !visible);
}

// 장바구니 상품 수 표시(R)
function updateItemCountDisplay(itemCount) {
  const $itemCount = document.getElementById('item-count');
  if ($itemCount) {
    const previousCount = parseInt($itemCount.textContent.match(/\d+/) || 0);
    $itemCount.textContent = `🛍️ ${itemCount} items in cart`;
    if (previousCount !== itemCount) $itemCount.setAttribute('data-changed', 'true');
  }
}

// 결제 요약 정보 렌더링
function renderSummaryDetails({
  items,
  subTotal,
  itemCount,
  itemDiscounts,
  totalAmount,
  volumeDiscountApplied,
  isTuesday,
}) {
  const $summaryDetails = document.getElementById('summary-details');
  if (!$summaryDetails) return;
  $summaryDetails.innerHTML = '';
  if (subTotal === 0) return;

  items.forEach(({ name, quantity, itemTotal }) => {
    $summaryDetails.innerHTML += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${name} x ${quantity}</span>
        <span>₩${itemTotal.toLocaleString()}</span>
      </div>
    `;
  });

  $summaryDetails.innerHTML += `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subTotal.toLocaleString()}</span>
    </div>
  `;

  if (volumeDiscountApplied) {
    $summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
        <span class="text-xs">-25%</span>
      </div>
    `;
  } else if (itemDiscounts.length > 0) {
    itemDiscounts.forEach((item) => {
      $summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">${item.name} (10개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `;
    });
  }

  if (isTuesday && totalAmount > 0) {
    $summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-10%</span>
      </div>
    `;
  }

  $summaryDetails.innerHTML += `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;

  // 최종 결제금액 표시
  const $cartTotal = document.querySelector('#cart-total .text-2xl');
  if ($cartTotal) $cartTotal.textContent = `₩${Math.round(totalAmount).toLocaleString()}`;
}

// 할인 정보 표시
function showDiscountInfo(discountRate, originalTotal, totalAmount) {
  const $discountInfo = document.getElementById('discount-info');
  if (!$discountInfo) return;
  $discountInfo.innerHTML = '';
  if (discountRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
    $discountInfo.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
}

// 적립 포인트
function updateLoyaltyPointsDisplay(totalAmount, itemCount) {
  const $loyaltyPoints = document.getElementById('loyalty-points');
  if (!$loyaltyPoints) return;
  const points = Math.floor(totalAmount / 1000);
  $loyaltyPoints.textContent = `적립 포인트: ${points > 0 ? points : 0}p`;
  $loyaltyPoints.style.display = 'block';
}

// 재고 상태 메시지
function updateStockStatus(productList) {
  $stockStatus.textContent = getStockInfoMessage(productList);
}

function updateDiscountPrices() {
  Array.from($cartItems.children).forEach((cartItem) => {
    const itemId = cartItem.id;

    const product = productStore.getProductById(itemId);

    if (!product) return;

    const $productPrice = cartItem.querySelector('.text-lg');
    const $productName = cartItem.querySelector('h3');

    if (product.onSale && product.suggestSale) {
      $productPrice.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.value.toLocaleString()}</span>`;
      $productName.textContent = `⚡💝${product.name}`;
    } else if (product.onSale) {
      $productPrice.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.value.toLocaleString()}</span>`;
      $productName.textContent = `⚡${product.name}`;
    } else if (product.suggestSale) {
      $productPrice.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.value.toLocaleString()}</span>`;
      $productName.textContent = `💝${product.name}`;
    } else {
      $productPrice.textContent = `₩${product.value.toLocaleString()}`;
      $productName.textContent = product.name;
    }
  });

  calcCart();
}

function setLightningDiscountAlert() {
  const lightningDelay = Math.random() * 10000;

  setTimeout(() => {
    setInterval(() => {
      const productList = productStore.getProductList();
      const luckyIdx = Math.floor(Math.random() * productList.length);

      const luckyItem = productList[luckyIdx];

      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        luckyItem.value = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;

        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);

        renderSelectorOption(productList, $selector);
        updateDiscountPrices();
      }
    }, 30000);
  }, lightningDelay);
}

function setDiscountAlert() {
  setTimeout(() => {
    setInterval(() => {
      if (latestSelectedProduct) {
        const productList = productStore.getProductList();

        const suggest = productList.find(
          (product) =>
            product.id !== latestSelectedProduct && product.quantity > 0 && !product.suggestSale,
        );

        if (suggest) {
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);

          suggest.value = Math.round((suggest.value * (100 - 5)) / 100);
          suggest.suggestSale = true;

          renderSelectorOption(productList, $selector);
          updateDiscountPrices();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function handleClickAddButton() {
  const selectedItem = $selector.value;

  const itemToAdd = productStore.getProductById(selectedItem);

  if (!selectedItem || !itemToAdd) return;

  if (!itemToAdd || itemToAdd.quantity <= 0) return;

  const item = document.getElementById(itemToAdd['id']);

  if (item) {
    const $quantityNumber = item.querySelector('.quantity-number');
    const newQuantity = parseInt($quantityNumber['textContent']) + 1;

    if (newQuantity <= itemToAdd.quantity + parseInt($quantityNumber.textContent)) {
      $quantityNumber.textContent = newQuantity;
      itemToAdd['quantity']--;
    } else {
      alert('재고가 부족합니다.');
    }
  } else {
    const $newItem = document.createElement('div');

    $newItem.id = itemToAdd.id;
    $newItem.className =
      'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
    $newItem.innerHTML = `
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${itemToAdd.onSale && itemToAdd.suggestSale ? '⚡💝' : itemToAdd.onSale ? '⚡' : itemToAdd.suggestSale ? '💝' : ''}${itemToAdd.name}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500'}">₩${itemToAdd.value.toLocaleString()}</span>` : `₩${itemToAdd.value.toLocaleString()}`}</p>
        <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500'}">₩${itemToAdd.value.toLocaleString()}</span>` : `₩${itemToAdd.value.toLocaleString()}`}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
      </div>
      `;

    $cartItems.appendChild($newItem);

    itemToAdd.quantity--;
  }

  calcCart();

  latestSelectedProduct = selectedItem;
}

function handleClickCartItem(event) {
  const { target } = event;

  if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item'))
    return;

  const { productId } = target.dataset;
  const $product = document.getElementById(productId);

  const productList = productStore.getProductList();
  const product = productStore.getProductById(productId);

  if (target.classList.contains('quantity-change')) {
    const quantityChange = parseInt(target.dataset.change);
    const $quantityNumber = $product.querySelector('.quantity-number');
    const currentQuantity = parseInt($quantityNumber.textContent);

    const newQuantity = currentQuantity + quantityChange;

    if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
      $quantityNumber.textContent = newQuantity;
      product.quantity -= quantityChange;
    } else if (newQuantity <= 0) {
      product.quantity += currentQuantity;
      $product.remove();
    } else {
      alert('재고가 부족합니다.');
    }
  } else if (target.classList.contains('remove-item')) {
    const $quantityNumber = $product.querySelector('.quantity-number');
    const removedQuantity = parseInt($quantityNumber.textContent);

    product.quantity += removedQuantity;
    $product.remove();
  }

  calcCart();
  renderSelectorOption(productList, $selector);
}

function main() {
  const $header = Header();

  const $selectorContainer = SelectorContainer();
  $selectorContainer.appendChild($selector);
  $selectorContainer.appendChild($addButton);
  $selectorContainer.appendChild($stockStatus);

  const $leftColumn = LeftColumn();
  $leftColumn.appendChild($selectorContainer);
  $leftColumn.appendChild($cartItems);

  const $rightColumn = RightColumn();

  const $gridContainer = GridContainer();
  $gridContainer.appendChild($leftColumn);
  $gridContainer.appendChild($rightColumn);

  const $manualColumn = ManualColumn();

  const $manualOverlay = ManualOverlay();
  $manualOverlay.onclick = function (e) {
    if (e.target === $manualOverlay) {
      $manualOverlay.classList.add('hidden');
      $manualColumn.classList.add('translate-x-full');
    }
  };
  $manualOverlay.appendChild($manualColumn);

  const $manualToggle = ManualToggle();
  $manualToggle.onclick = function () {
    $manualOverlay.classList.toggle('hidden');
    $manualColumn.classList.toggle('translate-x-full');
  };

  const $root = document.getElementById('app');
  $root.appendChild($header);
  $root.appendChild($gridContainer);
  $root.appendChild($manualToggle);
  $root.appendChild($manualOverlay);

  const productList = productStore.getProductList();

  renderSelectorOption(productList, $selector);
  calcCart();
}

main();

$addButton.addEventListener('click', handleClickAddButton);
$cartItems.addEventListener('click', handleClickCartItem);

setLightningDiscountAlert();
setDiscountAlert();
