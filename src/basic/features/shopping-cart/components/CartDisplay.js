/**
 * Pure render function for Cart Display with local state
 * @param {Object} props - Component properties
 * @param {Array} props.cartItems - Cart items array
 * @param {Function} props.onItemChange - Callback when items change
 * @param {Function} props.onTotalsUpdate - Callback when totals need update
 * @returns {HTMLElement} Cart display element
 */
function CartDisplay(props = {}) {
  const { cartItems = [], onItemChange, onTotalsUpdate } = props;

  // Local state (useState-like pattern)
  let internalCartItems = [...cartItems];

  const cartContainer = document.createElement("div");
  cartContainer.id = "cart-items"; // Keep for test compatibility
  cartContainer.className = "space-y-3";

  // Local state updaters
  const updateCartItem = (productId, newQuantity) => {
    const itemIndex = internalCartItems.findIndex(
      (item) => item.id === productId
    );

    if (itemIndex >= 0) {
      if (newQuantity <= 0) {
        // Remove item
        internalCartItems.splice(itemIndex, 1);
      } else {
        // Update quantity
        internalCartItems[itemIndex] = {
          ...internalCartItems[itemIndex],
          quantity: newQuantity,
        };
      }

      // Re-render and notify parent
      renderCartItems();
      notifyParent();
    }
  };

  const addCartItem = (product, quantity = 1) => {
    const existingItemIndex = internalCartItems.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const newQuantity =
        internalCartItems[existingItemIndex].quantity + quantity;
      updateCartItem(product.id, newQuantity);
    } else {
      // Add new item
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.val,
        quantity: quantity,
        product: product,
      };

      internalCartItems.push(newItem);
      renderCartItems();
      notifyParent();
    }
  };

  const removeCartItem = (productId) => {
    updateCartItem(productId, 0);
  };

  // Notify parent of changes
  const notifyParent = () => {
    if (onItemChange) {
      onItemChange([...internalCartItems]);
    }
    if (onTotalsUpdate) {
      onTotalsUpdate();
    }
  };

  // Render individual cart item
  const createCartItemElement = (item) => {
    const itemDiv = document.createElement("div");
    itemDiv.id = item.id;
    itemDiv.className =
      "bg-white border border-gray-200 rounded-lg p-4 shadow-sm";

    itemDiv.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h3 class="font-medium text-gray-900">${item.name}</h3>
          <p class="text-sm text-gray-500">₩${item.price.toLocaleString()} x ${
      item.quantity
    }</p>
          <p class="text-lg font-bold text-gray-900">₩${(
            item.price * item.quantity
          ).toLocaleString()}</p>
        </div>
        <div class="flex items-center space-x-2 ml-4">
          <button 
            class="quantity-change w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
            data-product-id="${item.id}"
            data-change="-1">
            <span class="text-gray-600 font-medium">-</span>
          </button>
          <span class="w-8 text-center font-medium">${item.quantity}</span>
          <button 
            class="quantity-change w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
            data-product-id="${item.id}"
            data-change="1">
            <span class="text-gray-600 font-medium">+</span>
          </button>
          <button 
            class="remove-item ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
            data-product-id="${item.id}">
            Remove
          </button>
        </div>
      </div>
    `;

    return itemDiv;
  };

  // Render all cart items
  const renderCartItems = () => {
    cartContainer.innerHTML = "";

    if (internalCartItems.length === 0) {
      cartContainer.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <p>장바구니가 비어있습니다</p>
        </div>
      `;
      return;
    }

    internalCartItems.forEach((item) => {
      cartContainer.appendChild(createCartItemElement(item));
    });
  };

  // Event delegation for cart interactions
  cartContainer.addEventListener("click", (event) => {
    const target = event.target;
    const productId = target.dataset.productId;

    if (!productId) return;

    if (target.classList.contains("quantity-change")) {
      const change = parseInt(target.dataset.change);
      const currentItem = internalCartItems.find(
        (item) => item.id === productId
      );

      if (currentItem) {
        const newQuantity = Math.max(0, currentItem.quantity + change);
        updateCartItem(productId, newQuantity);
      }
    } else if (target.classList.contains("remove-item")) {
      removeCartItem(productId);
    }
  });

  // Initial render
  renderCartItems();

  // Expose methods for external updates
  cartContainer.addItem = addCartItem;
  cartContainer.updateItem = updateCartItem;
  cartContainer.removeItem = removeCartItem;
  cartContainer.updateItems = (newItems) => {
    internalCartItems = [...newItems];
    renderCartItems();
  };
  cartContainer.getItems = () => [...internalCartItems];

  return cartContainer;
}

export { CartDisplay };
