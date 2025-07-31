import { isCartTotalBulk } from '../../basic/model/cart';
import {
  SPECIAL_DAY_DISCOUNT_RATE,
  TOTAL_BULK_DISCOUNT_RATE,
} from '../constants/discount';
import {
  DISCOUNT_ITEM_BULK_THRESHOLD,
  DISCOUNT_TOTAL_BULK_THRESHOLD,
} from '../constants/quantity';
import { useCartTotalCount, useCartTotalPrice } from '../hooks/cart';
import { useCart } from '../stores/cart';
import { useProducts } from '../stores/products';
import { formatSpecialDay, isSpecialDay } from '../utils/day';
import { formatDiscountRate } from '../utils/discount';
import { findById } from '../utils/find';
import { formatPrice } from '../utils/price';
import { formatQuantity, isItemBulk } from '../utils/quantity';

export function SummaryDetails() {
  const cartTotalCount = useCartTotalCount();

  return (
    <div className="space-y-3">
      {cartTotalCount > 0 && (
        <>
          <CartItemList />
          <div className="border-t border-white/10 my-3" />
          <Subtotal />
          {isCartTotalBulk(cartTotalCount) ? (
            <BulkTotalDiscount />
          ) : (
            <BulkItemList />
          )}
          <SpecialDay />
        </>
      )}
      <Shipping />
    </div>
  );
}

function CartItemList() {
  const carts = useCart((state) => state.carts);
  const products = useProducts((state) => state.products);

  return carts.map(({ id, quantity }) => {
    const { name, price } = findById({ data: products, id });
    const total = quantity * price;

    return (
      <div
        key={id}
        className="flex justify-between text-xs tracking-wide text-gray-400"
      >
        <span>
          {name} x {formatQuantity({ quantity })}
        </span>
        <span>{formatPrice({ price: total })}</span>
      </div>
    );
  });
}

function Subtotal() {
  const totalPrice = useCartTotalPrice();

  return (
    <div className="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>{formatPrice({ price: totalPrice })}</span>
    </div>
  );
}

function BulkTotalDiscount() {
  return (
    <div className="flex justify-between text-sm tracking-wide text-green-400">
      <span className="text-xs">
        🎉 대량구매 할인 (
        {formatQuantity({ quantity: DISCOUNT_TOTAL_BULK_THRESHOLD })}개 이상)
      </span>
      <span className="text-xs">
        {formatDiscountRate({ rate: TOTAL_BULK_DISCOUNT_RATE })}
      </span>
    </div>
  );
}

function BulkItemList() {
  const carts = useCart((state) => state.carts);
  const products = useProducts((state) => state.products);

  return carts
    .filter((cart) => isItemBulk(cart))
    .map(({ id }) => {
      const { name, bulkSaleRate } = findById({ data: products, id });

      return (
        <div
          key={id}
          className="flex justify-between text-sm tracking-wide text-green-400"
        >
          <span className="text-xs">
            {name} ({formatQuantity({ quantity: DISCOUNT_ITEM_BULK_THRESHOLD })}
            개↑)
          </span>
          <span className="text-xs">
            {formatDiscountRate({ rate: bulkSaleRate })}
          </span>
        </div>
      );
    });
}

function SpecialDay() {
  if (!isSpecialDay()) {
    return null;
  }

  return (
    <div className="flex justify-between text-sm tracking-wide text-purple-400">
      <span className="text-xs">🌟 {formatSpecialDay()} 추가 할인</span>
      <span className="text-xs">
        {formatDiscountRate({ rate: SPECIAL_DAY_DISCOUNT_RATE })}
      </span>
    </div>
  );
}

function Shipping() {
  return (
    <div className="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  );
}
