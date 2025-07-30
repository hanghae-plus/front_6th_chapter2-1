import { InfoIcon } from "../shared/components";

export function HelpModalToggleButton(manualOverlay, manualColumn) {
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