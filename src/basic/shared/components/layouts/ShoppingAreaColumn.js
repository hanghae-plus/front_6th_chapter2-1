export function ShoppingAreaColumn(selectorContainerHTML, cartDisplayHTML) {
	return /* HTML */ `
		<div class="overflow-y-auto border border-gray-200 bg-white p-8">
			${selectorContainerHTML} ${cartDisplayHTML}
		</div>
	`;
}
