class Header {
  constructor(productsCount = 0, parentElement) {
    this.parentElement = parentElement;
    this.container = null;
    this.productsCount = productsCount;
  }

  template() {
    return `
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">
        🛒 Hanghae Online Store
      </h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">
        🛍️ ${this.productsCount} items in cart
      </p>
    `;
  }

  render() {
    this.container = document.createElement('div');
    this.container.classList.add('mb-8');
    this.container.innerHTML = this.template();
    this.parentElement.appendChild(this.container);
  }

  updateProductCount(newCount) {
    this.productsCount = newCount;

    const productCountElement = this.container.querySelector('#item-count');
    if (productCountElement) {
      productCountElement.textContent = `🛍️ ${newCount} items in cart`;
      this.productsCount = newCount;
    }

    if (this.productsCount !== newCount) {
      productCountElement.setAttribute('data-changed', 'true');
    }
  }
}

export default Header;
