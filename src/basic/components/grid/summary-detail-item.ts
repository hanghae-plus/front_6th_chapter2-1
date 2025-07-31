import { isCartTotalBulk, type Cart } from '../../model/cart';
import { BULK_THRESHOLD, findProduct, isBulk } from '../../model/products';
import { isTuesday } from '../../utils/day';
import { html } from '../../utils/html';

interface Props {
  carts: Cart[];
  cartTotalCount: number;
  totalPrice: number;
}

export function SummaryDetailItem({
  carts,
  cartTotalCount,
  totalPrice,
}: Props) {
  const summaryItems: string[] = [];
  const bulkCarts = carts.filter((cart) => isBulk(cart));

  if (cartTotalCount > 0) {
    carts.forEach(({ id, quantity }) => {
      const { name, price } = findProduct(id);
      const total = quantity * price;
      summaryItems.push(html`
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${name} x ${quantity}</span>
          <span>₩${total.toLocaleString()}</span>
        </div>
      `);
    });

    summaryItems.push(html`
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${totalPrice.toLocaleString()}</span>
      </div>
    `);
  }

  if (isCartTotalBulk(cartTotalCount)) {
    summaryItems.push(html`
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
        <span class="text-xs">-25%</span>
      </div>
    `);
  } else if (bulkCarts.length > 0) {
    bulkCarts.forEach(({ id }) => {
      const { name, bulkSaleRate } = findProduct(id);
      summaryItems.push(html`
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">${name} (${BULK_THRESHOLD}개↑)</span>
          <span class="text-xs">-${bulkSaleRate}%</span>
        </div>
      `);
    });
  }

  if (isTuesday()) {
    summaryItems.push(html`
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-10%</span>
      </div>
    `);
  }

  summaryItems.push(html`
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `);

  return summaryItems.join('');
}
