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
import {
  renderBonusPoints,
  renderCartSummaryDetails,
  renderDiscountInfo,
  renderLoyaltyPoints,
  renderSelectorOption,
} from './render';
import store from './store';
import { getStockInfoMessage } from './utils';

const { productStore } = store;

let latestSelectedProduct = null;

const $selector = Selector();
const $addButton = AddButton();
const $cartItems = CartItems();
const $stockStatus = StockStatus();

// 1. 가격·수량 계산 및 할인 정보 추출
function getCartSummary(cartItemList, productStore) {
  let itemCount = 0,
    subTotal = 0,
    totalAmount = 0;
  const itemDiscounts = [];

  cartItemList.forEach((cartItem) => {
    const product = productStore.getProductById(cartItem.id);
    const quantity = parseInt(cartItem.querySelector('.quantity-number').textContent);
    const itemTotal = product.value * quantity;
    let discount = 0;

    itemCount += quantity;
    subTotal += itemTotal;

    if (quantity >= DISCOUNT_STANDARD_COUNT) {
      if (product.id === PRODUCT_ONE) discount = TEN_PERCENT;
      else if (product.id === PRODUCT_TWO) discount = FIFTEEN_PERCENT;
      else if (product.id === PRODUCT_THREE) discount = TWENTY_PERCENT;
      else if (product.id === PRODUCT_FOUR) discount = FIVE_PERCENT;
      else if (product.id === PRODUCT_FIVE) discount = TWENTY_FIVE_PERCENT;
      if (discount > 0) itemDiscounts.push({ name: product.name, discount: discount * 100 });
    }

    totalAmount += itemTotal * (1 - discount);
  });

  return { itemCount, subTotal, totalAmount, itemDiscounts };
}

// 2. 대량/화요일 할인 적용 및 화요일 배너 표시
function applyAdditionalDiscounts({ subTotal, totalAmount, itemCount, isTuesday }) {
  let discountRate = 0,
    finalAmount = totalAmount,
    originalTotal = subTotal;

  if (itemCount >= VOLUME_ORDER_COUNT) {
    finalAmount = (subTotal * 75) / 100;
    discountRate = TWENTY_FIVE_PERCENT;
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  // 화요일 배너 표시 관련 변수는 여기서 못 처리하므로 돌아온 후 calcCart에서 처리

  if (isTuesday && finalAmount > 0) {
    finalAmount = (finalAmount * 90) / 100;
    discountRate = 1 - finalAmount / originalTotal;
  }

  return { finalAmount, discountRate, originalTotal };
}

function updateStockInfo(productList) {
  $stockStatus.textContent = getStockInfoMessage(productList);
}

// 장바구니 계산 컨트롤러
function calcCart() {
  const cartItemList = Array.from($cartItems.children);
  const productList = productStore.getProductList();
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const $tuesdaySpecial = document.getElementById('tuesday-special');

  const { itemCount, subTotal, totalAmount, itemDiscounts } = getCartSummary(
    cartItemList,
    productStore,
  );

  let { finalAmount, discountRate, originalTotal } = applyAdditionalDiscounts({
    subTotal,
    totalAmount,
    itemCount,
    isTuesday,
  });

  // tuesday-special 배너 표시 처리
  if (isTuesday) {
    if (finalAmount > 0) {
      $tuesdaySpecial.classList.remove('hidden');
    } else {
      $tuesdaySpecial.classList.add('hidden');
    }
  } else {
    $tuesdaySpecial.classList.add('hidden');
  }

  const $itemCount = document.getElementById('item-count');
  if ($itemCount) $itemCount.textContent = `🛍️ ${itemCount} items in cart`;

  renderCartSummaryDetails(cartItemList, productStore, subTotal, itemCount, itemDiscounts, {
    isTuesday,
    finalAmount,
  });
  renderLoyaltyPoints(finalAmount);
  renderDiscountInfo(originalTotal, finalAmount, discountRate);

  const $cartTotal = document.querySelector('#cart-total .text-2xl');
  if ($cartTotal) $cartTotal.textContent = `₩${Math.round(finalAmount).toLocaleString()}`;

  updateStockInfo(productList);

  renderBonusPoints(finalAmount, itemCount);
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
