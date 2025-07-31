import Component from '../../lib/Component.js';
import BasicDiscount from './BasicDiscount.js';
import CartTotal from './CartTotal.js';
import DiscountBanner from './DiscountBanner.js';
import DiscountInfo from './DiscountInfo.js';
import PointInfo from './PointInfo.js';
import SpecialDiscount from './SpecialDiscount.js';
import SummaryDetail from './SummaryDetail.js';

export default class OrderSummary extends Component {
  mounted() {
    this.renderChildren({
      summaryDetail: {
        selector: '#summary-detail-container',
        Component: SummaryDetail,
      },
      discountInfo: {
        selector: '#discount-info-container',
        Component: DiscountInfo,
      },
      cartTotal: {
        selector: '#cart-total-container',
        Component: CartTotal,
      },
      discountBanner: {
        selector: '#discount-banner-container',
        Component: DiscountBanner,
      },
      pointInfo: {
        selector: '#point-info-container',
        Component: PointInfo,
      },
    });
  }

  template() {
    return /* HTML */ `<div id="rightColumn" class="bg-black text-white p-8 flex flex-col">
      <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div class="flex-1 flex flex-col">
        <div id="summary-detail-container"></div>
        <div class="mt-auto">
          ${BasicDiscount()} ${SpecialDiscount()}
          <div id="discount-info-container"></div>
          <div id="cart-total-container"></div>
          <div id="discount-banner-container"></div>
        </div>
      </div>
      <button
        class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
      >
        Proceed to Checkout
      </button>
      <div id="point-info-container"></div>
    </div>`;
  }
}
