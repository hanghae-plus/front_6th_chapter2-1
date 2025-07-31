export function MainLayoutGrid(leftColumnHTML, rightColumnHTML) {
	return /* HTML */ `
		<div class="grid flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[1fr_360px]">
			${leftColumnHTML} ${rightColumnHTML}
		</div>
	`;
}
