export function ProductSelectionPanel(selectorHTML, addButtonHTML, stockInfoHTML) {
	return /* HTML */ `
		<div class="mb-6 border-b border-gray-200 pb-6">
			${selectorHTML} ${addButtonHTML} ${stockInfoHTML}
		</div>
	`;
}
