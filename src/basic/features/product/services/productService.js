import { BUSINESS_CONSTANTS } from "../../../shared/constants/business.js";
import StockManager from "./StockManager.js";

// Service instance
let stockManager;

export const initializeProductService = () => {
  stockManager = new StockManager(BUSINESS_CONSTANTS);
};

export const updateProductSelector = () => {
  const productSelector = document.getElementById("product-select");
  if (!productSelector || !productSelector.updateProducts) return;

  productSelector.updateProducts(
    window.productStore.getProducts(),
    window.productStore.getLastSelectedProduct()
  );

  const totalStock = window.productStore
    .getProducts()
    .reduce((sum, p) => sum + p.q, 0);

  // Original logic: border color change based on stock
  if (totalStock < BUSINESS_CONSTANTS.STOCK.STOCK_WARNING_THRESHOLD) {
    if (productSelector && productSelector.style) {
      productSelector.style.borderColor = "orange";
    }
  } else {
    if (productSelector && productSelector.style) {
      productSelector.style.borderColor = "";
    }
  }
};

export const updateStockInfo = () => {
  const stockInfoElement = document.getElementById("stock-status");
  if (!stockInfoElement) return;

  let infoMsg = "";
  const products = window.productStore.getProducts();

  products.forEach(function (item) {
    if (item.q < BUSINESS_CONSTANTS.STOCK.LOW_STOCK_THRESHOLD) {
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ": 재고 부족 (" + item.q + "개 남음)\n";
      } else {
        infoMsg = infoMsg + item.name + ": 품절\n";
      }
    }
  });

  stockInfoElement.textContent = infoMsg;
};

// Product utilities
export const productUtils = {
  findById: (productId, products = window.productStore.getProducts()) => {
    return products.find((product) => product.id === productId) || null;
  },

  isValid: (productId, products = window.productStore.getProducts()) => {
    if (!productId) return false;
    return products.some((product) => product.id === productId);
  },
};
