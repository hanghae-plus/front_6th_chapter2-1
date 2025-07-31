import AddButton from './components/AddButton';
import CartItems from './components/CartItems';
import GridContainer from './components/GridContainer';
import Header from './components/Header';
import LeftColumn from './components/LeftColumn';
import ManualColumn from './components/ManualColumn';
import ManualOverlay from './components/ManualOverlay';
import ManualToggle from './components/ManualToggle';
import RightColumn from './components/RightColumn';
import SaleItem from './components/SaleItem';
import Selector from './components/Selector';
import SelectorContainer from './components/SelectorContainer';
import StockStatus from './components/StockStatus';
import {
  renderBonusPoints,
  renderCartSummaryDetails,
  renderDiscountInfo,
  renderDiscountPrices,
  renderLoyaltyPoints,
  renderSelectorOption,
  renderTuesdaySpecial,
} from './utils/render';
import store from './store';
import { checkTuesday, getStockInfoMessage } from './utils';
import { applyAdditionalDiscounts, getCartSummary } from './utils/cart';
import {
  DISCOUNT_ALERT_INTERVAL,
  DISCOUNT_DELAY_MIN,
  EIGHTY_PERCENT,
  LIGHTNING_ALERT_INTERVAL,
  LIGHTNING_DELAY_MIN,
} from './constants/enum';

const { productStore } = store;

let latestSelectedProduct = null;

const $selector = Selector();
const $addButton = AddButton();
const $cartItems = CartItems();
const $stockStatus = StockStatus();

// 장바구니 계산 컨트롤러
function calcCart() {
  const cartItemList = Array.from($cartItems.children);

  const productList = productStore.getProductList();

  const isTuesday = checkTuesday();

  const { itemCount, subTotal, totalAmount, itemDiscounts } = getCartSummary(
    cartItemList,
    productStore,
  );

  const { finalAmount, discountRate, originalTotal } = applyAdditionalDiscounts({
    subTotal,
    totalAmount,
    itemCount,
    isTuesday,
  });

  renderTuesdaySpecial(isTuesday, finalAmount);

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

  $stockStatus.textContent = getStockInfoMessage(productList);

  renderBonusPoints(finalAmount, itemCount);
}

function updateDiscountPrices() {
  renderDiscountPrices(productStore);

  calcCart();
}

function setLightningDiscountAlert() {
  const lightningDelay = Math.random() * LIGHTNING_DELAY_MIN;

  setTimeout(() => {
    setInterval(() => {
      const productList = productStore.getProductList();
      const luckyIdx = Math.floor(Math.random() * productList.length);

      const luckyItem = productList[luckyIdx];

      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        luckyItem.value = Math.round(luckyItem.originalVal * EIGHTY_PERCENT);
        luckyItem.onSale = true;

        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);

        renderSelectorOption(productList, $selector);
        updateDiscountPrices();
      }
    }, LIGHTNING_ALERT_INTERVAL);
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
    }, DISCOUNT_ALERT_INTERVAL);
  }, Math.random() * DISCOUNT_DELAY_MIN);
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
    const $newItem = SaleItem({ ...itemToAdd });

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
  const elements = createElements();

  setupEventListeners(elements);
  appendElementsToDOM(elements);
  initializeApp();
}

function createElements() {
  const $header = Header();
  const $selectorContainer = SelectorContainer();
  const $leftColumn = LeftColumn();
  const $rightColumn = RightColumn();
  const $gridContainer = GridContainer();
  const $manualColumn = ManualColumn();
  const $manualOverlay = ManualOverlay();
  const $manualToggle = ManualToggle();

  return {
    $header,
    $selectorContainer,
    $leftColumn,
    $rightColumn,
    $gridContainer,
    $manualColumn,
    $manualOverlay,
    $manualToggle,
  };
}

function setupEventListeners(elements) {
  const { $manualOverlay, $manualColumn, $manualToggle } = elements;

  $manualOverlay.onclick = function (e) {
    if (e.target === $manualOverlay) {
      $manualOverlay.classList.add('hidden');
      $manualColumn.classList.add('translate-x-full');
    }
  };

  $manualToggle.onclick = function () {
    $manualOverlay.classList.toggle('hidden');
    $manualColumn.classList.toggle('translate-x-full');
  };
}

function appendElementsToDOM(elements) {
  const {
    $header,
    $selectorContainer,
    $leftColumn,
    $rightColumn,
    $gridContainer,
    $manualColumn,
    $manualOverlay,
    $manualToggle,
  } = elements;

  // Build component hierarchy
  $selectorContainer.appendChild($selector);
  $selectorContainer.appendChild($addButton);
  $selectorContainer.appendChild($stockStatus);

  $leftColumn.appendChild($selectorContainer);
  $leftColumn.appendChild($cartItems);

  $gridContainer.appendChild($leftColumn);
  $gridContainer.appendChild($rightColumn);

  $manualOverlay.appendChild($manualColumn);

  // Append to root
  const $root = document.getElementById('app');
  $root.appendChild($header);
  $root.appendChild($gridContainer);
  $root.appendChild($manualToggle);
  $root.appendChild($manualOverlay);
}

function initializeApp() {
  const productList = productStore.getProductList();
  renderSelectorOption(productList, $selector);
  calcCart();
}

main();

$addButton.addEventListener('click', handleClickAddButton);
$cartItems.addEventListener('click', handleClickCartItem);

setLightningDiscountAlert();
setDiscountAlert();
