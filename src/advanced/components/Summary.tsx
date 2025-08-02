import type { Product } from '@advanced/feature/product/type';

interface Props {
  cart: Product[];
}

const Summary = ({ cart }: Props) => {
  const { itemCount, subTotal } = cart.reduce(
    (acc, cur) => {
      acc = {
        subTotal: acc.subTotal + cur.value * cur.quantity,
        itemCount: acc.itemCount + cur.quantity,
      };

      return acc;
    },
    { subTotal: 0, itemCount: 0 }
  );

  console.log(itemCount);

  return (
    <>
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3">
          {cart.map((product) => (
            <Detail key={product.id} product={product} />
          ))}

          {subTotal > 0 && (
            <>
              <div className="border-t border-white/10 my-3"></div>
              <div className="flex justify-between text-sm tracking-wide">
                <span>Subtotal</span>
                <span>₩{subTotal.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
        <div className="mt-auto">
          <div id="discount-info" className="mb-4"></div>
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">₩0</div>
            </div>
            <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
              적립 포인트: 0p
            </div>
          </div>
          <div id="tuesday-special" className="mt-4 p-3 bg-white/10 rounded-lg hidden">
            <div className="flex items-center gap-2">
              <span className="text-2xs">🎉</span>
              <span className="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
            </div>
          </div>
        </div>
      </div>
      <button className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
        Proceed to Checkout
      </button>
      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.
        <br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </>
  );
};

interface DetailProps {
  product: Product;
}

const Detail = ({ product }: DetailProps) => {
  return (
    <div className="flex justify-between text-xs tracking-wide text-gray-400">
      <span>
        {product.name} x {product.quantity}
      </span>
      <span>₩{(product.value * product.quantity).toLocaleString()}</span>
    </div>
  );
};

export default Summary;
