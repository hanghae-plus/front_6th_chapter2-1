import { useCartState } from '../../../contexts/CartContext';
import { CartItemForDisplay, getCartSummary } from '../../../reducer';

export const SummaryDetails = () => {
  const state = useCartState();
  const summary = getCartSummary(state);

  const itemsHTML = summary.cartItemsForDisplay
    .map(
      (item: CartItemForDisplay) => `
    <div className="flex justify-between text-xs tracking-wide text-gray-400">
      <span>${item.name} x ${item.quantity}</span>
      <span>₩${item.totalPrice}</span>
    </div>
  `,
    )
    .join('');

  const discountsHTML = summary.discounts
    .map(
      (d) => `
    <div className="flex justify-between text-sm tracking-wide text-green-400">
      <span className="text-xs">${d.reason}</span>
      <span className="text-xs">-${d.amount}</span>
    </div>
  `,
    )
    .join('');

  if (summary.totalQuantity === 0) return '';

  return (
    <>
      {itemsHTML}
      <div className='border-t border-white/10 my-3'></div>
      <div className='flex justify-between text-sm tracking-wide'>
        <span>Subtotal</span>
        <span>₩{summary.subtotal}</span>
      </div>
      {discountsHTML}
      <div className='flex justify-between text-sm tracking-wide text-gray-400'>
        <span>Shipping</span>
        <span>Free</span>
      </div>
    </>
  );
};
