import { CartProductItem } from '../components/cart-section/CartProductItem';
import { DiscountInfo } from '../components/order-summary/DiscountInfo';
import { LoyaltyPoints } from '../components/order-summary/LoyaltyPoints';
import { OrderContent } from '../components/order-summary/OrderContent';
import { ProductOption } from '../components/product-selector/ProductOption';
import { StockStatus } from '../components/product-selector/StockStatus';
import { state } from '../store';

function renderTotalQuantity(DOMElements, summary) {
  DOMElements.itemCount.textContent = `🛍️ ${summary.totalQuantity} items in cart`;
}

function renderProductSelector(DOMElements) {
  const { productSelect } = DOMElements;
  const currentSelection = productSelect.value;
  productSelect.innerHTML = state.products.map(ProductOption).join('');
  productSelect.value = state.selectedProductId || currentSelection;
}

function renderCartContent(DOMElements, summary) {
  DOMElements.stockStatus.innerHTML = StockStatus(summary.stockMessages);
  renderCartItems(DOMElements);
}

function renderCartItems(DOMElements) {
  const { cartItems } = DOMElements;

  state.cartList.forEach((cartItem) => {
    const product = state.products.find((p) => p.id === cartItem.productId);
    if (!product) return;

    const itemElement = document.getElementById(product.id);

    if (itemElement) {
      const qtyElement = itemElement.querySelector('.quantity-number');
      if (qtyElement.textContent !== String(cartItem.quantity)) {
        qtyElement.textContent = cartItem.quantity;
      }
    } else {
      const newItemHTML = CartProductItem({ product, quantity: cartItem.quantity });
      cartItems.insertAdjacentHTML('beforeend', newItemHTML);
    }
  });

  const currentItemIdsInState = state.cartList.map((item) => item.productId);
  Array.from(cartItems.children).forEach((element) => {
    if (!currentItemIdsInState.includes(element.id)) {
      element.remove();
    }
  });
}

function renderOrderSummary(DOMElements, summary, bonusPoints, pointsDetail) {
  const { summaryDetails, discountInfo, totalAmount, loyaltyPoints, tuesdaySpecial } = DOMElements;

  summaryDetails.innerHTML = OrderContent(summary);
  discountInfo.innerHTML = DiscountInfo(summary);
  totalAmount.textContent = `₩${Math.round(summary.finalTotal).toLocaleString()}`;

  loyaltyPoints.innerHTML = LoyaltyPoints(bonusPoints, pointsDetail);
  loyaltyPoints.style.display = state.cartList.length > 0 ? 'block' : 'none';

  tuesdaySpecial.classList.toggle('hidden', !summary.isTuesday || summary.totalQuantity === 0);
}

export { renderTotalQuantity, renderProductSelector, renderCartContent, renderOrderSummary };
