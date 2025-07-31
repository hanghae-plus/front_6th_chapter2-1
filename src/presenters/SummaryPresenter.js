import PricingEngine from "../domain/pricing/PricingEngine.js";
import { calculatePoints } from "../domain/loyalty/PointCalculator.js";

export default class SummaryPresenter {
  /**
   * @param {import('../domain/Cart.js').default} cart
   * @param {{
   *   container: HTMLElement;
   *   discountInfo: HTMLElement;
   *   totalDiv: HTMLElement;
   *   loyaltyDiv: HTMLElement;
   *   tuesdayBanner: HTMLElement;
   * }} refs
   */
  constructor(cart, refs) {
    this.cart = cart;
    this.refs = refs;
    this.render();
  }

  render(now = new Date()) {
    const { finalTotal, originalSubtotal, discountRate, breakdown } =
      PricingEngine.calculate(this.cart, now);

    // Summary details list (subtotal & line items)
    this.refs.container.innerHTML = "";
    for (const item of this.cart.list) {
      this.refs.container.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${item.product.name} x ${item.quantity}</span>
          <span>₩${(
            item.product.salePrice * item.quantity
          ).toLocaleString()}</span>
        </div>`;
    }
    if (originalSubtotal > 0) {
      this.refs.container.innerHTML += `
        <div class="border-t border-white/10 my-3"></div>
        <div class="flex justify-between text-sm tracking-wide">
          <span>Subtotal</span>
          <span>₩${originalSubtotal.toLocaleString()}</span>
        </div>`;
    }

    // 할인 내역
    this.refs.discountInfo.innerHTML = "";
    if (discountRate > 0) {
      this.refs.discountInfo.innerHTML = `
        <div class="bg-green-500/20 rounded-lg p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
            <span class="text-sm font-medium text-green-400">${(
              discountRate * 100
            ).toFixed(1)}%</span>
          </div>
          <div class="text-2xs text-gray-300">₩${Math.round(
            originalSubtotal - finalTotal
          ).toLocaleString()} 할인되었습니다</div>
        </div>`;
    }

    // 화요일 배너
    if (breakdown.some((b) => b.includes("화요일"))) {
      this.refs.tuesdayBanner.classList.remove("hidden");
    } else {
      this.refs.tuesdayBanner.classList.add("hidden");
    }

    // 총액
    this.refs.totalDiv.textContent = `₩${finalTotal.toLocaleString()}`;

    // 포인트 계산
    const { points, details } = calculatePoints(this.cart, finalTotal, now);
    if (points > 0) {
      this.refs.loyaltyDiv.innerHTML = `적립 포인트: <span class="font-bold">${points}p</span><div class="text-2xs opacity-70 mt-1">${details.join(
        ", "
      )}</div>`;
      this.refs.loyaltyDiv.style.display = "block";
    } else {
      this.refs.loyaltyDiv.style.display = "none";
    }
  }
}
