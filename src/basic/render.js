import { STOCK_ALERT, LOW_STOCK_BORDER } from './product/constants.js';
import { calcCartTotals, calcBonusPoints } from './calculation.js';
import { $ } from './utils/utils.js';
import { CartItem } from './components/CartItem.js';

function renderProductOptions(state) {
  const sel = $('#product-select');
  const current = state.lastSelectedProduct || sel.value;
  sel.innerHTML = '';
  const totalStock = state.productList.reduce((a, p) => a + p.stock, 0);
  state.productList.forEach((p) => {
    const opt = document.createElement('option');
    opt.value = p.id;
    if (p.stock === 0) {
      opt.disabled = true;
      opt.textContent = `${p.name} - ${p.price}원 (품절)`;
      opt.className = 'text-gray-400';
    } else {
      let discountText = '';
      if (p.onSale && p.suggest) {
        opt.textContent = `⚡💝${p.name} - ${p.originalPrice}원 → ${p.price}원 (25% SUPER SALE!)`;
        opt.className = 'text-purple-600 font-bold';
      } else if (p.onSale) {
        opt.textContent = `⚡${p.name} - ${p.originalPrice}원 → ${p.price}원 (20% SALE!)`;
        opt.className = 'text-red-500 font-bold';
      } else if (p.suggest) {
        opt.textContent = `💝${p.name} - ${p.originalPrice}원 → ${p.price}원 (5% 추천할인!)`;
        opt.className = 'text-blue-500 font-bold';
      } else {
        opt.textContent = `${p.name} - ${p.price}원`;
      }
    }
    sel.appendChild(opt);
  });
  if ([...sel.options].some((o) => o.value === current && !o.disabled)) {
    sel.value = current;
  } else {
    const firstEnabled = [...sel.options].find((o) => !o.disabled);
    if (firstEnabled) sel.value = firstEnabled.value;
  }

  sel.style.borderColor = totalStock < LOW_STOCK_BORDER ? 'orange' : '';
}

export function render(state) {
  state.totals = calcCartTotals(state, new Date());
  state.bonus = calcBonusPoints(state, new Date());

  renderProductOptions(state);

  const cartWrap = $('#cart-items');
  const alive = new Set();

  state.cartItems.forEach((ci) => {
    alive.add(ci.id);
    let row = cartWrap.querySelector(`#${ci.id}`);
    if (!row) {
      row = CartItem(ci, state);
      cartWrap.appendChild(row);
    }
    row.querySelector('.quantity-number').textContent = ci.qty;
    const product = state.productList.find((p) => p.id === ci.id);
    const individualPriceHtml =
      product.onSale || product.suggest
        ? `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-red-500">₩${product.price.toLocaleString()}</span>`
        : `₩${product.price.toLocaleString()}`;
    row.querySelector('.text-xs.text-black.mb-3').innerHTML =
      individualPriceHtml;

    const totalPriceHtml =
      product.onSale || product.suggest
        ? `<span class="line-through text-gray-400">₩${(product.originalPrice * ci.qty).toLocaleString()}</span> <span class="text-red-500">₩${(product.price * ci.qty).toLocaleString()}</span>`
        : `₩${(product.price * ci.qty).toLocaleString()}`;
    row.querySelector('.text-lg').innerHTML = totalPriceHtml;
  });
  [...cartWrap.children].forEach((el) => {
    if (!alive.has(el.id)) el.remove();
  });

  $('#item-count').textContent = `🛍️ ${state.totals.itemCnt} items in cart`;
  $('#cart-total .text-2xl').textContent =
    `₩${Math.round(state.totals.amount).toLocaleString()}`;

  const tue = $('#tuesday-special');
  if (state.totals.isTue && state.totals.amount > 0)
    tue.classList.remove('hidden');
  else tue.classList.add('hidden');

  const summaryDetails = $('#summary-details');
  let summaryHtml = ''; // Initialize summaryHtml

  if (state.totals.originalTotal > 0) {
    state.cartItems.forEach((ci) => {
      const product = state.productList.find((p) => p.id === ci.id);
      if (product) {
        summaryHtml += `
          <div class="flex justify-between text-xs tracking-wide text-gray-400">
            <span>${product.name} x ${ci.qty}</span>
            <span>₩${(product.price * ci.qty).toLocaleString()}</span>
          </div>
        `;
      }
    });

    summaryHtml += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${state.totals.originalTotal.toLocaleString()}</span>
      </div>
    `;

    if (state.totals.bulkDiscountRate > 0) {
      summaryHtml += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (${state.totals.bulkDiscountThreshold}개 이상)</span>
          <span class="text-xs">-${(state.totals.bulkDiscountRate * 100).toFixed(1)}%</span>
        </div>
      `;
    }

    if (
      state.totals.bulkDiscountRate === 0 &&
      state.totals.itemDiscounts &&
      state.totals.itemDiscounts.length > 0
    ) {
      state.totals.itemDiscounts.forEach((item) => {
        summaryHtml += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (${item.threshold}개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    if (state.totals.isTue && state.totals.amount > 0) {
      summaryHtml += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    summaryHtml += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
  summaryDetails.innerHTML = summaryHtml; // Assign accumulated HTML

  const discDiv = $('#discount-info');
  discDiv.innerHTML = '';
  if (state.totals.discountRate > 0) {
    const saved = state.totals.originalTotal - state.totals.amount;
    discDiv.innerHTML = `
  <div class="bg-green-500/20 rounded-lg p-3">
    <div class="flex justify-between items-center mb-1">
      <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
      <span class="text-sm font-medium text-green-400">${(state.totals.discountRate * 100).toFixed(1)}%</span>
    </div>
    <div class="text-2xs text-gray-300">₩${Math.round(saved).toLocaleString()} 할인되었습니다</div>
  </div>`;
  }

  const lp = $('#loyalty-points');
  if (state.totals.itemCnt === 0) {
    lp.style.display = 'none';
  } else {
    lp.style.display = 'block';
    lp.innerHTML = `적립 포인트: <span class="font-bold">${state.bonus.point}p</span><br><span class="text-2xs opacity-70">${state.bonus.details.join(', ')}</span>`;
  }

  let stockMsg = '';
  state.productList.forEach((p) => {
    if (p.stock === 0) {
      stockMsg += `${p.name}: 품절\n`;
    } else if (p.stock < STOCK_ALERT) {
      stockMsg += `${p.name}: 재고 부족 (${p.stock}개 남음)\n`;
    }
  });
  $('#stock-status').textContent = stockMsg;
}
