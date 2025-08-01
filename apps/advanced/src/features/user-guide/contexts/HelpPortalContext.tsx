import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";

type HelpPortalContext = {
	open: () => void;
	close: () => void;
	isOpen: boolean;
};

const HelpPortalContext = createContext<HelpPortalContext | null>(null);

export function useHelpPortal() {
	const ctx = useContext(HelpPortalContext);
	if (!ctx) {
		throw new Error("useHelpPortal must be used within HelpPortalProvider");
	}

	return ctx;
}

export function HelpPortalProvider({ children }: PropsWithChildren) {
	const [isOpen, setIsOpen] = useState(false);

	const contextValue = useMemo(
		() => ({
			open: () => setIsOpen(true),
			close: () => setIsOpen(false),
			isOpen
		}),
		[isOpen]
	);

	return <HelpPortalContext.Provider value={contextValue}>{children}</HelpPortalContext.Provider>;
}
