import { findProductById } from '../utils/product.js';

export class PriceUpdateService {
  constructor(productList, cartDisp, handleCalculateCartStuff) {
    this.productList = productList;
    this.cartDisp = cartDisp;
    this.handleCalculateCartStuff = handleCalculateCartStuff;
  }

  updatePricesInCart() {
    const cartItems = this.cartDisp.children;

    for (let i = 0; i < cartItems.length; i++) {
      const itemId = cartItems[i].id;
      const product = findProductById(this.productList, itemId);

      if (product) {
        this.updateProductDisplay(cartItems[i], product);
      }
    }

    // 가격 업데이트 후 장바구니 재계산
    this.handleCalculateCartStuff();
  }

  updateProductDisplay(cartItem, product) {
    const priceDiv = cartItem.querySelector('.text-lg');
    const nameDiv = cartItem.querySelector('h3');

    if (!priceDiv || !nameDiv) return;

    // 할인 상태에 따른 가격과 이름 업데이트
    if (product.onSale && product.suggestSale) {
      this.updateSuperSaleDisplay(priceDiv, nameDiv, product);
    } else if (product.onSale) {
      this.updateLightningSaleDisplay(priceDiv, nameDiv, product);
    } else if (product.suggestSale) {
      this.updateSuggestSaleDisplay(priceDiv, nameDiv, product);
    } else {
      this.updateNormalDisplay(priceDiv, nameDiv, product);
    }
  }

  updateSuperSaleDisplay(priceDiv, nameDiv, product) {
    priceDiv.innerHTML = `
      <span class="line-through text-gray-400">
        ₩${product.originalVal.toLocaleString()}
      </span>
      <span class="text-purple-600">
        ₩${product.val.toLocaleString()}
      </span>
    `;
    nameDiv.textContent = `⚡💝${product.name}`;
  }

  updateLightningSaleDisplay(priceDiv, nameDiv, product) {
    priceDiv.innerHTML = `
      <span class="line-through text-gray-400">
        ₩${product.originalVal.toLocaleString()}
      </span>
      <span class="text-red-500">
        ₩${product.val.toLocaleString()}
      </span>
    `;
    nameDiv.textContent = `⚡${product.name}`;
  }

  updateSuggestSaleDisplay(priceDiv, nameDiv, product) {
    priceDiv.innerHTML = `
      <span class="line-through text-gray-400">
        ₩${product.originalVal.toLocaleString()}
      </span>
      <span class="text-blue-500">
        ₩${product.val.toLocaleString()}
      </span>
    `;
    nameDiv.textContent = `💝${product.name}`;
  }

  updateNormalDisplay(priceDiv, nameDiv, product) {
    priceDiv.textContent = `₩${product.val.toLocaleString()}`;
    nameDiv.textContent = product.name;
  }
}
