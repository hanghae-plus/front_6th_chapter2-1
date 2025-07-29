// 리액트처럼 간단한 state import
import { productState, setProductState } from "../store/ProductStore.js";
import { ELEMENT_IDS } from "../../../shared/constants/element-ids.js";

export const initializeProductService = () => {
  // 초기화 로직이 필요하면 여기에
};

export const updateProductSelector = () => {
  const productSelector = document.getElementById("product-select");
  if (!productSelector) return;

  productSelector.updateProducts(
    productState.products,
    productState.lastSelectedProduct
  );

  const totalStock = productState.products.reduce(
    (sum, product) => sum + product.q,
    0
  );

  if (totalStock < 50) {
    productSelector.style.borderColor = "orange";
  } else {
    productSelector.style.borderColor = "";
  }
};

export const updateStockInfo = () => {
  const stockInfoElement = document.getElementById(ELEMENT_IDS.STOCK_STATUS);
  if (!stockInfoElement) return;

  // 모든 재고 부족/품절 상품을 표시
  let infoMsg = "";
  const products = productState.products;

  products.forEach((item) => {
    if (item.q < 5) {
      if (item.q > 0) {
        infoMsg += `${item.name}: 재고 부족 (${item.q}개 남음)\n`;
      } else {
        infoMsg += `${item.name}: 품절\n`;
      }
    }
  });

  stockInfoElement.textContent = infoMsg;
};

// 간단한 유틸들
export const productUtils = {
  findById: (productId, products = productState.products) => {
    return products.find((p) => p.id === productId);
  },

  isValid: (productId, products = productState.products) => {
    return products.some((p) => p.id === productId);
  },
};
