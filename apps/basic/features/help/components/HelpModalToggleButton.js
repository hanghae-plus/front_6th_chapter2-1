import { InfoIcon } from "../../../shared/components";

export function HelpModalToggleButton() {
	return /* HTML */ `
		<button
			id="help-modal-toggle"
			class="fixed right-4 top-4 z-50 rounded-full bg-black p-3 text-white transition-colors hover:bg-gray-900"
		>
			${InfoIcon()}
		</button>
	`;
}
