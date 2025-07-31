import { useAddCartItemQuantity } from '../hooks/cart';
import { useCart } from '../stores/cart';
import { useProducts } from '../stores/products';
import { findById } from '../utils/find';
import { formatPrice } from '../utils/price';
import { formatQuantity, isItemBulk } from '../utils/quantity';
import { getSaleRecord, hasNoneSale } from '../utils/sale-event';

export function CartList() {
  const carts = useCart((state) => state.carts);
  const products = useProducts((state) => state.products);

  return carts.map(({ id, quantity }) => {
    const { name, saleEvent, price, originalPrice } = findById({
      data: products,
      id,
    });

    return (
      <CartItem
        key={id}
        id={id}
        name={name}
        saleEvent={saleEvent}
        quantity={quantity}
        price={price}
        originalPrice={originalPrice}
      />
    );
  });
}

function CartItem({
  id,
  name,
  quantity,
  saleEvent,
  price,
  originalPrice,
}: {
  id: string;
  name: string;
  quantity: number;
  saleEvent: number;
  price: number;
  originalPrice: number;
}) {
  const formattedPrice = formatPrice({ price });
  const formattedOriginalPrice = formatPrice({ price: originalPrice });
  const saleRecord = getSaleRecord(saleEvent);
  const bold = isItemBulk({ quantity });
  const priceTemplate = hasNoneSale(saleEvent) ? (
    formattedPrice
  ) : (
    <>
      <span className="line-through text-gray-400">
        {formattedOriginalPrice}
      </span>
      <span className={saleRecord.className.text}>{formattedPrice}</span>
    </>
  );

  const addCartItemQuantity = useAddCartItemQuantity({ productId: id });

  const handleClickDecrease = () => {
    addCartItemQuantity({ incrementQuantity: -1 });
  };

  const handleClickIncrease = () => {
    addCartItemQuantity({ incrementQuantity: 1 });
  };

  return (
    <div className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {saleRecord.emoji}
          {name}
        </h3>
        <p className={`text-xs ${bold} text-gray-500 mb-0.5 tracking-wide`}>
          PRODUCT
        </p>
        <p className="text-xs ${bold} text-black mb-3">{priceTemplate}</p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleClickDecrease}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          >
            -
          </button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
            {formatQuantity({ quantity })}
          </span>
          <button
            onClick={handleClickIncrease}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          >
            +
          </button>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg ${bold} mb-2 tracking-tight tabular-nums">
          {priceTemplate}
        </div>
        <a className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black">
          Remove
        </a>
      </div>
    </div>
  );
}
