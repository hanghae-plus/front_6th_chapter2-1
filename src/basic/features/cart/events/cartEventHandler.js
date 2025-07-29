import { renderCartItem } from "../components/CartItem.js";
import { productUtils } from "../../product/services/productService.js";

// Cart click handlers (moved from clickDelegates.js)
const handleCartClick = (
  event,
  { cartUtils, productUtils, onCalculate, onUpdateOptions }
) => {
  const target = event.target;

  if (
    !target.classList.contains("quantity-change") &&
    !target.classList.contains("remove-item")
  ) {
    return;
  }

  const productId = target.dataset.productId;
  if (!productId) return;

  const itemElement = document.getElementById(productId);
  const product = productUtils.findById(productId);

  if (!product || !itemElement) return;

  if (target.classList.contains("quantity-change")) {
    const quantityChange = parseInt(target.dataset.change);
    cartUtils.changeItemQuantity(product, itemElement, quantityChange);
  } else if (target.classList.contains("remove-item")) {
    cartUtils.removeItem(product, itemElement);
  }

  onCalculate();
  onUpdateOptions();
};

const handleAddToCartClick = (event, { onAddToCart }) => {
  event.preventDefault();

  if (!onAddToCart) return;

  onAddToCart();
};

// Cart utilities
const cartUtils = {
  updateItemQuantity: (product, existingItem) => {
    const qtyElement = existingItem.querySelector(".quantity-number");
    const currentQty = parseInt(qtyElement.textContent);
    const newQty = currentQty + 1;

    if (newQty <= product.q + currentQty) {
      qtyElement.textContent = newQty;
      product.q--;
      return true;
    } else {
      alert("재고가 부족합니다.");
      return false;
    }
  },

  addNewItem: (product) => {
    if (product.q <= 0) {
      alert("재고가 부족합니다.");
      return false;
    }

    const cartItem = renderCartItem({
      id: product.id,
      name: product.name,
      val: product.val,
      originalVal: product.originalVal,
      quantity: 1,
      onSale: product.onSale || false,
      suggestSale: product.suggestSale || false,
    });

    const cartContainer = document.getElementById("cart-items");
    cartContainer.appendChild(cartItem);

    product.q--;
    return true;
  },

  changeItemQuantity: (product, itemElement, change) => {
    const qtyElement = itemElement.querySelector(".quantity-number");
    const currentQty = parseInt(qtyElement.textContent);
    const newQty = currentQty + change;

    if (newQty <= 0) {
      cartUtils.removeItem(product, itemElement);
      return;
    }

    if (change > 0 && product.q < change) {
      alert("재고가 부족합니다.");
      return;
    }

    qtyElement.textContent = newQty;
    product.q -= change;
  },

  removeItem: (product, itemElement) => {
    const qtyElement = itemElement.querySelector(".quantity-number");
    const quantity = parseInt(qtyElement.textContent);
    product.q += quantity;
    itemElement.remove();
  },
};

// Main cart event handler
const handleAddToCart = () => {
  const productSelector = document.getElementById("product-select");
  const selectedProductId = productSelector.value;
  const product = productUtils.findById(selectedProductId);

  if (!product) return;

  const existingItem = document.getElementById(selectedProductId);
  let success = false;

  if (existingItem) {
    success = cartUtils.updateItemQuantity(product, existingItem);
  } else {
    success = cartUtils.addNewItem(product);
  }

  if (success) {
    window.dispatchEvent(new CustomEvent("cart-updated"));
  }
};

// Register cart events
export const registerCartEvents = (onCalculate, onUpdateOptions) => {
  // Register Add to Cart button
  const addToCartButton = document.getElementById("add-to-cart");
  if (addToCartButton) {
    addToCartButton.addEventListener("click", (event) => {
      handleAddToCartClick(event, { onAddToCart: handleAddToCart });
    });
  }

  // Register cart item events (delegation)
  const cartContainer = document.getElementById("cart-items");
  if (cartContainer) {
    cartContainer.addEventListener("click", (event) => {
      handleCartClick(event, {
        cartUtils,
        productUtils,
        onCalculate,
        onUpdateOptions,
      });
    });
  }
};

export { cartUtils, productUtils, handleAddToCart };
