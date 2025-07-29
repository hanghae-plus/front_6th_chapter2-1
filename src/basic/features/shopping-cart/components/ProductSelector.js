/**
 * Pure render function for Product Selector with local state
 * @param {Object} props - Component properties
 * @param {Array} props.products - Product list
 * @param {string} props.selectedProductId - Currently selected product ID
 * @param {Function} props.onSelectionChange - Callback when selection changes
 * @returns {HTMLElement} Product selector element
 */
function ProductSelector(props = {}) {
  const { products = [], selectedProductId = "", onSelectionChange } = props;

  // Local state (useState-like pattern)
  let internalSelectedId = selectedProductId;

  const selector = document.createElement("select");
  selector.id = "product-select"; // Changed to match test expectations
  selector.className =
    "w-full p-3 border border-gray-300 rounded-lg text-base mb-3"; // Simplified for test compatibility

  // Render options
  const renderOptions = () => {
    // Clear existing options (no default option for test compatibility)
    selector.innerHTML = "";

    // Product options
    products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.id;

      let optionText = `${product.name} - ${product.val}원`;

      // Add status indicators
      if (product.q === 0) {
        optionText += " (품절)";
        option.disabled = true;
      } else if (product.q < 5) {
        optionText += ` (재고부족: ${product.q}개)`;
      }

      // Add sale indicators
      if (product.onSale) {
        optionText = `⚡ ${optionText}`;
      }
      if (product.suggestSale) {
        optionText = `💝 ${optionText}`;
      }

      option.textContent = optionText;
      selector.appendChild(option);
    });

    // Set current selection
    selector.value = internalSelectedId;
  };

  // Local state updater
  const updateSelection = (newProductId) => {
    internalSelectedId = newProductId;
    selector.value = newProductId;

    // Notify parent component
    if (onSelectionChange) {
      onSelectionChange(newProductId);
    }
  };

  // Event handler with local state management
  selector.addEventListener("change", (event) => {
    updateSelection(event.target.value);
  });

  // Initial render
  renderOptions();

  // Expose update method for external updates
  selector.updateProducts = (newProducts, newSelectedId) => {
    // Update local state
    const updatedProps = {
      products: newProducts,
      selectedProductId: newSelectedId || internalSelectedId,
    };

    // Re-render with new data
    renderOptions();
  };

  return selector;
}

export { ProductSelector };
