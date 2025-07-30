import { findCart } from '../../model/cart';
import { findProduct, hasNoneSale } from '../../model/products';
import { getSaleRecord } from '../../model/sale-event';
import { html } from '../../utils/html';

interface Props {
  id: string;
}

export function CartItem({ id }: Props) {
  const { quantity } = findCart(id);
  const product = findProduct(id);
  const { name, price, originalPrice } = product;
  const saleRecord = getSaleRecord(product.saleEvent);

  const priceTemplate = hasNoneSale(product)
    ? `₩${price.toLocaleString()}`
    : `<span class="line-through text-gray-400">₩${originalPrice.toLocaleString()}</span> <span class="${saleRecord.className.text}">₩${price.toLocaleString()}</span>`;

  const bold = quantity >= 10 ? 'font-bold' : '';

  return html`
    <div
      id="${id}"
      class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
    >
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div
          class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"
        ></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">
          ${saleRecord.emoji}${name}
        </h3>
        <p class="text-xs ${bold} text-gray-500 mb-0.5 tracking-wide">
          PRODUCT
        </p>
        <p class="text-xs ${bold} text-black mb-3">${priceTemplate}</p>
        <div class="flex items-center gap-4">
          <button
            class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id="${id}"
            data-change="-1"
          >
            -
          </button>
          <span
            class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums"
            >${quantity}</span
          >
          <button
            class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id="${id}"
            data-change="1"
          >
            +
          </button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg ${bold} mb-2 tracking-tight tabular-nums">
          ${priceTemplate}
        </div>
        <a
          class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          data-product-id="${id}"
          >Remove</a
        >
      </div>
    </div>
  `;
}
