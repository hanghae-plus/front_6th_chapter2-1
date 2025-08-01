import { InfoIcon } from "../../../shared/components";
import { useHelpPortal } from "../contexts";

export function HelpModalOpenButton() {
	const { open } = useHelpPortal();

	return (
		<button
			className="fixed right-4 top-4 z-50 rounded-full bg-black p-3 text-white transition-colors hover:bg-gray-900"
			onClick={open}
		>
			<InfoIcon />
		</button>
	);
}
