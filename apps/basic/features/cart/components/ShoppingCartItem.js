import { MinusIcon, PlusIcon } from "../../../shared/components";

export function ShoppingCartItem(itemToAdd) {
	return /* HTML */ `
		<div
			id="${itemToAdd.id}"
			class="grid grid-cols-[80px_1fr_auto] gap-5 border-b border-gray-100 py-5 first:pt-0 last:border-b-0 last:pb-0"
		>
			<div class="bg-gradient-black relative h-20 w-20 overflow-hidden">
				<div
					class="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/10"
				></div>
			</div>
			<div>
				<h3 class="mb-1 text-base font-normal tracking-tight">
					${itemToAdd.onSale && itemToAdd.suggestSale
						? "⚡💝"
						: itemToAdd.onSale
							? "⚡"
							: itemToAdd.suggestSale
								? "💝"
								: ""}${itemToAdd.name}
				</h3>
				<p class="mb-0.5 text-xs tracking-wide text-gray-500">PRODUCT</p>
				<p class="mb-3 text-xs text-black">
					${itemToAdd.onSale || itemToAdd.suggestSale
						? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? "text-purple-600" : itemToAdd.onSale ? "text-red-500" : "text-blue-500"}">₩${itemToAdd.val.toLocaleString()}</span>`
						: `₩${itemToAdd.val.toLocaleString()}`}
				</p>
				<div class="flex items-center gap-4">
					<button
						class="quantity-change flex h-6 w-6 items-center justify-center border border-black bg-white text-sm transition-all hover:bg-black hover:text-white"
						data-product-id="${itemToAdd.id}"
						data-change="-1"
					>
						${MinusIcon()}
					</button>
					<span class="quantity-number min-w-[20px] text-center text-sm font-normal tabular-nums"
						>1</span
					>
					<button
						class="quantity-change flex h-6 w-6 items-center justify-center border border-black bg-white text-sm transition-all hover:bg-black hover:text-white"
						data-product-id="${itemToAdd.id}"
						data-change="1"
					>
						${PlusIcon()}
					</button>
				</div>
			</div>
			<div class="text-right">
				<div class="mb-2 text-lg tabular-nums tracking-tight">
					${itemToAdd.onSale || itemToAdd.suggestSale
						? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? "text-purple-600" : itemToAdd.onSale ? "text-red-500" : "text-blue-500"}">₩${itemToAdd.val.toLocaleString()}</span>`
						: `₩${itemToAdd.val.toLocaleString()}`}
				</div>
				<a
					class="remove-item text-2xs cursor-pointer border-b border-transparent uppercase tracking-wider text-gray-500 transition-colors hover:border-black hover:text-black"
					data-product-id="${itemToAdd.id}"
					>Remove</a
				>
			</div>
		</div>
	`;
}
