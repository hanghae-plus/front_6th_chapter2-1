import { 
  getProductList,
  startLightningSale,
  startSuggestedSale,
  updateProductSaleStatus,
  resetProductPrices
} from "../data/index.js";

import { updateCartSelectOptions } from "../render/CartSelectBox.js";
import { 
  updateCartSummary,
  updateTotalPrice,
  updateDiscountInfo,
  updateLoyaltyPoints,
  updateTuesdaySpecial
} from "../render/CartTotal.js";
import { updateCartItemPrices } from "../render/CartItemList.js";

// 자동 이벤트 타이머들
let lightningSaleTimer = null;
let suggestedSaleTimer = null;
let lastSelectedProductId = null;

// 자동 이벤트 시작
export const startAutomaticEvents = () => {
  // 번개세일 이벤트 시작 (30초마다, 10초 후 시작)
  const lightningEventDelay = Math.random() * 10000;
  setTimeout(() => {
    lightningSaleTimer = setInterval(handleLightningSale, 30000);
  }, lightningEventDelay);

  // 추천 상품 이벤트 시작 (60초마다, 20초 후 시작)
  setTimeout(() => {
    suggestedSaleTimer = setInterval(handleSuggestedSale, 60000);
  }, Math.random() * 20000);
};

// 자동 이벤트 중지
export const stopAutomaticEvents = () => {
  if (lightningSaleTimer) {
    clearInterval(lightningSaleTimer);
    lightningSaleTimer = null;
  }
  if (suggestedSaleTimer) {
    clearInterval(suggestedSaleTimer);
    suggestedSaleTimer = null;
  }
};

// 번개세일 이벤트 처리
const handleLightningSale = () => {
  const luckyProduct = startLightningSale();
  
  if (luckyProduct) {
    alert(`⚡번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
    updateAllUI();
  }
};

// 추천할인 이벤트 처리
const handleSuggestedSale = () => {
  const cartItems = document.getElementById('cart-items');
  if (!cartItems || cartItems.children.length === 0) {
    return;
  }

  if (lastSelectedProductId) {
    const suggestedProduct = startSuggestedSale(lastSelectedProductId);
    
    if (suggestedProduct) {
      alert(`💝 ${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      updateAllUI();
    }
  }
};

// 마지막 선택 상품 ID 업데이트
export const updateLastSelectedProduct = (productId) => {
  lastSelectedProductId = productId;
};

// 모든 UI 업데이트
const updateAllUI = () => {
  updateCartSelectOptions();
  updateCartItemPrices();
  updateCartSummary();
  updateTotalPrice();
  updateDiscountInfo();
  updateLoyaltyPoints();
  updateTuesdaySpecial();
};

// 상품 가격 초기화 (할인 해제)
export const resetAllProductPrices = () => {
  resetProductPrices();
  updateAllUI();
}; 