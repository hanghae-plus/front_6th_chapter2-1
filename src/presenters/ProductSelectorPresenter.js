import Product from "../domain/Product.js";

export default class ProductSelectorPresenter {
  /**
   * @param {HTMLSelectElement} selectEl
   * @param {Product[]} products
   */
  constructor(selectEl, products) {
    this.selectEl = selectEl;
    this.products = products;
    this.render();
  }

  render() {
    // preserve current selection value
    const current = this.selectEl.value;
    this.selectEl.innerHTML = "";
    let totalStock = 0;
    this.products.forEach((p) => (totalStock += p.stock));
    this.products.forEach((product) => {
      const opt = document.createElement("option");
      opt.value = product.id;

      let label = `${product.name} - ${product.salePrice}원`;
      if (!product.hasStock()) {
        label += " (품절)";
        opt.disabled = true;
        opt.className = "text-gray-400";
      }
      opt.textContent = label;
      this.selectEl.appendChild(opt);
    });

    // restore selection if still available
    if (current) {
      const opt = this.selectEl.querySelector(`option[value="${current}"]`);
      if (opt) this.selectEl.value = current;
    }

    // 전체 재고 테두리 강조
    if (totalStock < 50) {
      this.selectEl.style.borderColor = "orange";
    } else {
      this.selectEl.style.borderColor = "";
    }
  }
}
