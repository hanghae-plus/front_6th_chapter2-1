import { handleUpdateProductSelectOptions } from './controller/handleProductSelector';
import { cartManager } from './domain/cart';
import { calculateBonusPoints, renderBonusPoints } from './domain/point';
import { initialProducts, LIGHTNING_DISCOUNT, OUT_OF_STOCK, SUGGEST_DISCOUNT } from './domain/product';
import productManager from './domain/product';
import { applyItemDiscount, applyTotalDiscount } from './usecase/applyDiscount';
import { isTuesday } from './utils/dateUtil';
import { globalElements } from './view/globalElements';
import { renderLayout } from './view/layout';

let totalAmount = 0;

const initProducts = () => {
  productManager.setProducts(initialProducts);
};

function main() {
  const lightningDelay = Math.random() * 10000;

  const layoutNodes = renderLayout();
  globalElements.productSelector = layoutNodes.productSelector;
  globalElements.addCartButton = layoutNodes.addCartButton;
  globalElements.cartDisplay = layoutNodes.cartDisplay;
  globalElements.stockInfo = layoutNodes.stockInfo;
  globalElements.cartSummary = layoutNodes.cartSummary;

  /* 데이터 준비 */
  initProducts();
  handleUpdateProductSelectOptions();
  calculateCart();

  /* 번개 세일 */
  setTimeout(() => {
    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * productManager.getProductCount());

      const randomItem = productManager.getProductAt(randomIndex);

      if (randomItem.quantity > OUT_OF_STOCK && !randomItem.onSale) {
        randomItem.discountValue = Math.round(randomItem.originalVal * (1 - LIGHTNING_DISCOUNT));
        randomItem.onSale = true;
        alert(`⚡번개세일! ${randomItem.name}이(가) 20% 할인 중입니다!`);

        handleUpdateProductSelectOptions();
        updatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);

  /* 추천 세일 */
  setTimeout(() => {
    setInterval(() => {
      if (cartManager.getLastAddedItem()) {
        const suggest = productManager
          .getProducts()
          .find((product) => product.id !== cartManager.getLastAddedItem() && product.quantity > OUT_OF_STOCK);

        if (suggest) {
          alert(`💝  ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggest.discountValue = Math.round(suggest.discountValue * (1 - SUGGEST_DISCOUNT));
          suggest.suggestSale = true;

          handleUpdateProductSelectOptions();
          updatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

// /* 상품 셀렉트 박스(selectedItem)의 옵션을 현재 상품 상태에 맞게 갱신 */
// function handleUpdateProductSelectOptions() {
//   globalElements.productSelector.innerHTML = '';

//   const options = productManager.getProductOptions();

//   options.forEach((option) => {
//     const optionElement = createProductSelectorOption(option);
//   });
//   productManager.getProducts().map((product) => {
//     const optionElement = createProductSelectorOption({
//       value: product.id,
//       message: productManager.getOptionMessage(product),
//       disabled: product.quantity === OUT_OF_STOCK,
//     });

//     globalElements.productSelector.appendChild(optionElement);
//   });

//   if (productManager.isLowTotalStock()) {
//     globalElements.productSelector.style.borderColor = 'orange';
//   } else {
//     globalElements.productSelector.style.borderColor = '';
//   }
// }

/**
 * 총 상품 수량 및 가격 계산
 * 개별 할인 (10개 이상 구매), 대량 구매 할인(30개↑), 화요일 할인 적용
 * 총 할인율 및 적립 포인트 계산
 * 할인 정보 및 재고 경고 표시
 *
 * doRenderBonusPoints, handleStockInfoUpdate 호출 중
 */
function calculateCart() {
  const cartItems = globalElements.cartDisplay.children;

  let originalTotal;

  let savedAmount;
  let summaryDetails;
  let totalDiv;
  let loyaltyPointsDiv;
  let points;
  let discountInfoDiv;
  let itemCountElement;
  let previousCount;
  let stockMsg;

  const { subTotal, totalAfterItemDiscount, appliedItemDiscounts } = applyItemDiscount();
  totalAmount = totalAfterItemDiscount;

  const { finalTotal, finalDiscountRate } = applyTotalDiscount({
    subTotal,
    totalAfterItemDiscount,
    appliedItemDiscounts,
  });
  totalAmount = finalTotal;

  /** @todo 뷰 업데이트 부분. 분리 필요 */
  for (const itemElement of cartItems) {
    const priceElems = itemElement.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(function (elem) {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight = cartManager.getQuantityByProductId(itemElement.id) >= 10 ? 'bold' : 'normal';
      }
    });
  }
  document.getElementById('tuesday-special').classList.toggle('hidden', !isTuesday());
  document.getElementById('item-count').textContent = '🛍️ ' + cartManager.getTotalItem() + ' items in cart';

  summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  if (subTotal > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      var curItem;
      for (let j = 0; j < productManager.getProductCount(); j++) {
        const product = productManager.getProductAt(j);
        if (product.id === cartItems[i].id) {
          curItem = product;
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.discountValue * q;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTotal.toLocaleString()}</span>
      </div>
    `;
    if (cartManager.getTotalItem() >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (appliedItemDiscounts.length > 0) {
      appliedItemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }
    if (isTuesday()) {
      if (totalAmount > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  totalDiv = globalElements.cartSummary.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmount).toLocaleString();
  }

  loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmount / 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }

  discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (finalDiscountRate > 0 && totalAmount > 0) {
    savedAmount = originalTotal - totalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(finalDiscountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + cartManager.getTotalItem() + ' items in cart';
    if (previousCount !== cartManager.getTotalItem()) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

  stockMsg = '';
  for (let stockIdx = 0; stockIdx < productManager.getProductCount(); stockIdx++) {
    const item = productManager.getProductAt(stockIdx);
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        stockMsg = stockMsg + item.name + ': 재고 부족 (' + item.quantity + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  globalElements.stockInfo.textContent = stockMsg;

  updateStockMessage();
  updateBonusPoint();
}

const updateBonusPoint = () => {
  if (globalElements.cartDisplay.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  const { total, detail } = calculateBonusPoints(cartManager.getItems(), totalAmount);

  renderBonusPoints(total, detail);
};

/**  재고 부족/품절 상품의 메시지를 stockInfo에 표시 */
const updateStockMessage = () => {
  const infoMessage = productManager.getLowStockMessages();

  // @todo ui업데이트. 따로 분리
  globalElements.stockInfo.textContent = infoMessage;
};

/** 장바구니 내 각 상품의 UI 가격 정보 업데이트 */
function updatePricesInCart() {
  const cartItems = globalElements.cartDisplay.children;

  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    const product = productManager.getProductById(itemId);

    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');

      let icon = '';
      let priceColor = '';
      const showDiscount = product.originalVal !== product.discountValue;

      if (product.onSale && product.suggestSale) {
        icon = '⚡💝';
        priceColor = 'text-purple-600';
      } else if (product.onSale) {
        icon = '⚡';
        priceColor = 'text-red-500';
      } else if (product.suggestSale) {
        icon = '💝';
        priceColor = 'text-blue-500';
      }

      nameDiv.textContent = `${icon}${product.name}`;

      if (showDiscount) {
        priceDiv.innerHTML = `
    <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span>
    <span class="${priceColor}">₩${product.discountValue.toLocaleString()}</span>
  `;
      } else {
        priceDiv.textContent = `₩${product.discountValue.toLocaleString()}`;
      }
    }
  }
  calculateCart();
}

main();

/** 장바구니 담기 버튼 클릭 이벤트 핸들러 */
globalElements.addCartButton.addEventListener('click', function () {
  const selectedItem = globalElements.productSelector.value;
  const itemToAdd = productManager.getProducts().find((product) => product.id === selectedItem);

  if (!selectedItem || !itemToAdd) {
    return;
  }

  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd['id']);

    if (item) {
      // 기존에 장바구니에 있던 아이템의 경우

      const quantityElement = item.querySelector('.quantity-number');

      /** @todo 나중엔 cartManager통해 해당 id의 수량이 몇개인지 들고올 거임 */
      const newQuantity = parseInt(quantityElement['textContent']) + 1;

      if (newQuantity <= itemToAdd.quantity + parseInt(quantityElement.textContent)) {
        cartManager.changeQuantity(itemToAdd.id, 1);
        productManager.changeQuantity(itemToAdd.id, -1);

        quantityElement.textContent = newQuantity;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 기존에 장바구니에 없던 아이템인 경우
      cartManager.addItem(itemToAdd.id);
      productManager.changeQuantity(itemToAdd.id, -1);

      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${itemToAdd.onSale && itemToAdd.suggestSale ? '⚡💝' : itemToAdd.onSale ? '⚡' : itemToAdd.suggestSale ? '💝' : ''}${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + itemToAdd.discountValue.toLocaleString() + '</span>' : '₩' + itemToAdd.discountValue.toLocaleString()}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + itemToAdd.discountValue.toLocaleString() + '</span>' : '₩' + itemToAdd.discountValue.toLocaleString()}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
      globalElements.cartDisplay.appendChild(newItem);
    }
    calculateCart();
  }
});

/** 장바구니에서 수량 조절(±), 제거 이벤트 처리 */
globalElements.cartDisplay.addEventListener('click', function (event) {
  const target = event.target;

  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    const targetProductId = target.dataset.productId;
    const itemElement = document.getElementById(targetProductId);
    const quantityElement = itemElement.querySelector('.quantity-number');

    const targetProduct = productManager.getProductById(targetProductId);

    if (target.classList.contains('quantity-change')) {
      const quantityChange = parseInt(target.dataset.change);

      const currentQuantity = cartManager.getQuantityByProductId(targetProductId);

      const newQuantity = currentQuantity + quantityChange;
      // 총 수량보다 클 순 없으니..
      if (newQuantity > 0 && newQuantity <= targetProduct.quantity + currentQuantity) {
        quantityElement.textContent = newQuantity;

        cartManager.changeQuantity(targetProductId, +1);
        productManager.changeQuantity(targetProductId, -1);
      } else if (newQuantity <= 0) {
        itemElement.remove();

        cartManager.removeItem(targetProductId);
        productManager.changeQuantity(targetProductId, currentQuantity);
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      const removedQuantity = cartManager.getQuantityByProductId(targetProductId);

      cartManager.removeItem(targetProductId);
      productManager.changeQuantity(targetProductId, removedQuantity);
      itemElement.remove();
    }
    // if (targetProduct && targetProduct.quantity < 5) {
    // }
    calculateCart();
    handleUpdateProductSelectOptions();
  }
});
