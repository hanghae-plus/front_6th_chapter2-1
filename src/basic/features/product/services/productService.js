// 리액트처럼 간단한 state import
import { productState, setProductState } from '../store/ProductStore.js';
import {
  getTotalStock,
  generateStockStatusMessage,
} from '../utils/productUtils.js';

export const initializeProductService = () => {
  // 초기화 로직이 필요하면 여기에
};

export const updateProductSelector = () => {
  const productSelector = document.getElementById('product-select');
  if (!productSelector) return;

  productSelector.updateProducts(
    productState.products,
    productState.lastSelectedProduct,
  );

  const totalStock = getTotalStock(productState.products);

  if (totalStock < 50) {
    productSelector.style.borderColor = 'orange';
  } else {
    productSelector.style.borderColor = '';
  }
};

export const updateStockInfo = () => {
  const stockInfoElement = document.getElementById('stock-status');
  if (!stockInfoElement) return;

  const infoMsg = generateStockStatusMessage(productState.products, 5);
  stockInfoElement.textContent = infoMsg;
};
