import { CartItems } from './components/cart/cart-items';
import { AddToCartBtn } from './components/grid/add-to-cart-button';
import { GridContainer } from './components/grid/grid-container';
import { LeftColumn } from './components/grid/left-column';
import { ProductSelect } from './components/product-select/product-select';
import { RightColumn } from './components/grid/right-column';
import { SelectorContainer } from './components/grid/selector-container';
import { StockStatus } from './components/grid/stock-status';
import { Header } from './components/header';
import { ManualColumn } from './components/manual/manual-column';
import { ManualOverlay } from './components/manual/manual-overlay';
import { ManualToggle } from './components/manual/manual-toggle';
import { getProducts, isLowTotalQuantity } from './model/products';
import { appendChildren } from './utils/append-children';
import { selectById } from './utils/selector';
import { ProductSelectOption } from './components/product-select/product-select-option';
import { renderHeaderItemCount } from './render/header';
import {
  getCartFinalPrice,
  getCartItemQuantityFromDom,
  getCartTotalCount,
  getCartTotalPrice,
} from './model/cart';
import { renderDiscountInfo } from './render/discount-info';
import { renderSummaryDetails } from './render/summary-details';
import { renderCartTotal } from './render/cart';
import { renderPoint } from './render/point';
import { renderTuesdaySpecial } from './render/tuesday-special';
import { renderStockStatus } from './render/stock-status';

function main() {
  const root = document.getElementById('app');

  if (!root) {
    throw new Error('root not found');
  }

  appendChildren(root, [
    Header(),
    GridContainer({
      children: [
        LeftColumn({
          children: [
            SelectorContainer({
              children: [ProductSelect(), AddToCartBtn(), StockStatus()],
            }),
            CartItems(),
          ],
        }),
        RightColumn(),
      ],
    }),
    ManualToggle(),
    ManualOverlay({
      children: [ManualColumn()],
    }),
  ]);

  updateCartInfo();
}

export function updateProductSelect() {
  updateOptions();
  updateBorderColor();
}

function updateOptions() {
  const productSelect = selectById<HTMLSelectElement>('product-select');
  const prevSelected = productSelect.value;
  const products = getProducts();
  productSelect.innerHTML = products.map(ProductSelectOption).join('');
  productSelect.value = prevSelected;
}

function updateBorderColor() {
  const productSelect = selectById<HTMLSelectElement>('product-select');
  productSelect.style.borderColor = isLowTotalQuantity() ? 'orange' : '';
}

export function updateCartInfo() {
  const carts = getCartItemQuantityFromDom();
  const cartTotalCount = getCartTotalCount(carts);
  const totalPrice = getCartTotalPrice(carts);
  const finalTotalPrice = getCartFinalPrice({ carts, cartTotalCount });
  const discountRate = 1 - finalTotalPrice / totalPrice;

  renderHeaderItemCount(cartTotalCount);
  renderSummaryDetails({
    carts,
    cartTotalCount,
    totalPrice,
  });
  renderDiscountInfo({
    discountRate,
    totalPrice,
    finalTotalPrice,
  });
  renderCartTotal(finalTotalPrice);
  renderTuesdaySpecial();
  renderStockStatus();
  renderPoint({
    carts,
    cartTotalCount,
    finalTotalPrice,
  });
}

// const lightningDelay = Math.random() * 10000;
// setTimeout(() => {
//   setInterval(function () {
//     const productCount = getProductCount();
//     const products = getProducts();
//     const randomIndex = Math.floor(Math.random() * productCount);
//     const currentProduct = products[randomIndex];

//     if (!isSoldOut(currentProduct) && !hasLightningSale(currentProduct)) {
//       applyLightningSale(currentProduct.id);
//       alert(
//         '⚡번개세일! ' + currentProduct.name + '이(가) 20% 할인 중입니다!'
//       );
//       updateProductSelect();
//       doUpdatePricesInCart();
//     }
//   }, 30000);
// }, lightningDelay);
// setTimeout(function () {
//   setInterval(function () {
//     if (lastSel) {
//       const productCount = getProductCount();
//       const products = getProducts();

//       let suggest = null;
//       for (let k = 0; k < productCount; k++) {
//         const product = products[k];
//         if (product.id !== lastSel) {
//           if (product.quantity > 0) {
//             if (!hasSuggestSale(product)) {
//               suggest = product;
//               break;
//             }
//           }
//         }
//       }
//       if (suggest) {
//         alert(
//           '💝 ' +
//             suggest.name +
//             '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
//         );
//         applySuggestSale(suggest.id);
//         updateProductSelect();
//         doUpdatePricesInCart();
//       }
//     }
//   }, 60000);
// }, Math.random() * 20000);
// function doUpdatePricesInCart() {
//   const cartItems = cartDisp.children;
//   const productCount = getProductCount();
//   const products = getProducts();

//   for (let i = 0; i < cartItems.length; i++) {
//     const itemId = cartItems[i].id;
//     let product = null;
//     for (let productIdx = 0; productIdx < productCount; productIdx++) {
//       const _product = products[productIdx];
//       if (_product.id === itemId) {
//         product = _product;
//         break;
//       }
//     }

//     if (product) {
//       const priceDiv = cartItems[i].querySelector('.text-lg');
//       const nameDiv = cartItems[i].querySelector('h3');
//       if (hasAllSale(product)) {
//         priceDiv.innerHTML =
//           '<span class="line-through text-gray-400">₩' +
//           product.originalPrice.toLocaleString() +
//           '</span> <span class="text-purple-600">₩' +
//           product.price.toLocaleString() +
//           '</span>';
//         nameDiv.textContent = '⚡💝' + product.name;
//       } else if (hasLightningSale(product)) {
//         priceDiv.innerHTML =
//           '<span class="line-through text-gray-400">₩' +
//           product.originalPrice.toLocaleString() +
//           '</span> <span class="text-red-500">₩' +
//           product.price.toLocaleString() +
//           '</span>';
//         nameDiv.textContent = '⚡' + product.name;
//       } else if (hasSuggestSale(product)) {
//         priceDiv.innerHTML =
//           '<span class="line-through text-gray-400">₩' +
//           product.originalPrice.toLocaleString() +
//           '</span> <span class="text-blue-500">₩' +
//           product.price.toLocaleString() +
//           '</span>';
//         nameDiv.textContent = '💝' + product.name;
//       } else {
//         priceDiv.textContent = '₩' + product.price.toLocaleString();
//         nameDiv.textContent = product.name;
//       }
//     }
//   }
//   updateCartInfo();
// }

main();
