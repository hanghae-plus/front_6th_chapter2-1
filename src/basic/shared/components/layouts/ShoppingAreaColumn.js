export function ShoppingAreaColumn(selectorContainerHTML, cartDisplayHTML) {
	return /* HTML */ `
		<div class="bg-white border border-gray-200 p-8 overflow-y-auto">
			${selectorContainerHTML}
			${cartDisplayHTML}
		</div>
	`;
}
