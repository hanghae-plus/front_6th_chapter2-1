class ProductSelector {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.container = null;
    this.productOptions = null;
  }

  template() {
    return `
      <select id="product-select" 
        class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"></select>
    `;
  }

  render() {
    this.container = this.template();
    this.parentElement.appendChild(this.container);
  }

  createOptions(value, optionData) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = optionData.text;
    option.disabled = optionData.disabled || false;
    if (optionData.classList) {
      option.classList.add(...optionData.classList.split(' '));
    }

    return option;
  }

  formatProductOption(product) {
    // 품절 시
    if (product.stock === 0) {
      return {
        text: `${product.name} - ${product.price}원 (품절)`,
        disabled: true,
        className: 'text-gray-400',
      };
    }

    // 번개 할인 + 추천 할인
    if (product.onSale && product.suggestSale) {
      return {
        text: `⚡💝 ${product.name} - ${product.originalPrice} -> ${product.price}원 (25% SUPER SALE!)`,
        disabled: false,
        className: 'text-purple-600 font-bold',
      };
    }

    // 번개 할인
    if (product.onSale && !product.suggestSale) {
      return {
        text: `⚡ ${product.name} - ${product.originalPrice} -> ${product.price}원 (20% SALE!)`,
        disabled: false,
        className: 'text-red-500 font-bold',
      };
    }

    // 추천 할인
    if (!product.onSale && product.suggestSale) {
      return {
        text: `💝 ${product.name} - ${product.originalPrice} -> ${product.price}원 (5% 추천할인!)`,
        disabled: false,
        className: 'text-blue-500 font-bold',
      };
    }

    return {
      text: `${product.name} - ${product.price}원`,
      disabled: false,
    };
  }

  updateOptions(products) {
    this.container.innerHTML = '';

    products.forEach((product) => {
      const optionData = this.formatProductOption(product);
      const option = this.createOptions(product.id, optionData);

      this.container.appendChild(option);
    });
  }
}

export default ProductSelector;
