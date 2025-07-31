export default function CartTotal() {
  return (
    <div id="cart-total" className="pt-5 border-t border-white/10">
      <div className="flex justify-between items-baseline">
        <span className="text-sm uppercase tracking-wider">Total</span>
        <div className="text-2xl tracking-tight">₩0</div>
      </div>
      <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
        적립 포인트: 0p
      </div>
    </div>
  );
}
