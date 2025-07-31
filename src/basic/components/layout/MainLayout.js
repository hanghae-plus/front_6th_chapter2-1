import Component from '../../lib/Component.js';
import OrderSummary from '../order/OrderSummary.js';
import ProductSection from '../product/ProductSection.js';

/**
 * 메인 레이아웃 컴포넌트 생성 함수
 * @returns {Object} 생성된 요소들과 참조
 */
export default class MainLayout extends Component {
  mounted() {
    this.renderChildren({
      productSection: {
        selector: '#leftColumn',
        Component: ProductSection,
      },
      orderSummary: {
        selector: '#rightColumn',
        Component: OrderSummary,
      },
    });
  }

  template() {
    return /* HTML */ `
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
        <!-- Left Column : Product Selector -->
        <div id="leftColumn"></div>

        <!-- Right Column : Order Summary -->
        <div id="rightColumn"></div>
      </div>
    `;
  }
}
