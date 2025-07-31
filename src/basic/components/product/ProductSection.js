import Component from '../../lib/Component.js';
import SectionLayout from '../layout/SectionLayout.js';
import AddButton from './AddButton.js';
import ProductSelect from './ProductSelect.js';
import StockStatus from './StockStatus.js';

export default class ProductSection extends Component {
  mounted() {
    this.renderChildren({
      productSelect: {
        selector: '#product-select-container',
        Component: ProductSelect,
      },
    });
  }

  template() {
    return SectionLayout(
      'bg-white border border-gray-200 p-8 overflow-y-auto',
      `
        <div id="selectorContainer" class="mb-6 pb-6 border-b border-gray-200">
          <div id="product-select-container"></div>
          ${AddButton()} ${StockStatus()}
        </div>
        <div id="cart-items"></div>
      `
    );
  }
}
