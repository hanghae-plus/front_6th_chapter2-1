// CartPresenter: bridges Cart domain model with cart items DOM list
import Cart from "../domain/Cart.js";
import PricingEngine from "../domain/pricing/PricingEngine.js";
import { calculatePoints } from "../domain/loyalty/PointCalculator.js";

/**
 * 의존 DOM 요소 IDs
 * - cart-items
 * - item-count
 * - stock-status (재고 표시)
 */
export default class CartPresenter {
  /**
   * @param {Cart} cartDomain
   * @param {{ root: HTMLElement; stockInfo: HTMLElement; itemCount: HTMLElement; }} refs
   */
  constructor(cartDomain, refs, onUpdate = () => {}, products = []) {
    this.cart = cartDomain;
    this.refs = refs;
    this.onUpdate = onUpdate;
    this.products = products;

    // 이벤트 위임 셋업
    this.refs.root.addEventListener("click", this.handleClick.bind(this));
    this.render();
    this.onUpdate();
  }

  /** handle +/- buttons & remove links */
  handleClick(e) {
    const target = /** @type {HTMLElement} */ (e.target);
    if (target.classList.contains("quantity-change")) {
      const id = target.dataset.productId;
      const delta = parseInt(target.dataset.change, 10);
      if (id && delta) {
        const ok = this.cart.changeQuantity(id, delta);
        if (!ok) alert("재고가 부족합니다.");
        if (this.cart.items.has(id) && this.cart.items.get(id).quantity === 0) {
          // removed by reaching 0
        }
        this.render();
        this.onUpdate();
      }
    } else if (target.classList.contains("remove-item")) {
      const id = target.dataset.productId;
      if (id) {
        this.cart.removeProduct(id);
        this.render();
        this.onUpdate();
      }
    }
  }

  /** DOM 동기화 */
  render() {
    const container = this.refs.root;
    container.innerHTML = "";

    for (const item of this.cart.list) {
      container.appendChild(this.renderItem(item));
    }

    // header count
    if (this.refs.itemCount) {
      this.refs.itemCount.textContent = `🛍️ ${this.cart.totalQuantity} items in cart`;
    }

    // 재고 상태 메시지 업데이트
    if (this.refs.stockInfo) {
      const msgs = [];
      this.products.forEach((p) => {
        if (p.stock < 5) {
          if (p.stock > 0) {
            msgs.push(`${p.name}: 재고 부족 (${p.stock}개 남음)`);
          } else {
            msgs.push(`${p.name}: 품절`);
          }
        }
      });
      this.refs.stockInfo.textContent = msgs.join("\n");
    }
  }

  renderItem(item) {
    const div = document.createElement("div");
    div.id = item.id;
    div.className =
      "grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0";
    div.innerHTML = `
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${
          item.product.name
        }</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">₩${item.product.salePrice.toLocaleString()}</p>
        <div class="flex items-center gap-4">
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${
            item.id
          }" data-change="-1">−</button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${
            item.quantity
          }</span>
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${
            item.id
          }" data-change="1">+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">₩${item.subtotal.toLocaleString()}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${
          item.id
        }">Remove</a>
      </div>
    `;
    return div;
  }
}
