import { getProductById } from "../data/index.js";
import { UI_CONSTANTS } from "./constants.js";

export const CartItemList = /*html*/ `
  <div id="cart-items"></div>
`;

/**
 * 새로운 장바구니 아이템 추가
 */
export const addCartItem = (product) => {
  const cartDisplayElement = document.getElementById('cart-items');
  if (!cartDisplayElement || !product) return;

  const newCartItem = createCartItemElement(product);
  cartDisplayElement.appendChild(newCartItem);
};

/**
 * 개별 장바구니 아이템 가격 업데이트
 */
const updateSingleCartItemPrice = (cartItem, product) => {
  const priceDiv = cartItem.querySelector('.text-lg');
  const nameDiv = cartItem.querySelector('h3');
  const priceTextDiv = cartItem.querySelector('.text-xs.text-black');
  const quantityElement = cartItem.querySelector('.quantity-number');
  const quantity = quantityElement ? parseInt(quantityElement.textContent) : 0;

  const priceDisplay = generatePriceDisplay(product);
  const productName = generateProductName(product);

  // 가격 업데이트
  priceDiv.innerHTML = priceDisplay;
  nameDiv.textContent = productName;
  
  if (priceTextDiv) {
    priceTextDiv.innerHTML = priceDisplay;
  }

  // 수량에 따른 스타일 적용
  applyQuantityStyle(priceDiv, quantity);
};

/**
 * 장바구니 내 상품들의 가격 업데이트 (할인 적용 시)
 */
export const updateCartItemPrices = () => {
  const cartItems = document.getElementById('cart-items').children;

  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    const product = getProductById(itemId);

    if (product) {
      updateSingleCartItemPrice(cartItems[i], product);
    }
  }
};

// #region ================ 내부 함수 ================
/**
 * 상품의 할인 상태에 따른 색상 클래스 결정
 */
const getDiscountColorClass = (product) => {
  if (product.isOnSale && product.isSuggestedSale) {
    return UI_CONSTANTS.COLORS.DUAL_SALE_PRICE;
  } else if (product.isOnSale) {
    return UI_CONSTANTS.COLORS.SALE_PRICE;
  } else if (product.isSuggestedSale) {
    return UI_CONSTANTS.COLORS.SUGGESTED_PRICE;
  }
  return '';
};

/**
 * 상품의 할인 상태에 따른 아이콘 결정
 */
const getDiscountIcon = (product) => {
  if (product.isOnSale && product.isSuggestedSale) {
    return UI_CONSTANTS.ICONS.DUAL_SALE;
  } else if (product.isOnSale) {
    return UI_CONSTANTS.ICONS.LIGHTNING_SALE;
  } else if (product.isSuggestedSale) {
    return UI_CONSTANTS.ICONS.SUGGESTED_SALE;
  }
  return '';
};

/**
 * 상품의 가격 표시 HTML 생성
 */
const generatePriceDisplay = (product) => {
  if (product.isOnSale || product.isSuggestedSale) {
    const colorClass = getDiscountColorClass(product);
    return /*html*/ `<span class="line-through ${UI_CONSTANTS.COLORS.ORIGINAL_PRICE}">₩${product.originalPrice.toLocaleString()}</span> <span class="${colorClass}">₩${product.price.toLocaleString()}</span>`;
  } else {
    return `₩${product.price.toLocaleString()}`;
  }
};

/**
 * 상품의 이름 표시 텍스트 생성
 */
const generateProductName = (product) => {
  const icon = getDiscountIcon(product);
  return icon + product.name;
};

/**
 * 수량에 따른 가격 스타일 적용
 */
const applyQuantityStyle = (priceElement, quantity) => {
  if (quantity >= UI_CONSTANTS.THRESHOLDS.BOLD_TEXT_QUANTITY) {
    priceElement.style.fontWeight = 'bold';
  } else {
    priceElement.style.fontWeight = 'normal';
  }
};

/**
 * 장바구니 아이템 HTML 생성
 */
const generateCartItemHTML = (product) => {
  const priceDisplay = generatePriceDisplay(product);
  const productName = generateProductName(product);
  
  return /*html*/ `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${productName}</h3>
      <p class="text-xs ${UI_CONSTANTS.COLORS.GRAY_TEXT} mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs ${UI_CONSTANTS.COLORS.DEFAULT_TEXT} mb-3">${priceDisplay}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
      <a class="remove-item text-2xs ${UI_CONSTANTS.COLORS.GRAY_TEXT} uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:${UI_CONSTANTS.COLORS.DEFAULT_TEXT} hover:border-black" data-product-id="${product.id}">Remove</a>
    </div>
  `;
};

/**
 * 장바구니 아이템 요소 생성
 */
const createCartItemElement = (product) => {
  const newCartItem = document.createElement('div');
  newCartItem.id = product.id;
  newCartItem.className = 'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
  newCartItem.innerHTML = generateCartItemHTML(product);
  
  return newCartItem;
};

// #endregion