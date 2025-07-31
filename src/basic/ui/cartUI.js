/**
 * 장바구니 UI 관련 함수들
 * 원본 main.original.js의 레이아웃과 스타일을 100% 유지
 */
import { $ } from "../utils/$.js";
import {
  createUIElement,
  setElementAttributes,
  setElementHTML,
  setElementText,
} from "./uiHelpers.js";

/**
 * 새 장바구니 아이템 생성 - 원본과 동일
 * @param {Object} product - 상품 객체
 * @returns {Element} 생성된 장바구니 아이템 DOM 요소
 */
export function createCartItemElement(product) {
  const discountIcon =
    product.onSale && product.suggestSale
      ? "⚡💝"
      : product.onSale
        ? "⚡"
        : product.suggestSale
          ? "💝"
          : "";

  const priceDisplay =
    product.onSale || product.suggestSale
      ? `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="${product.onSale && product.suggestSale ? "text-purple-600" : product.onSale ? "text-red-500" : "text-blue-500"}">₩${product.val.toLocaleString()}</span>`
      : `₩${product.val.toLocaleString()}`;

  const itemTemplate = `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${discountIcon}${product.name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${priceDisplay}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
    </div>
  `;

  const newItem = createUIElement(`
    <div class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      ${itemTemplate}
    </div>
  `);

  return setElementAttributes(newItem, {
    id: product.id,
    className:
      "grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0",
  });
}

/**
 * 재고 정보 업데이트 - 원본과 동일
 * @param {Array} productList - 상품 목록
 */
export function updateStockInfo(productList) {
  const stockInfo = $("#stock-status");
  if (!stockInfo) return;

  let infoMsg = "";
  let totalStock = 0;

  // 총 재고 계산
  for (let i = 0; i < productList.length; i++) {
    totalStock += productList[i].q;
  }

  // 재고 부족/품절 정보 생성 - 원본과 동일
  productList.forEach(function (item) {
    if (item.q < 5) {
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ": 재고 부족 (" + item.q + "개 남음)\n";
      } else {
        infoMsg = infoMsg + item.name + ": 품절\n";
      }
    }
  });

  setElementText(stockInfo, infoMsg);
}

/**
 * 장바구니 내 가격 업데이트 - 원본과 동일
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 */
export function updatePricesInCart(cartItems, productList) {
  for (const cartItem of cartItems) {
    const itemId = cartItem.id;
    const product = productList.find((p) => p.id === itemId);

    if (!product) continue;

    const priceDiv = cartItem.querySelector(".text-lg");
    const nameDiv = cartItem.querySelector("h3");

    if (!priceDiv || !nameDiv) continue;

    if (product.onSale && product.suggestSale) {
      setElementHTML(
        priceDiv,
        `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.val.toLocaleString()}</span>`,
      );
      setElementText(nameDiv, "⚡💝" + product.name);
    } else if (product.onSale) {
      setElementHTML(
        priceDiv,
        `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.val.toLocaleString()}</span>`,
      );
      setElementText(nameDiv, "⚡" + product.name);
    } else if (product.suggestSale) {
      setElementHTML(
        priceDiv,
        `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`,
      );
      setElementText(nameDiv, "💝" + product.name);
    } else {
      setElementText(priceDiv, "₩" + product.val.toLocaleString());
      setElementText(nameDiv, product.name);
    }
  }
}
