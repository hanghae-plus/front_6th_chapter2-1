export function ManualOverlay(props = {}) {
	const { children } = props;

	return /* HTML */ `
		<div
			id="manual-overlay"
			class="fixed inset-0 z-40 hidden bg-black/50 transition-opacity duration-300"
		>
			${children}
		</div>
	`;
}
