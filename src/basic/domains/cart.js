import { calculateItemDiscount } from "./product.js";

// 장바구니 전체 계산 (가격, 할인, 수량)
export function calculateCartData(products, cartItems) {
  let subTotal = 0;
  let totalAmount = 0;
  let itemCount = 0;
  const itemDiscounts = [];

  // 장바구니 각 아이템 처리
  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = products.find((p) => p.id === cartItem.id);
    if (!product) continue;

    const qtyElem = cartItem.querySelector(".quantity-number");
    const quantity = parseInt(qtyElem.textContent);
    const itemTotal = product.val * quantity;

    itemCount += quantity;
    subTotal += itemTotal;

    // 개별 상품 할인 적용
    const discount = calculateItemDiscount(product.id, quantity);
    if (discount > 0) {
      itemDiscounts.push({ name: product.name, discount: discount * 100 });
    }
    totalAmount += itemTotal * (1 - discount);
  }

  let discountRate = (subTotal - totalAmount) / subTotal;

  // 대량구매 할인 적용 (30개 이상)
  if (itemCount >= 30) {
    totalAmount = subTotal * 0.75;
    discountRate = 0.25;
  }

  // 화요일 할인 적용
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  if (isTuesday && totalAmount > 0) {
    totalAmount = totalAmount * 0.9;
    discountRate = 1 - totalAmount / subTotal;
  }

  return {
    subTotal,
    totalAmount,
    itemCount,
    itemDiscounts,
    discountRate,
    isTuesday,
  };
}
