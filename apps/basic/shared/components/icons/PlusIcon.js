export function PlusIcon(props = {}) {
	const { className = "h-4 w-4" } = props;

	return /* HTML */ `
		<svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 6v6m0 0v6m0-6h6m-6 0H6"
			></path>
		</svg>
	`;
}
