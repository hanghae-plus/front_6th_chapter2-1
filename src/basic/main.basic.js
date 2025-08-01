import { getIsTuesday } from './utils/date';
import { PRODUCT_IDS } from './constants/product';
import {
  renderAppLayout,
  renderBonusPoints,
  renderNewCartItem,
  renderProductSelectOptions,
} from './render';
import { setupIntervalEvent } from './utils/intervalEvent';
import {
  findRecommendedProduct,
  getLightningSaleProduct,
  getProductById,
  getProductNameWithBadge,
  getProductPriceHTML,
} from './utils/product';
import {
  calculateCartTotals,
  changeProductQuantity,
  getCartElements,
  incrementProductQuantityInCart,
  removeProduct,
} from './utils/cart';
import { updateCartUI } from './utils/ui/cart';

const productList = [
  {
    id: PRODUCT_IDS.KEYBOARD,
    name: '버그 없애는 키보드',
    price: 10000,
    originalPrice: 10000,
    quantity: 50,
    isOnSale: false,
    isRecommended: false,
  },
  {
    id: PRODUCT_IDS.MOUSE,
    name: '생산성 폭발 마우스',
    price: 20000,
    originalPrice: 20000,
    quantity: 30,
    isOnSale: false,
    isRecommended: false,
  },
  {
    id: PRODUCT_IDS.MONITOR_ARM,
    name: '거북목 탈출 모니터암',
    price: 30000,
    originalPrice: 30000,
    quantity: 20,
    isOnSale: false,
    isRecommended: false,
  },
  {
    id: PRODUCT_IDS.POUCH,
    name: '에러 방지 노트북 파우치',
    price: 15000,
    originalPrice: 15000,
    quantity: 0,
    isOnSale: false,
    isRecommended: false,
  },
  {
    id: PRODUCT_IDS.SPEAKER,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    price: 25000,
    originalPrice: 25000,
    quantity: 10,
    isOnSale: false,
    isRecommended: false,
  },
];
let selectedProductId = null;

function main() {
  renderAppLayout();

  renderProductSelectOptions(productList);
  updateCartState();

  bindEventListeners();

  setupLightningSale();
  setupRecommendationSale();
}

function bindEventListeners() {
  document.getElementById('add-to-cart')?.addEventListener('click', handleAddToCartClick);
  document.getElementById('cart-items')?.addEventListener('click', handleCartItemClick);
}

function setupLightningSale() {
  const applyLightningSaleToRandomProduct = () => {
    const product = getLightningSaleProduct(productList);
    if (!product) return;

    product.price = Math.round((product.originalPrice * 80) / 100);
    product.isOnSale = true;

    alert(`⚡번개세일! ${product.name}이(가) 20% 할인 중입니다!`);
    renderProductSelectOptions(productList);
    updatePricesInCart();
  };

  setupIntervalEvent({
    action: applyLightningSaleToRandomProduct,
    delay: Math.random() * 10000,
    interval: 30000,
  });
}

function setupRecommendationSale() {
  const applyRecommendationDiscount = () => {
    const product = findRecommendedProduct(productList, selectedProductId);
    if (!product) return;

    product.price = Math.round((product.price * 95) / 100);
    product.isRecommended = true;

    alert(`💝 ${product.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
    renderProductSelectOptions(productList);
    updatePricesInCart();
  };

  setupIntervalEvent({
    delay: 20000,
    interval: 60000,
    action: applyRecommendationDiscount,
  });
}

function updateCartState() {
  const cartElements = getCartElements();

  const {
    totalItemCount,
    subTotalBeforeDiscount,
    subTotalAfterDiscount: subTotalAfterItemDiscount,
    itemDiscounts,
  } = calculateCartTotals(cartElements, productList);
  let subTotalAfterDiscount = subTotalAfterItemDiscount;

  if (totalItemCount >= 30) {
    subTotalAfterDiscount = subTotalBeforeDiscount * 0.75;
  }

  const isTuesday = getIsTuesday();
  if (isTuesday) {
    subTotalAfterDiscount = subTotalAfterDiscount * 0.9;
  }

  const discountRate = 1 - subTotalAfterDiscount / subTotalBeforeDiscount;

  updateCartUI({
    cartElements,
    productList,
    itemDiscounts,
    totalItemCount,
    subTotalBeforeDiscount,
    subTotalAfterDiscount,
    discountRate,
    isTuesday,
  });

  renderBonusPoints({
    cartElements,
    productList,
    totalItemCount,
    subTotalAfterDiscount,
    isTuesday,
  });
}

const updatePricesInCart = () => {
  const cartElements = getCartElements();

  for (const cartElement of cartElements) {
    const product = getProductById(productList, cartElement.id);
    if (!product) continue;

    const priceDiv = cartElement.querySelector('.text-lg');
    const nameDiv = cartElement.querySelector('h3');
    if (!priceDiv || !nameDiv) continue;

    nameDiv.textContent = getProductNameWithBadge(product);
    priceDiv.innerHTML = getProductPriceHTML(product);
  }

  updateCartState();
};

const handleAddToCartClick = () => {
  const selectedId = document.getElementById('product-select').value;
  const selectedProduct = getProductById(productList, selectedId);

  if (!selectedProduct || selectedProduct.quantity === 0) {
    return;
  }

  const isInCart = document.getElementById(selectedProduct.id) !== null;
  if (isInCart) {
    if (!incrementProductQuantityInCart(selectedProduct)) return;
  } else {
    const cartItemsContainer = document.getElementById('cart-items');
    renderNewCartItem(selectedProduct, cartItemsContainer);
  }

  updateCartState();
  selectedProductId = selectedProduct.id;
};

function handleCartItemClick(event) {
  const target = event.target;
  const isQuantityChange = target.classList.contains('quantity-change');
  const isRemoveItem = target.classList.contains('remove-item');
  if (!isQuantityChange && !isRemoveItem) return;

  const productId = target.dataset.productId;
  const product = getProductById(productList, productId);
  const productElement = document.getElementById(productId);
  if (!product || !productElement) return;

  if (isQuantityChange) {
    const change = parseInt(target.dataset.change);
    changeProductQuantity(product, productElement, change);
  } else if (isRemoveItem) {
    removeProduct(product, productElement);
  }

  updateCartState();
  renderProductSelectOptions(productList);
}

main();
