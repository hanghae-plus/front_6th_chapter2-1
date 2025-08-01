import { useHelpPortal } from "../contexts";
import { ContentPanel, HelpDrawerBackdrop } from "./__private__";

export function HelpDrawer() {
	const { close, isOpen } = useHelpPortal();

	return (
		<>
			<HelpDrawerBackdrop onClose={close} isOpen={isOpen} />
			<ContentPanel onClose={close} isOpen={isOpen} />
		</>
	);
}
