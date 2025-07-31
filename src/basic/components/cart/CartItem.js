import { formatPrice } from '../../utils/formatUtils';

const PRODUCT_STATE_CONFIG = {
  SALE_AND_RECOMMEND: {
    badge: '⚡💝',
    color: 'text-purple-600',
  },
  SALE_ONLY: {
    badge: '⚡',
    color: 'text-red-500',
  },
  RECOMMEND_ONLY: {
    badge: '💝',
    color: 'text-blue-500',
  },
  DEFAULT: {
    badge: '',
    color: '',
  },
};

/**
 * 제품 상태
 * @param {Object} product
 */
const getProductState = (product) => {
  if (product.isOnSale && product.isRecommended) return PRODUCT_STATE_CONFIG.SALE_AND_RECOMMEND;
  if (product.isOnSale) return PRODUCT_STATE_CONFIG.SALE_ONLY;
  if (product.isRecommended) return PRODUCT_STATE_CONFIG.RECOMMEND_ONLY;
  return PRODUCT_STATE_CONFIG.DEFAULT;
};

/**
 * 상품 상태 배지 생성
 * @param {Object} product
 */
const createSaleBadge = (product) => {
  const state = getProductState(product);
  return state.badge;
};

/**
 * 가격 표시 포맷팅
 * @param {Object} product
 */
const formatPriceDisplay = (product) => {
  const state = getProductState(product);

  // 할인이나 추천이 없는 경우 일반 가격 표시
  if (state === PRODUCT_STATE_CONFIG.DEFAULT) {
    return formatPrice(product.price);
  }

  // 할인/추천 상품의 경우 원가와 할인가 표시
  const originalPrice = /* HTML */ `<span class="line-through text-gray-400"
    >${formatPrice(product.originalPrice)}</span
  >`;
  const discountPrice = /* HTML */ `<span class="${state.color}">${formatPrice(product.price)}</span>`;
  return `${originalPrice} ${discountPrice}`;
};

/**
 * 카트 아이템 생성
 * @param {Object} product
 */
export const createCartItem = (product) => {
  // 상품 상태 표시 (가격, 배지)
  const priceDisplay = formatPriceDisplay(product);
  const saleBadge = createSaleBadge(product);

  // 카트 아이템
  const cartItem = document.createElement('div');
  cartItem.id = product.productId;
  cartItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

  cartItem.innerHTML = /* HTML */ `
    <!-- 상품 이미지 -->
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div
        class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"
      ></div>
    </div>
    <!-- 상품 정보 -->
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${saleBadge}${product.name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${priceDisplay}</p>
      <div class="flex items-center gap-4">
        <button
          class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          data-product-id="${product.productId}"
          data-change="-1"
        >
          −
        </button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button
          class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          data-product-id="${product.productId}"
          data-change="1"
        >
          +
        </button>
      </div>
    </div>
    <!-- 가격 섹션 -->
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
      <a
        class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
        data-product-id="${product.productId}"
        >Remove</a
      >
    </div>
  `;

  return cartItem;
};

/**
 * 카트 아이템 가격 업데이트
 * @param {HTMLElement} cartItem
 * @param {Object} product
 */
export const updateCartItemPrice = (cartItem, product) => {
  const priceDiv = cartItem.querySelector('.text-lg');
  const nameDiv = cartItem.querySelector('h3');
  const saleBadge = createSaleBadge(product);
  const priceDisplay = formatPriceDisplay(product);

  priceDiv.innerHTML = priceDisplay;
  nameDiv.textContent = saleBadge + product.name;
};
