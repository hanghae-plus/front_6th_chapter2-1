import { CloseIcon, InfoIcon } from "../shared/components";

// Component creation functions
export function createProductDropdownSelect() {
	const select = document.createElement("select");
	select.id = "product-select";
	select.className = "w-full p-3 border border-gray-300 rounded-lg text-base mb-3";
	return select;
}

export function createCartAddButton() {
	const button = document.createElement("button");
	button.id = "add-to-cart";
	button.innerHTML = "Add to Cart";
	button.className =
		"w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";
	return button;
}

export function createStockWarningMessage() {
	const div = document.createElement("div");
	div.id = "stock-status";
	div.className = "text-xs text-red-500 mt-3 whitespace-pre-line";
	return div;
}

export function createProductSelectionPanel(selector, addButton, stockInfo) {
	const container = document.createElement("div");
	container.className = "mb-6 pb-6 border-b border-gray-200";
	
	container.appendChild(selector);
	container.appendChild(addButton);
	container.appendChild(stockInfo);
	
	return container;
}

export function createCartItemsContainer() {
	const div = document.createElement("div");
	div.id = "cart-items";
	return div;
}

export function createShoppingAreaColumn(selectorContainer, cartDisplay) {
	const leftColumn = document.createElement("div");
	leftColumn["className"] = "bg-white border border-gray-200 p-8 overflow-y-auto";
	leftColumn.appendChild(selectorContainer);
	leftColumn.appendChild(cartDisplay);
	return leftColumn;
}

export function createOrderSummaryColumn() {
	const rightColumn = document.createElement("div");
	rightColumn.className = "bg-black text-white p-8 flex flex-col";
	rightColumn.innerHTML = /* HTML */ `
		<h2 class="tracking-extra-wide mb-5 text-xs font-medium uppercase">Order Summary</h2>
		<div class="flex flex-1 flex-col">
			<div id="summary-details" class="space-y-3"></div>
			<div class="mt-auto">
				<div id="discount-info" class="mb-4"></div>
				<div id="cart-total" class="border-t border-white/10 pt-5">
					<div class="flex items-baseline justify-between">
						<span class="text-sm uppercase tracking-wider">Total</span>
						<div class="text-2xl tracking-tight">₩0</div>
					</div>
					<div id="loyalty-points" class="mt-2 text-right text-xs text-blue-400">
						적립 포인트: 0p
					</div>
				</div>
				<div id="tuesday-special" class="mt-4 hidden rounded-lg bg-white/10 p-3">
					<div class="flex items-center gap-2">
						<span class="text-2xs">🎉</span>
						<span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
					</div>
				</div>
			</div>
		</div>
		<button
			class="tracking-super-wide mt-6 w-full cursor-pointer bg-white py-4 text-sm font-normal uppercase text-black transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
		>
			Proceed to Checkout
		</button>
		<p class="text-2xs mt-4 text-center leading-relaxed text-white/60">
			Free shipping on all orders.<br />
			<span id="points-notice">Earn loyalty points with purchase.</span>
		</p>
	`;
	return rightColumn;
}

export function createHelpModalToggleButton(manualOverlay, manualColumn) {
	const manualToggle = document.createElement("button");
	manualToggle.onclick = function () {
		manualOverlay.classList.toggle("hidden");
		manualColumn.classList.toggle("translate-x-full");
	};
	manualToggle.className =
		"fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50";
	manualToggle.innerHTML = InfoIcon();
	return manualToggle;
}

export function createHelpModalBackdrop(manualColumn) {
	const manualOverlay = document.createElement("div");
	manualOverlay.className = "fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300";
	manualOverlay.onclick = function (e) {
		if (e.target === manualOverlay) {
			manualOverlay.classList.add("hidden");
			manualColumn.classList.add("translate-x-full");
		}
	};
	return manualOverlay;
}

export function createHelpContentPanel() {
	const manualColumn = document.createElement("div");
	manualColumn.className =
		"fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300";
	manualColumn.innerHTML = /* HTML */ `
		<button
			class="absolute right-4 top-4 text-gray-500 hover:text-black"
			onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')"
		>
			${CloseIcon()}
		</button>
		<h2 class="mb-4 text-xl font-bold">📖 이용 안내</h2>
		<div class="mb-6">
			<h3 class="mb-3 text-base font-bold">💰 할인 정책</h3>
			<div class="space-y-3">
				<div class="rounded-lg bg-gray-100 p-3">
					<p class="mb-1 text-sm font-semibold">개별 상품</p>
					<p class="pl-2 text-xs text-gray-700">
						• 키보드 10개↑: 10%<br />
						• 마우스 10개↑: 15%<br />
						• 모니터암 10개↑: 20%<br />
						• 스피커 10개↑: 25%
					</p>
				</div>
				<div class="rounded-lg bg-gray-100 p-3">
					<p class="mb-1 text-sm font-semibold">전체 수량</p>
					<p class="pl-2 text-xs text-gray-700">• 30개 이상: 25%</p>
				</div>
				<div class="rounded-lg bg-gray-100 p-3">
					<p class="mb-1 text-sm font-semibold">특별 할인</p>
					<p class="pl-2 text-xs text-gray-700">
						• 화요일: +10%<br />
						• ⚡번개세일: 20%<br />
						• 💝추천할인: 5%
					</p>
				</div>
			</div>
		</div>
		<div class="mb-6">
			<h3 class="mb-3 text-base font-bold">🎁 포인트 적립</h3>
			<div class="space-y-3">
				<div class="rounded-lg bg-gray-100 p-3">
					<p class="mb-1 text-sm font-semibold">기본</p>
					<p class="pl-2 text-xs text-gray-700">• 구매액의 0.1%</p>
				</div>
				<div class="rounded-lg bg-gray-100 p-3">
					<p class="mb-1 text-sm font-semibold">추가</p>
					<p class="pl-2 text-xs text-gray-700">
						• 화요일: 2배<br />
						• 키보드+마우스: +50p<br />
						• 풀세트: +100p<br />
						• 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
					</p>
				</div>
			</div>
		</div>
		<div class="mt-4 border-t border-gray-200 pt-4">
			<p class="mb-1 text-xs font-bold">💡 TIP</p>
			<p class="text-2xs leading-relaxed text-gray-600">
				• 화요일 대량구매 = MAX 혜택<br />
				• ⚡+💝 중복 가능<br />
				• 상품4 = 품절
			</p>
		</div>
	`;
	return manualColumn;
}

export function createMainLayoutGrid(leftColumn, rightColumn) {
	const gridContainer = document.createElement("div");
	gridContainer.className =
		"grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";
	gridContainer.appendChild(leftColumn);
	gridContainer.appendChild(rightColumn);
	return gridContainer;
}

export function createShoppingCartItemElement(itemToAdd) {
	const newItem = document.createElement("div");
	newItem.id = itemToAdd.id;
	newItem.className =
		"grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0";
	newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${itemToAdd.onSale && itemToAdd.suggestSale ? "⚡💝" : itemToAdd.onSale ? "⚡" : itemToAdd.suggestSale ? "💝" : ""}${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? "text-purple-600" : itemToAdd.onSale ? "text-red-500" : "text-blue-500"}">₩${itemToAdd.val.toLocaleString()}</span>` : `₩${itemToAdd.val.toLocaleString()}`}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? "text-purple-600" : itemToAdd.onSale ? "text-red-500" : "text-blue-500"}">₩${itemToAdd.val.toLocaleString()}</span>` : `₩${itemToAdd.val.toLocaleString()}`}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
	return newItem;
}