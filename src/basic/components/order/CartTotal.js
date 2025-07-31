import Component from '../../lib/Component.js';

export default class CartTotal extends Component {
  template() {
    return `
      <div id="cart-total" class="pt-5 border-t border-white/10">
        <div class="flex justify-between items-baseline">
          <span class="text-sm uppercase tracking-wider">Total</span>
          <div class="text-2xl tracking-tight">₩0</div>
        </div>
        <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">
          적립 포인트: 0p
        </div>
      </div>
    `;
  }
}
