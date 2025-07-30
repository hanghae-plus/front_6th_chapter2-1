import { InfoIcon } from "../../../shared/components/icons";

export function HelpModalToggleButton() {
	return /* HTML */ `
		<button
			id="help-modal-toggle"
			class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50"
		>
			${InfoIcon()}
		</button>
	`;
}
