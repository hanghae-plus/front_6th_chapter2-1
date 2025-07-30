import { ReactElement } from 'react';

import type { CartItem } from '@/advanced/types/cart.type';

interface Props {
  item: CartItem;
}

export default function CartListItem({ item }: Props): ReactElement {
  const { id, name, price, quantity } = item;

  return (
    <div
      id={id}
      className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
    >
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">{name}</h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">{price}</p>
        <div className="flex items-center gap-4">
          <button className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white">
            −
          </button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
            {quantity}
          </span>
          <button className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white">
            +
          </button>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg mb-2 tracking-tight tabular-nums" style={{ fontWeight: 'normal' }}>
          {price}
        </div>
        <a
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          data-product-id={id}
        >
          Remove
        </a>
      </div>
    </div>
  );
}
