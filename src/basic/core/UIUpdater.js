import { CartItem } from '../components/CartItem.js';
import { OrderSummary } from '../components/OrderSummary.js';
import { ProductSelector } from '../components/ProductSelector.js';
import { StockInfo } from '../components/StockInfo.js';

export class UIUpdater {
  constructor(domManager, state) {
    this.dom = domManager;
    this.state = state;
  }

  updateProductSelector() {
    const productSelect = this.dom.getElement('productSelect');
    const currentValue = productSelect.value;

    const selectHTML = ProductSelector.render(this.state.productList, {
      id: 'product-select',
      className: 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3',
      placeholder: '',
    });

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = selectHTML;
    const newSelect = tempDiv.querySelector('select');

    productSelect.innerHTML = newSelect.innerHTML;

    // Restore selection if still valid
    if (currentValue && productSelect.querySelector(`option[value="${currentValue}"]`)) {
      productSelect.value = currentValue;
    }

    // Apply stock warning style
    const totalStock = this.state.getTotalStock();
    productSelect.style.borderColor = totalStock < 50 ? 'orange' : '';
  }

  updateCartDisplay() {
    const cartDisplay = this.dom.getElement('cartDisplay');
    const cartItems = [];

    Array.from(cartDisplay.children).forEach(element => {
      const product = this.state.getProduct(element.id);
      const quantityElement = element.querySelector('.quantity-number');
      const quantity = parseInt(quantityElement?.textContent || 0);

      if (product && quantity > 0) {
        cartItems.push({
          id: product.id,
          product: product,
          quantity: quantity,
          price: product.val,
        });
      }
    });

    // Clear and rebuild cart display
    cartDisplay.innerHTML = '';

    cartItems.forEach(item => {
      const cartItemData = {
        product: item.product,
        quantity: item.quantity,
        discounts: {},
        subtotal: item.product.val * item.quantity,
        stock: item.product.q,
      };

      const newItemHTML = CartItem.render(cartItemData);
      cartDisplay.insertAdjacentHTML('beforeend', newItemHTML);
    });
  }

  updatePricesInCart() {
    const cartDisplay = this.dom.getElement('cartDisplay');

    Array.from(cartDisplay.children).forEach(itemElement => {
      const product = this.state.getProduct(itemElement.id);
      if (!product) return;

      const priceDiv = itemElement.querySelector('.text-lg');
      const nameDiv = itemElement.querySelector('h3');

      this.updateProductDisplayInCart(product, priceDiv, nameDiv);
    });
  }

  updateProductDisplayInCart(product, priceDiv, nameDiv) {
    const originalPrice = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span>`;
    const currentPrice = `₩${product.val.toLocaleString()}`;

    if (product.onSale && product.suggestSale) {
      priceDiv.innerHTML = `${originalPrice} <span class="text-purple-600">${currentPrice}</span>`;
      nameDiv.textContent = `⚡💝${product.name}`;
    } else if (product.onSale) {
      priceDiv.innerHTML = `${originalPrice} <span class="text-red-500">${currentPrice}</span>`;
      nameDiv.textContent = `⚡${product.name}`;
    } else if (product.suggestSale) {
      priceDiv.innerHTML = `${originalPrice} <span class="text-blue-500">${currentPrice}</span>`;
      nameDiv.textContent = `💝${product.name}`;
    } else {
      priceDiv.textContent = currentPrice;
      nameDiv.textContent = product.name;
    }
  }

  updateOrderSummary(cartItems, pricingResult, pointsResult) {
    const summaryDetails = this.dom.getElement('summaryDetails');
    const discountInfo = this.dom.getElement('discountInfo');
    const loyaltyPoints = this.dom.getElement('loyaltyPoints');
    const tuesdaySpecial = this.dom.getElement('tuesdaySpecial');

    if (cartItems.length === 0) {
      this.clearOrderSummary();
      return;
    }

    // Prepare order data for OrderSummary component
    const orderData = OrderSummary.transformCalculationResults(
      {
        priceResult: pricingResult,
        pointsResult: pointsResult,
        discountResult: { specialDiscounts: pricingResult.specialDiscounts || [] },
        context: { isTuesday: new Date().getDay() === 2 },
      },
      cartItems
    );

    // Update summary details
    const summaryHTML = OrderSummary.render(orderData, {
      showDetailedBreakdown: true,
      highlightSavings: false,
      showPointsPreview: false,
    });
    summaryDetails.innerHTML = summaryHTML;

    // Update discount information
    if (pricingResult.discountRate > 0 && pricingResult.finalAmount > 0) {
      const savingsHTML = OrderSummary.generateSavingsInfo(orderData.pricing);
      discountInfo.innerHTML = savingsHTML;
    } else {
      discountInfo.innerHTML = '';
    }

    // Update points information
    const pointsHTML = OrderSummary.generatePointsInfo(orderData.points);
    if (pointsHTML) {
      loyaltyPoints.innerHTML = pointsHTML;
      loyaltyPoints.style.display = 'block';
    } else {
      loyaltyPoints.textContent = '적립 포인트: 0p';
      loyaltyPoints.style.display = 'block';
    }

    // Update Tuesday special banner
    const isTuesday = new Date().getDay() === 2;
    const hasTuesdayDiscount = pricingResult.tuesdayDiscount?.discountAmount > 0;

    if (isTuesday && hasTuesdayDiscount) {
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  }

  clearOrderSummary() {
    this.dom.getElement('summaryDetails').innerHTML = '';
    this.dom.getElement('discountInfo').innerHTML = '';
    this.dom.getElement('loyaltyPoints').textContent = '적립 포인트: 0p';
    this.dom.getElement('loyaltyPoints').style.display = 'none';
    this.dom.getElement('tuesdaySpecial').classList.add('hidden');
  }

  updateTotalAmount() {
    const cartTotal = this.dom.getElement('cartTotal');
    const totalDiv = cartTotal?.querySelector('.text-2xl');

    if (totalDiv) {
      totalDiv.textContent = '₩' + Math.round(this.state.totalAmount).toLocaleString();
    }
  }

  updateItemCount() {
    const itemCountElement = this.dom.getElement('itemCount');
    if (itemCountElement) {
      itemCountElement.textContent = `🛍️ ${this.state.itemCount} items in cart`;
    }
  }

  updateStockInfo() {
    const stockInfo = this.dom.getElement('stockInfo');
    StockInfo.updateStockInfoElement(this.state.productList, stockInfo);
  }

  highlightQuantityDiscounts() {
    const cartDisplay = this.dom.getElement('cartDisplay');

    Array.from(cartDisplay.children).forEach(itemElement => {
      const quantityElement = itemElement.querySelector('.quantity-number');
      const quantity = parseInt(quantityElement?.textContent || 0);

      const priceElements = itemElement.querySelectorAll('.text-lg, .text-xs');
      priceElements.forEach(element => {
        if (element.classList.contains('text-lg')) {
          element.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
        }
      });
    });
  }
}
