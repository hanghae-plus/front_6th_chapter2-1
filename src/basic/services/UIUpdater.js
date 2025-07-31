import { updateCartTotal } from '../components/cart/CartTotal.js';
import { updateDiscountInfo } from '../components/order/DiscountInfo.js';
import { updateOrderSummary } from '../components/order/OrderSummary.js';
import { updateRewardPoints } from '../components/order/RewardPoints.js';
import { updateItemCount } from '../components/product/ItemCount.js';
import { updateStockInfo } from '../components/product/StockInfo.js';

const PRODUCT_DISPLAY_RULES = {
  STOCK_WARNING_LEVEL: 5, // 재고 부족 표시 기준
  HIGHLIGHT_QUANTITY_LEVEL: 10, // 굵은 글씨 적용 기준
};

export function createUIUpdater(cartDisplay, productList) {
  /** 카트 아이템 목록 조회 */
  const getCartItems = () => Array.from(cartDisplay.children);

  /** 카트 아이템 스타일 업데이트 */
  const updateCartItemStyles = (cartItems) => {
    cartItems.forEach((item) => {
      const quantityEl = item.querySelector('.quantity-number');
      const quantity = parseInt(quantityEl?.textContent ?? '0');

      const nameEl = item.querySelector('.product-name');
      if (nameEl) {
        nameEl.style.fontWeight = quantity >= PRODUCT_DISPLAY_RULES.HIGHLIGHT_QUANTITY_LEVEL ? 'bold' : 'normal';
      }

      if (item.stock < PRODUCT_DISPLAY_RULES.STOCK_WARNING_LEVEL) {
        item.style.color = 'red';
      }
    });
  };

  /** 화요일 특별 배너 업데이트 */
  const updateTuesdayBanner = (isTuesday, hasItems) => {
    const banner = document.getElementById('tuesday-special');
    if (!banner) return;

    banner.classList.toggle('hidden', !(isTuesday && hasItems));
  };

  /** 재고 부족 메시지 생성 */
  const createStockMessage = () => {
    return productList
      .filter((item) => item.stock < PRODUCT_DISPLAY_RULES.STOCK_WARNING_LEVEL)
      .map((item) => (item.stock > 0 ? `${item.name}: 재고 부족 (${item.stock}개 남음)` : `${item.name}: 품절`))
      .join('\n');
  };

  /** 아이템 수량 업데이트 */
  const updateItemCountSection = (itemCount) => {
    const el = document.getElementById('item-count');
    if (el) updateItemCount(el, itemCount);
  };

  /** 주문 요약 섹션 업데이트 */
  const updateOrderSummarySection = (cartItems, subtotal, itemCount, itemDiscounts, isTuesday) => {
    const el = document.getElementById('summary-details');
    if (el) {
      updateOrderSummary(el, cartItems, productList, subtotal, itemCount, itemDiscounts, isTuesday);
    }
  };

  /** 카트 총액 업데이트 */
  const updateCartTotalSection = (totalAmount) => {
    const el = document.getElementById('cart-total');
    if (el) updateCartTotal(el, totalAmount);
  };

  /** 리워드 포인트 업데이트 */
  const updateRewardPointsSection = (cartItems, totalAmount, itemCount) => {
    const el = document.getElementById('loyalty-points');
    if (el) {
      updateRewardPoints(el, cartItems, productList, totalAmount, itemCount);
    }
  };

  /** 할인 정보 업데이트 */
  const updateDiscountInfoSection = (rate, total, original) => {
    const el = document.getElementById('discount-info');
    if (el) updateDiscountInfo(el, rate, total, original);
  };

  /** 재고 정보 업데이트 */
  const updateStockInfoSection = () => {
    const el = document.getElementById('stock-status');
    if (el) {
      el.textContent = createStockMessage();
      updateStockInfo(el, productList);
    }
  };

  /** 모든 UI 업데이트 */
  const updateAllUI = (result) => {
    const { subtotal, totalAmount, itemCount, itemDiscounts, discountRate, originalTotal, isTuesday } = result;

    const cartItems = getCartItems();

    updateCartItemStyles(cartItems);
    updateTuesdayBanner(isTuesday, totalAmount > 0);
    updateItemCountSection(itemCount);
    updateOrderSummarySection(cartItems, subtotal, itemCount, itemDiscounts, isTuesday);
    updateCartTotalSection(totalAmount);
    updateRewardPointsSection(cartItems, totalAmount, itemCount);
    updateDiscountInfoSection(discountRate, totalAmount, originalTotal);
    updateStockInfoSection();
  };

  return { updateAllUI };
}
