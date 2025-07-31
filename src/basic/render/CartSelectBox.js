import { 
  getProductList, 
  getLowStockItems, 
  calculateTotalStock 
} from "../data/index.js";
import { UI_CONSTANTS } from "./constants.js";

export const CartSelectBox = /*html*/ `
  <div class="mb-6 pb-6 border-b border-gray-200">
    <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3">
    </select>
    <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">
      Add to Cart
    </button>
    <div id="stock-status" class="text-xs ${UI_CONSTANTS.COLORS.ERROR_TEXT} mt-3 whitespace-pre-line"></div>
  </div>
`;

// 상품 선택 옵션 업데이트
export const updateCartSelectOptions = () => {
  const productList = getProductList();
  const productSelect = document.getElementById('product-select');
  const totalStock = calculateTotalStock();
  
  if (!productSelect) return;

  // 현재 선택된 값을 보존
  const currentSelection = productSelect.value;
  
  productSelect.innerHTML = '';

  // 각 상품에 대한 옵션 생성 (기본 옵션 없이)
  productList.forEach(product => {
    const optionElement = document.createElement('option');
    optionElement.value = product.id;
    let discountText = '';

    // 할인 상태 표시
    if (product.isOnSale) discountText += ' ⚡SALE';
    if (product.isSuggestedSale) discountText += ' 💝추천';

    // 품절 상품 처리
    if (product.stock === 0) {
      optionElement.textContent = `${product.name} - ${product.price}원 (품절)${discountText}`;
      optionElement.disabled = true;
      optionElement.className = UI_CONSTANTS.COLORS.LIGHT_GRAY_TEXT;
    } else {
      // 할인 상품 표시
      if (product.isOnSale && product.isSuggestedSale) {
        optionElement.textContent = `⚡💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (25% SUPER SALE!)`;
        optionElement.className = UI_CONSTANTS.COLORS.DUAL_SALE_PRICE + ' font-bold';
      } else if (product.isOnSale) {
        optionElement.textContent = `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원 (20% SALE!)`;
        optionElement.className = UI_CONSTANTS.COLORS.SALE_PRICE + ' font-bold';
      } else if (product.isSuggestedSale) {
        optionElement.textContent = `💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (5% 추천!)`;
        optionElement.className = UI_CONSTANTS.COLORS.SUGGESTED_PRICE + ' font-bold';
      } else {
        optionElement.textContent = `${product.name} - ${product.price}원${discountText}`;
      }
    }

    productSelect.appendChild(optionElement);
  });

  // 이전에 선택된 값이 있고 해당 옵션이 여전히 존재하면 복원
  if (currentSelection && productSelect.querySelector(`option[value="${currentSelection}"]`)) {
    productSelect.value = currentSelection;
  }

  // 총 재고 정보 업데이트
  const stockStatusElement = document.getElementById('stock-status');
  if (stockStatusElement) {
    stockStatusElement.textContent = `Total Stock: ${totalStock} items`;
  }
};

// 재고 정보 업데이트
export const updateStockInfo = () => {
  const stockInfoElement = document.getElementById('stock-status');
  if (!stockInfoElement) return;

  const productList = getProductList();
  const stockMessages = [];
  
  // 모든 상품의 재고 상태를 체크
  productList.forEach(product => {

    if (product.stock === 0) {
      // 품절 상품
      stockMessages.push(`${product.name}: 품절`);
    } else if (product.stock > 0 && product.stock < 5) {
      // 재고 부족 상품 (5개 미만)
      stockMessages.push(`${product.name}: 재고 부족 (${product.stock}개 남음)`);
    }
  });
  
  // 재고 상태 메시지 표시
  if (stockMessages.length > 0) {
    stockInfoElement.textContent = stockMessages.join(' | ');
    stockInfoElement.style.display = 'block';
  } else {
    stockInfoElement.textContent = '';
    stockInfoElement.style.display = 'none';
  }
};

