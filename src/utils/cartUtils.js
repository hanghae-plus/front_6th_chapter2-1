import { QUANTITY_THRESHOLDS } from '../constants/shopPolicy.js';
import { getQuantityFromElement, getProductDiscount } from './productUtils.js';
import { getProduct } from '../managers/product.js';
import { calculateDiscounts } from './discountUtils.js';

export function calculateCartTotals(cartItems) {
  const result = { originalTotal: 0, itemDiscounts: [], total: 0, itemCnt: 0 };

  for (const cartItem of cartItems) {
    const product = getProduct(cartItem.id);
    // 수량 추출하는 로직인데 이건 돔조작에 의존하고있음. 다른 방법 찾아보기
    const quantity = getQuantityFromElement(
      cartItem.querySelector('.quantity-number')
    );
    const itemTotal = product.price * quantity;

    const discount =
      quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT
        ? getProductDiscount(product.id)
        : 0;

    if (discount > 0) {
      result.itemDiscounts.push({
        name: product.name,
        discount: discount * 100,
      });
    }

    result.originalTotal += itemTotal;
    result.total += itemTotal * (1 - discount);
    result.itemCnt += quantity;
  }

  return result;
}

export function addItemToCart(productId, currentCartQuantity = 0) {
  const product = getProduct(productId);

  if (!product) {
    return { success: false, error: '상품을 찾을 수 없습니다.' };
  }

  if (product.quantity <= 0) {
    return { success: false, error: '품절된 상품입니다.' };
  }

  const newCartQuantity = currentCartQuantity + 1;

  if (newCartQuantity > product.quantity + currentCartQuantity) {
    return { success: false, error: '재고가 부족합니다.' };
  }

  return {
    success: true,
    newCartQuantity,
    isNewItem: currentCartQuantity === 0,
    product,
  };
}

export function updateCartItemQuantity(productId, change, currentCartQuantity) {
  const product = getProduct(productId);

  if (!product) {
    return { success: false, error: '상품을 찾을 수 없습니다.' };
  }

  const newCartQuantity = currentCartQuantity + change;

  if (newCartQuantity <= 0) {
    return {
      success: true,
      shouldRemove: true,
      stockToRestore: currentCartQuantity,
      product,
    };
  }

  if (newCartQuantity > product.quantity + currentCartQuantity) {
    return { success: false, error: '재고가 부족합니다.' };
  }

  return {
    success: true,
    newCartQuantity,
    shouldRemove: false,
    stockChange: -change,
    product,
  };
}

export function removeCartItem(productId, currentCartQuantity) {
  const product = getProduct(productId);

  if (!product) {
    return { success: false, error: '상품을 찾을 수 없습니다.' };
  }

  return {
    success: true,
    stockToRestore: currentCartQuantity,
    product,
  };
}

export function calculateCartSummary(cartItems) {
  const cartTotals = calculateCartTotals(cartItems);
  const discounts = calculateDiscounts(
    cartTotals.originalTotal,
    cartTotals.total,
    cartTotals.itemCnt
  );
  
  return {
    ...cartTotals,
    ...discounts,
    cartItems,
  };
}
