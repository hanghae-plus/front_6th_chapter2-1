import { getAllProducts } from '../managers/product';
import { STOCK_THRESHOLDS } from '../constants/shopPolicy.js';

export function createProductOptions() {
  const container = document.createElement('select');
  container.id = 'product-select';
  container.className =
    'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  // 옵션 업데이트 메서드 추가
  container.updateOptions = function (stockThresholds) {
    const products = getAllProducts();

    container.innerHTML = '';

    let totalStock = 0;
    for (let idx = 0; idx < products.length; idx++) {
      totalStock += products[idx].quantity;
    }

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const opt = document.createElement('option');
      opt.value = product.id;

      let discountText = '';
      if (product.isLightningSale) discountText += ' ⚡SALE';
      if (product.isSuggestSale) discountText += ' 💝추천';

      if (product.quantity === 0) {
        opt.textContent = `${product.name} - ${product.price}원 (품절)${discountText}`;
        opt.disabled = true;
        opt.className = 'text-gray-400';
      } else {
        if (product.isLightningSale && product.isSuggestSale) {
          opt.textContent = `⚡💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (25% SUPER SALE!)`;
          opt.className = 'text-purple-600 font-bold';
        } else if (product.isLightningSale) {
          opt.textContent = `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원 (20% SALE!)`;
          opt.className = 'text-red-500 font-bold';
        } else if (product.isSuggestSale) {
          opt.textContent = `💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (5% 추천할인!)`;
          opt.className = 'text-blue-500 font-bold';
        } else {
          opt.textContent = `${product.name} - ${product.price}원${discountText}`;
        }
      }

      container.appendChild(opt);
    }

    if (totalStock < stockThresholds.WARNING) {
      container.style.borderColor = 'orange';
    } else {
      container.style.borderColor = '';
    }
  };

  // 생성과 동시에 옵션 초기화
  container.updateOptions(STOCK_THRESHOLDS);

  return container;
}
